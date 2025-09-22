import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { toast } from 'react-toastify';
import { handleError, getErrorMessage } from '../utils/errorHandler';
import { BLEContextType, BLEDevice, SensorData, emptySensorData } from '../types/ble.types';
import { useFirebase } from './FirebaseContext';

const ARDUINO_SERVICE_UUID = import.meta.env.VITE_SERVICE;
const ARDUINO_TEMPERATURE_UUID = import.meta.env.VITE_TEMPERATURE;
const ARDUINO_HUMIDITY_UUID = import.meta.env.VITE_HUMIDITY;
const ARDUINO_PRESSURE_UUID = import.meta.env.VITE_PRESSURE;
const ARDUINO_CO2_UUID = import.meta.env.VITE_CO2;
const ARDUINO_GAS_UUID = import.meta.env.VITE_GAS;
const ARDUINO_ACCELEROMETER_UUID = import.meta.env.VITE_ACCELEROMETER;
const ARDUINO_GYROSCOPE_UUID = import.meta.env.VITE_GYROSCOPE;
const ARDUINO_QUATERNION_UUID = import.meta.env.VITE_QUATERNION;
const ARDUINO_ACTIVITY_UUID = '19b10000-a001-537e-4f6c-d104768a1214'; // Activity recognition
const ARDUINO_STEP_COUNT_UUID = '19b10000-a002-537e-4f6c-d104768a1214'; // Step counter
const ARDUINO_STEP_DETECTOR_UUID = '19b10000-a003-537e-4f6c-d104768a1214'; // Step detector

const BLEContext = createContext<BLEContextType | null>(null);

interface BLEProviderProps {
  children: ReactNode;
}

export const BLEProvider = ({ children }: BLEProviderProps) => {
  const [devices, setDevices] = useState<BLEDevice[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [connectedDevice, setConnectedDevice] = useState<BLEDevice | null>(null);
  const [latestSensorData, setLatestSensorData] = useState<SensorData>(emptySensorData);

  const bluetoothDeviceRef = useRef<BluetoothDevice | null>(null);
  const gattServerRef = useRef<BluetoothRemoteGATTServer | null>(null);
  const characteristicsRef = useRef<Map<string, BluetoothRemoteGATTCharacteristic>>(new Map());
  const sensorIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Use Firebase context
  const { pushSensorData } = useFirebase();

  const connect = async (): Promise<void> => {
    if (!navigator.bluetooth) {
      throw new Error('Web Bluetooth is not supported in this browser');
    }

    setIsConnecting(true);
    try {
      const bluetoothDevice = await navigator.bluetooth.requestDevice({
        filters: [{ namePrefix: 'NiclaSenseME-' }, { services: [ARDUINO_SERVICE_UUID] }],
        optionalServices: [ARDUINO_SERVICE_UUID],
      });

      bluetoothDeviceRef.current = bluetoothDevice;

      // Add disconnect handler
      bluetoothDevice.addEventListener('gattserverdisconnected', handleDeviceDisconnected);

      // Connect to GATT server
      const server = await bluetoothDevice.gatt!.connect();
      gattServerRef.current = server;

      // Get the Arduino service
      const service = await server.getPrimaryService(ARDUINO_SERVICE_UUID);

      // Get all characteristics
      const characteristics = await Promise.all([
        service.getCharacteristic(ARDUINO_TEMPERATURE_UUID).catch(() => null),
        service.getCharacteristic(ARDUINO_HUMIDITY_UUID).catch(() => null),
        service.getCharacteristic(ARDUINO_PRESSURE_UUID).catch(() => null),
        service.getCharacteristic(ARDUINO_CO2_UUID).catch(() => null),
        service.getCharacteristic(ARDUINO_GAS_UUID).catch(() => null),
        service.getCharacteristic(ARDUINO_ACCELEROMETER_UUID).catch(() => null),
        service.getCharacteristic(ARDUINO_GYROSCOPE_UUID).catch(() => null),
        service.getCharacteristic(ARDUINO_QUATERNION_UUID).catch(() => null),
        service.getCharacteristic(ARDUINO_ACTIVITY_UUID).catch(() => null),
        service.getCharacteristic(ARDUINO_STEP_COUNT_UUID).catch(() => null),
        service.getCharacteristic(ARDUINO_STEP_DETECTOR_UUID).catch(() => null),
      ]);

      // Store characteristics
      const charMap = new Map();
      if (characteristics[0]) charMap.set('temperature', characteristics[0]);
      if (characteristics[1]) charMap.set('humidity', characteristics[1]);
      if (characteristics[2]) charMap.set('pressure', characteristics[2]);
      if (characteristics[3]) charMap.set('co2', characteristics[3]);
      if (characteristics[4]) charMap.set('gas', characteristics[4]);
      if (characteristics[5]) charMap.set('accelerometer', characteristics[5]);
      if (characteristics[6]) charMap.set('gyroscope', characteristics[6]);
      if (characteristics[7]) charMap.set('quaternion', characteristics[7]);
      if (characteristics[8]) charMap.set('activity', characteristics[8]);
      if (characteristics[9]) charMap.set('stepCount', characteristics[9]);
      if (characteristics[10]) charMap.set('stepDetector', characteristics[10]);

      characteristicsRef.current = charMap;

      // Subscribe to motion sensors for real-time data
      if (characteristics[5] && characteristics[5].properties.notify) {
        await characteristics[5].startNotifications();
        characteristics[5].addEventListener('characteristicvaluechanged', handleAccelerometerData);
      }

      if (characteristics[6] && characteristics[6].properties.notify) {
        await characteristics[6].startNotifications();
        characteristics[6].addEventListener('characteristicvaluechanged', handleGyroscopeData);
      }

      if (characteristics[7] && characteristics[7].properties.notify) {
        await characteristics[7].startNotifications();
        characteristics[7].addEventListener('characteristicvaluechanged', handleQuaternionData);
      }

      // Subscribe to step detector for real-time step notifications
      if (characteristics[10] && characteristics[10].properties.notify) {
        await characteristics[10].startNotifications();
        characteristics[10].addEventListener('characteristicvaluechanged', handleStepDetectorData);
      }

      const device: BLEDevice = {
        id: bluetoothDevice.id || `arduino-${Date.now()}`,
        name: bluetoothDevice.name || 'Arduino Nicla Sense ME',
        connected: true,
        batteryLevel: 85, // Could be read from actual battery service
        lastSeen: new Date().toISOString(),
        deviceType: 'arduino-nicla',
      };
      setConnectedDevice(device);
      setDevices((prev) => {
        const existingIndex = prev.findIndex((d) => d.id === device.id);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = { ...updated[existingIndex], connected: true };
          return updated;
        }
        return [...prev, device];
      });

      // Start reading sensor data periodically - pass device to ensure it's available
      startSensorReading(device);

      // Update device status in Firebase (simplified for now)
      console.log(`Device ${device.name} connected`);

      toast.success(`Connected to ${device.name}!`);
    } catch (error) {
      console.error('Error connecting to Arduino device:', error);
      handleError(error, 'Connect to Arduino device', true, 'Failed to connect to Arduino device');
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async (deviceId: string): Promise<void> => {
    try {
      // Stop notifications
      const chars = characteristicsRef.current;
      for (const [, char] of chars) {
        if (char && char.properties.notify) {
          await char.stopNotifications().catch(console.warn);
        }
      }

      // Disconnect GATT server
      if (gattServerRef.current && gattServerRef.current.connected) {
        gattServerRef.current.disconnect();
      }

      // Clear refs
      bluetoothDeviceRef.current = null;
      gattServerRef.current = null;
      characteristicsRef.current.clear();

      // Stop sensor reading
      if (sensorIntervalRef.current) {
        clearInterval(sensorIntervalRef.current);
        sensorIntervalRef.current = null;
      }
      setConnectedDevice(null);
      setDevices((prev) => prev.map((d) => (d.id === deviceId ? { ...d, connected: false } : d)));
      setLatestSensorData(emptySensorData);

      // Update device status in Firebase (commented for now)
      // const device = devices.find((d) => d.id === deviceId);
      // if (device) {
      //   // Could add device status update here
      // }

      toast.success('Disconnected from Arduino device');
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, 'Failed to disconnect from device');
      console.error('Error disconnecting from device:', error);
      toast.error(errorMessage);
    }
  };

  const handleDeviceDisconnected = () => {
    setConnectedDevice(null);
    setLatestSensorData(emptySensorData);

    if (sensorIntervalRef.current) {
      clearInterval(sensorIntervalRef.current);
      sensorIntervalRef.current = null;
    }
  };

  // Handle accelerometer data
  const handleAccelerometerData = (event: Event) => {
    const characteristic = event.target as BluetoothRemoteGATTCharacteristic;
    const value = characteristic.value;
    if (value && value.byteLength >= 12) {
      // 3 floats * 4 bytes each
      const dataView = new DataView(value.buffer);
      const x = dataView.getFloat32(0, true); // little endian
      const y = dataView.getFloat32(4, true);
      const z = dataView.getFloat32(8, true);
      setLatestSensorData((prev) => {
        const updatedData = {
          ...prev,
          motion: {
            ...prev.motion,
            accelerometer: { x, y, z },
            gyroscope: prev.motion?.gyroscope || { x: 0, y: 0, z: 0 },
            magnetometer: prev.motion?.magnetometer || { x: 0, y: 0, z: 0 },
            activity: prev.motion?.activity || 'still',
            stepCount: prev.motion?.stepCount || 0,
            fallDetected: prev.motion?.fallDetected || false,
            timestamp: new Date().toISOString(),
          },
          environmental: prev.environmental || {
            temperature: 0,
            humidity: 0,
            pressure: 0,
            airQuality: { aqi: 0, co2: 0, voc: 0, pm25: 0, pm10: 0 },
            timestamp: new Date().toISOString(),
          },
          health: prev.health || {
            heartRate: 0,
            bloodPressure: { systolic: 0, diastolic: 0 },
            oxygenSaturation: 0,
            bodyTemperature: 0,
            timestamp: new Date().toISOString(),
          },
          timestamp: new Date().toISOString(),
        };

        // Stream motion data to Firebase immediately
        if (connectedDevice) {
          pushSensorData(
            connectedDevice.id,
            connectedDevice.name || 'Arduino Nicla Sense ME',
            updatedData
          ).catch((error: unknown) => {
            console.warn('Failed to push motion data to Firebase:', error);
          });
        }

        return updatedData;
      });
    }
  };

  // Handle gyroscope data
  const handleGyroscopeData = (event: Event) => {
    const characteristic = event.target as BluetoothRemoteGATTCharacteristic;
    const value = characteristic.value;
    if (value && value.byteLength >= 12) {
      const dataView = new DataView(value.buffer);
      const x = dataView.getFloat32(0, true);
      const y = dataView.getFloat32(4, true);
      const z = dataView.getFloat32(8, true);

      setLatestSensorData((prev) => ({
        ...prev,
        motion: {
          ...prev.motion,
          gyroscope: { x, y, z },
          accelerometer: prev.motion?.accelerometer || { x: 0, y: 0, z: 0 },
          magnetometer: prev.motion?.magnetometer || { x: 0, y: 0, z: 0 },
          activity: prev.motion?.activity || 'stationary',
          stepCount: prev.motion?.stepCount || 0,
          fallDetected: prev.motion?.fallDetected || false,
          timestamp: new Date().toISOString(),
        },
        environmental: prev.environmental || {
          temperature: 0,
          humidity: 0,
          pressure: 0,
          airQuality: { aqi: 0, co2: 0, voc: 0, pm25: 0, pm10: 0 },
          timestamp: new Date().toISOString(),
        },
        health: prev.health || {
          heartRate: 0,
          bloodPressure: { systolic: 0, diastolic: 0 },
          oxygenSaturation: 0,
          bodyTemperature: 0,
          timestamp: new Date().toISOString(),
        },
        timestamp: new Date().toISOString(),
      }));
    }
  };

  // Handle quaternion data
  const handleQuaternionData = (event: Event) => {
    const characteristic = event.target as BluetoothRemoteGATTCharacteristic;
    const value = characteristic.value;
    if (value && value.byteLength >= 16) {
      // 4 floats * 4 bytes each
      // const dataView = new DataView(value.buffer);
      // const x = dataView.getFloat32(0, true);
      // const y = dataView.getFloat32(4, true);
      // const z = dataView.getFloat32(8, true);
      // const w = dataView.getFloat32(12, true);
      // Could use quaternion for orientation calculation
      // console.log('Quaternion data:', { x, y, z, w });
    }
  };

  // Handle step detector notifications
  const handleStepDetectorData = (event: Event) => {
    const characteristic = event.target as BluetoothRemoteGATTCharacteristic;
    const value = characteristic.value;
    if (value && value.byteLength >= 1) {
      const dataView = new DataView(value.buffer);
      const stepDetected = dataView.getUint8(0) === 1;

      if (stepDetected) {
        console.log('👟 Step detected!');
        // Update sensor data with step detection
        setLatestSensorData((prev) => ({
          ...prev,
          motion: {
            ...prev.motion,
            accelerometer: prev.motion?.accelerometer || { x: 0, y: 0, z: 0 },
            gyroscope: prev.motion?.gyroscope || { x: 0, y: 0, z: 0 },
            magnetometer: prev.motion?.magnetometer || { x: 0, y: 0, z: 0 },
            activity: prev.motion?.activity || 'walking',
            stepCount: (prev.motion?.stepCount || 0) + 1,
            fallDetected: prev.motion?.fallDetected || false,
            timestamp: new Date().toISOString(),
          },
          timestamp: new Date().toISOString(),
        }));
      }
    }
  };
  const startSensorReading = (device: BLEDevice): void => {
    if (sensorIntervalRef.current) {
      clearInterval(sensorIntervalRef.current);
    }

    console.log('🚀 Starting sensor reading interval for device:', device.name);

    // Read sensor data every 5 seconds
    sensorIntervalRef.current = setInterval(async () => {
      if (!gattServerRef.current || !gattServerRef.current.connected) {
        console.log('⚠️ GATT server not connected, skipping sensor read');
        return;
      }

      try {
        console.log('📖 Reading sensor data from Arduino Nicla Sense ME...');
        const chars = characteristicsRef.current;

        // Initialize with proper types to avoid TypeScript errors
        const newSensorData: SensorData = {
          environmental: {
            temperature: 0,
            humidity: 0,
            pressure: 0,
            airQuality: {
              aqi: 0,
              co2: 0,
              voc: 0,
              pm25: 0,
              pm10: 0,
            },
            timestamp: new Date().toISOString(),
          },
          motion: {
            accelerometer: { x: 0, y: 0, z: 0 },
            gyroscope: { x: 0, y: 0, z: 0 },
            magnetometer: { x: 0, y: 0, z: 0 },
            activity: 'still',
            stepCount: 0,
            fallDetected: false,
            timestamp: new Date().toISOString(),
          },
          timestamp: new Date().toISOString(),
        };

        let hasNewData = false;

        // Read temperature (matches Arduino code - onTemperatureCharacteristicRead)
        const tempChar = chars.get('temperature');
        if (tempChar) {
          try {
            const tempValue = await tempChar.readValue();
            // Arduino sends temperature as float
            const temperature = tempValue.getFloat32(0, true);
            console.log('🌡️ [ARDUINO NICLA SENSE ME] Temperature read:', temperature, '°C');

            // Fix TypeScript error by ensuring newSensorData.environmental is defined
            newSensorData.environmental!.temperature = temperature;
            hasNewData = true;
          } catch (tempError) {
            console.warn('⚠️ Failed to read temperature from Arduino:', tempError);
          }
        }

        // Read humidity (matches Arduino code - onHumidityCharacteristicRead)
        const humChar = chars.get('humidity');
        if (humChar) {
          try {
            const humValue = await humChar.readValue();
            // Arduino sends humidity as uint8 (truncated float)
            const humidity = humValue.getUint8(0);
            console.log('💧 [ARDUINO NICLA SENSE ME] Humidity read:', humidity, '%');

            // Fix TypeScript error by ensuring newSensorData.environmental is defined
            newSensorData.environmental!.humidity = humidity;
            hasNewData = true;
          } catch (humError) {
            console.warn('⚠️ Failed to read humidity from Arduino:', humError);
          }
        }

        // Read pressure (matches Arduino code - onPressureCharacteristicRead)
        const pressureChar = chars.get('pressure');
        if (pressureChar) {
          try {
            const pressureValue = await pressureChar.readValue();
            // Arduino sends pressure as float
            const pressure = pressureValue.getFloat32(0, true);
            console.log('📊 [ARDUINO NICLA SENSE ME] Pressure read:', pressure, 'hPa');

            // Fix TypeScript error by ensuring newSensorData.environmental is defined
            newSensorData.environmental!.pressure = pressure;
            hasNewData = true;
          } catch (pressError) {
            console.warn('⚠️ Failed to read pressure from Arduino:', pressError);
          }
        }

        // Read CO2 (matches Arduino code - onCo2CharacteristicRead)
        const co2Char = chars.get('co2');
        if (co2Char) {
          try {
            const co2Value = await co2Char.readValue();
            // Arduino sends CO2 as uint32
            const co2 = co2Value.getUint32(0, true);
            console.log('🌬️ [ARDUINO NICLA SENSE ME] CO2 read:', co2, 'ppm');

            // Fix TypeScript error by ensuring newSensorData.environmental and airQuality are defined
            newSensorData.environmental!.airQuality!.co2 = co2;
            hasNewData = true;
          } catch (co2Error) {
            console.warn('⚠️ Failed to read CO2 from Arduino:', co2Error);
          }
        }

        // Read gas/AQI (matches Arduino code - onGasCharacteristicRead and onBsecCharacteristicRead)
        const gasChar = chars.get('gas');
        const bsecChar = chars.get('bsec');
        if (gasChar || bsecChar) {
          try {
            let aqi = 0;

            if (bsecChar) {
              const bsecValue = await bsecChar.readValue();
              aqi = bsecValue.getFloat32(0, true);
              console.log('🌿 [ARDUINO NICLA SENSE ME] BSEC IAQ read:', aqi);
            } else if (gasChar) {
              const gasValue = await gasChar.readValue();
              const gas = gasValue.getUint32(0, true);
              // Convert gas resistance to AQI approximation
              aqi = Math.max(0, Math.min(500, gas / 1000));
              console.log(
                '💨 [ARDUINO NICLA SENSE ME] Gas read:',
                gas,
                '-> AQI approximation:',
                aqi
              );
            }

            // Fix TypeScript error by ensuring newSensorData.environmental and airQuality are defined
            newSensorData.environmental!.airQuality!.aqi = aqi;
            hasNewData = true;
          } catch (gasError) {
            console.warn('⚠️ Failed to read gas/AQI data from Arduino:', gasError);
          }
        }

        // Read activity data (matches Arduino code - onActivityCharacteristicRead)
        const activityChar = chars.get('activity');
        if (activityChar) {
          try {
            const activityValue = await activityChar.readValue();
            const decoder = new TextDecoder();
            const activityString = decoder.decode(activityValue).trim();
            console.log('🏃 [ARDUINO NICLA SENSE ME] Activity read:', `"${activityString}"`);

            // Import the activity mapping function
            const { mapArduinoActivity } = await import('../utils/activityMapping');
            const activityInfo = mapArduinoActivity(activityString);

            console.log(
              `🔍 Activity mapping: "${activityString}" -> "${activityInfo.displayName}" (${activityInfo.type})`
            );

            // Update motion data with activity
            newSensorData.motion = {
              accelerometer: newSensorData.motion?.accelerometer || { x: 0, y: 0, z: 0 },
              gyroscope: newSensorData.motion?.gyroscope || { x: 0, y: 0, z: 0 },
              magnetometer: newSensorData.motion?.magnetometer || { x: 0, y: 0, z: 0 },
              activity: activityInfo.type,
              activityStatus: activityString,
              stepCount: newSensorData.motion?.stepCount || 0,
              fallDetected: newSensorData.motion?.fallDetected || false,
              timestamp: new Date().toISOString(),
            };
            hasNewData = true;
          } catch (activityError) {
            console.warn('⚠️ Failed to read activity from Arduino:', activityError);
          }
        }

        // Read step count data (matches Arduino code - onStepCountCharacteristicRead)
        const stepCountChar = chars.get('stepCount');
        if (stepCountChar) {
          try {
            const stepCountValue = await stepCountChar.readValue();
            const stepCount = stepCountValue.getUint32(0, true);
            console.log('👟 [ARDUINO NICLA SENSE ME] Step count read:', stepCount);

            // Update motion data with step count
            if (!newSensorData.motion) {
              newSensorData.motion = {
                accelerometer: { x: 0, y: 0, z: 0 },
                gyroscope: { x: 0, y: 0, z: 0 },
                magnetometer: { x: 0, y: 0, z: 0 },
                activity: 'still',
                stepCount: stepCount,
                fallDetected: false,
                timestamp: new Date().toISOString(),
              };
            } else {
              newSensorData.motion.stepCount = stepCount;
            }
            hasNewData = true;
          } catch (stepError) {
            console.warn('⚠️ Failed to read step count from Arduino:', stepError);
          }
        }

        if (hasNewData) {
          console.log('📊 New sensor data collected from Arduino Nicla Sense ME');

          // Update sensor data with new readings and keep motion data from notifications
          setLatestSensorData((prev) => {
            const updatedSensorData: SensorData = {
              ...prev,
              environmental: {
                // Fix TypeScript errors by using non-null assertions or providing default values
                temperature: newSensorData.environmental?.temperature ?? 0,
                humidity: newSensorData.environmental?.humidity ?? 0,
                pressure: newSensorData.environmental?.pressure ?? 0,
                airQuality: {
                  aqi: newSensorData.environmental?.airQuality?.aqi ?? 0,
                  co2: newSensorData.environmental?.airQuality?.co2 ?? 0,
                  voc: prev.environmental?.airQuality?.voc || 0.1,
                  pm25: prev.environmental?.airQuality?.pm25 || 10,
                  pm10: prev.environmental?.airQuality?.pm10 || 15,
                },
                timestamp: new Date().toISOString(),
              },
              motion: newSensorData.motion ||
                prev.motion || {
                  accelerometer: { x: 0, y: 0, z: 0 },
                  gyroscope: { x: 0, y: 0, z: 0 },
                  magnetometer: { x: 0, y: 0, z: 0 },
                  activity: 'still',
                  stepCount: 0,
                  fallDetected: false,
                  timestamp: new Date().toISOString(),
                },
              timestamp: new Date().toISOString(),
            };

            // Log data sources for pollution tracker analysis
            console.log('🔍 POLLUTION TRACKER DATA SOURCES:');
            console.log(
              '   🌡️ Temperature:',
              newSensorData.environmental?.temperature,
              '°C [ARDUINO NICLA SENSE ME]'
            );
            console.log(
              '   💧 Humidity:',
              newSensorData.environmental?.humidity,
              '% [ARDUINO NICLA SENSE ME]'
            );
            console.log(
              '   📊 Pressure:',
              newSensorData.environmental?.pressure,
              'hPa [ARDUINO NICLA SENSE ME]'
            );
            console.log(
              '   🌬️ CO2:',
              newSensorData.environmental?.airQuality?.co2,
              'ppm [ARDUINO NICLA SENSE ME]'
            );
            console.log(
              '   🌿 AQI:',
              newSensorData.environmental?.airQuality?.aqi,
              '[ARDUINO NICLA SENSE ME]'
            );
            console.log(
              '   🧪 VOC:',
              updatedSensorData.environmental?.airQuality?.voc || 0.1,
              '[HARDCODED FALLBACK]'
            );
            console.log(
              '   🌫️ PM2.5:',
              updatedSensorData.environmental?.airQuality?.pm25 || 10,
              'µg/m³ [HARDCODED FALLBACK]'
            );
            console.log(
              '   🌫️ PM10:',
              updatedSensorData.environmental?.airQuality?.pm10 || 15,
              'µg/m³ [HARDCODED FALLBACK]'
            );
            console.log(
              '   📐 Accelerometer: [x,y,z]',
              prev.motion?.accelerometer,
              '[ARDUINO NICLA SENSE ME - Real-time]'
            );
            console.log(
              '   🔄 Gyroscope: [x,y,z]',
              prev.motion?.gyroscope,
              '[ARDUINO NICLA SENSE ME - Real-time]'
            );

            // Only push to Firebase if we have the device and new data
            console.log(
              '🔥 Pushing sensor data to Firebase with temp:',
              newSensorData.environmental?.temperature
            );

            setTimeout(() => {
              pushSensorData(device.id, device.name || 'Arduino Nicla Sense ME', updatedSensorData)
                .then(() => {
                  console.log('✅ Successfully pushed data to Firebase');
                })
                .catch((error: unknown) => {
                  console.error('❌ Failed to push to Firebase:', error);
                });
            }, 0);

            return updatedSensorData;
          });
        } else {
          console.log('ℹ️ No new sensor data collected');
        }
      } catch (error) {
        console.error('❌ Error reading sensor data:', error);
        if (!gattServerRef.current?.connected) {
          handleDeviceDisconnected();
        }
      }
    }, 5000);
  };

  const startScanning = async (): Promise<void> => {
    if (!navigator.bluetooth) {
      throw new Error('Web Bluetooth is not supported in this browser');
    }

    setIsScanning(true);
    try {
      setTimeout(() => {
        const mockDevices: BLEDevice[] = [
          {
            id: 'arduino-nicla-1',
            name: 'Arduino Nicla Sense ME',
            connected: false,
            deviceType: 'arduino-nicla',
          },
        ];
        setDevices(mockDevices);
        setIsScanning(false);
        toast.success('Found Arduino devices (click Connect to pair)');
      }, 2000);
    } catch (error: unknown) {
      handleError(error, 'Start BLE scanning', true, 'Failed to start scanning for devices');
      setIsScanning(false);
    }
  };

  const stopScanning = (): void => {
    setIsScanning(false);
    toast.info('Stopped scanning for devices');
  };

  const sendCommand = async (deviceId: string, command: string): Promise<void> => {
    console.log(`Sending command "${command}" to device ${deviceId}`);
  };
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sensorIntervalRef.current) {
        clearInterval(sensorIntervalRef.current);
      }
      if (gattServerRef.current && gattServerRef.current.connected) {
        gattServerRef.current.disconnect();
      }
      // Cleanup Firebase listeners (commented for now)
      // if (firebaseDataService && firebaseDataService.unsubscribeAll) {
      //   firebaseDataService.unsubscribeAll();
      // }
    };
  }, []);

  const value: BLEContextType = {
    devices,
    isScanning,
    connectedDevice,
    latestSensorData,
    connect,
    disconnect,
    startScanning,
    stopScanning,
    sendCommand,
    bleDevice: connectedDevice,
    isConnecting,
    sensorData: latestSensorData,
    connectToDevice: connect,
    disconnectDevice: disconnect,
  };

  return <BLEContext.Provider value={value}>{children}</BLEContext.Provider>;
};

export const useBLE = (): BLEContextType => {
  const context = useContext(BLEContext);
  if (!context) {
    throw new Error('useBLE must be used within a BLEProvider');
  }
  return context;
};

export const useBLEContext = useBLE;

export default BLEContext;
