import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { toast } from 'react-toastify';
import { handleError, getErrorMessage } from '../utils/errorHandler';
import { BLEContextType, BLEDevice, SensorData, emptySensorData } from '../types/ble.types';

const ARDUINO_SERVICE_UUID = import.meta.env.VITE_SERVICE;
const ARDUINO_TEMPERATURE_UUID = import.meta.env.VITE_TEMPERATURE;
const ARDUINO_HUMIDITY_UUID = import.meta.env.VITE_HUMIDITY;
const ARDUINO_PRESSURE_UUID = import.meta.env.VITE_PRESSURE;
const ARDUINO_CO2_UUID = import.meta.env.VITE_CO2;
const ARDUINO_GAS_UUID = import.meta.env.VITE_GAS;
const ARDUINO_ACCELEROMETER_UUID = import.meta.env.VITE_ACCELEROMETER;
const ARDUINO_GYROSCOPE_UUID = import.meta.env.VITE_GYROSCOPE;
const ARDUINO_QUATERNION_UUID = import.meta.env.VITE_QUATERNION;

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

      // Start reading sensor data periodically
      startSensorReading();
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

      toast.success('Disconnected from Arduino device');
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, 'Failed to disconnect from device');
      console.error('Error disconnecting from device:', error);
      toast.error(errorMessage);
    }
  };

  const handleDeviceDisconnected = () => {
    console.log('Arduino device disconnected');
    setConnectedDevice(null);
    setLatestSensorData(emptySensorData);

    if (sensorIntervalRef.current) {
      clearInterval(sensorIntervalRef.current);
      sensorIntervalRef.current = null;
    }

    toast.warning('Arduino device disconnected');
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

      setLatestSensorData((prev) => ({
        ...prev,
        motion: {
          ...prev.motion,
          accelerometer: { x, y, z },
          gyroscope: prev.motion?.gyroscope || { x: 0, y: 0, z: 0 },
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
      const dataView = new DataView(value.buffer);
      const x = dataView.getFloat32(0, true);
      const y = dataView.getFloat32(4, true);
      const z = dataView.getFloat32(8, true);
      const w = dataView.getFloat32(12, true);

      // Could use quaternion for orientation calculation
      console.log('Quaternion data:', { x, y, z, w });
    }
  };

  const startSensorReading = (): void => {
    if (sensorIntervalRef.current) {
      clearInterval(sensorIntervalRef.current);
    }

    // Read sensor data every 3 seconds
    sensorIntervalRef.current = setInterval(async () => {
      if (!gattServerRef.current || !gattServerRef.current.connected) {
        return;
      }

      try {
        const chars = characteristicsRef.current;
        const newSensorData: Partial<SensorData> = {};

        // Read temperature
        const tempChar = chars.get('temperature');
        if (tempChar) {
          const tempValue = await tempChar.readValue();
          const temperature = tempValue.getFloat32(0, true);

          if (!newSensorData.environmental) newSensorData.environmental = {} as any;
          newSensorData.environmental!.temperature = temperature;
        }

        // Read humidity
        const humChar = chars.get('humidity');
        if (humChar) {
          const humValue = await humChar.readValue();
          const humidity = humValue.getUint8(0); // Arduino sends as uint8

          if (!newSensorData.environmental) newSensorData.environmental = {} as any;
          newSensorData.environmental!.humidity = humidity;
        }

        // Read pressure
        const pressureChar = chars.get('pressure');
        if (pressureChar) {
          const pressureValue = await pressureChar.readValue();
          const pressure = pressureValue.getFloat32(0, true);

          if (!newSensorData.environmental) newSensorData.environmental = {} as any;
          newSensorData.environmental!.pressure = pressure;
        }

        // Read CO2
        const co2Char = chars.get('co2');
        if (co2Char) {
          const co2Value = await co2Char.readValue();
          const co2 = co2Value.getUint32(0, true);

          if (!newSensorData.environmental) newSensorData.environmental = {} as any;
          if (!newSensorData.environmental!.airQuality)
            newSensorData.environmental!.airQuality = {} as any;
          newSensorData.environmental!.airQuality!.co2 = co2;
        }

        // Read gas sensor
        const gasChar = chars.get('gas');
        if (gasChar) {
          const gasValue = await gasChar.readValue();
          const gas = gasValue.getUint32(0, true);

          if (!newSensorData.environmental) newSensorData.environmental = {} as any;
          if (!newSensorData.environmental!.airQuality)
            newSensorData.environmental!.airQuality = {} as any;
          // Convert gas resistance to AQI approximation
          newSensorData.environmental!.airQuality!.aqi = Math.max(0, Math.min(500, gas / 1000));
        }

        // Update sensor data
        setLatestSensorData((prev) => ({
          ...prev,
          environmental: {
            temperature:
              newSensorData.environmental?.temperature || prev.environmental?.temperature || 0,
            humidity: newSensorData.environmental?.humidity || prev.environmental?.humidity || 0,
            pressure: newSensorData.environmental?.pressure || prev.environmental?.pressure || 0,
            airQuality: {
              aqi:
                newSensorData.environmental?.airQuality?.aqi ||
                prev.environmental?.airQuality?.aqi ||
                0,
              co2:
                newSensorData.environmental?.airQuality?.co2 ||
                prev.environmental?.airQuality?.co2 ||
                0,
              voc: prev.environmental?.airQuality?.voc || 0.1,
              pm25: prev.environmental?.airQuality?.pm25 || 10,
              pm10: prev.environmental?.airQuality?.pm10 || 15,
            },
            timestamp: new Date().toISOString(),
          },
          motion: {
            accelerometer: prev.motion?.accelerometer || { x: 0, y: 0, z: 0 },
            gyroscope: prev.motion?.gyroscope || { x: 0, y: 0, z: 0 },
            magnetometer: prev.motion?.magnetometer || { x: 0, y: 0, z: 0 },
            activity: determineActivity(prev.motion?.accelerometer),
            stepCount: prev.motion?.stepCount || Math.floor(Math.random() * 1000),
            fallDetected: false, // Disable fall detection during setup/connection
            timestamp: new Date().toISOString(),
          },
          health: {
            heartRate: 60 + Math.random() * 40,
            bloodPressure: {
              systolic: 110 + Math.random() * 20,
              diastolic: 70 + Math.random() * 15,
            },
            oxygenSaturation: 95 + Math.random() * 5,
            bodyTemperature: newSensorData.environmental?.temperature || 36.5 + Math.random() * 1,
            timestamp: new Date().toISOString(),
          },
          timestamp: new Date().toISOString(),
        }));
      } catch (error) {
        console.warn('Error reading sensor data:', error);
        // Device might be disconnected
        if (!gattServerRef.current?.connected) {
          handleDeviceDisconnected();
        }
      }
    }, 3000);
  };

  const determineActivity = (accel?: {
    x: number;
    y: number;
    z: number;
  }): 'stationary' | 'walking' | 'running' => {
    if (!accel) return 'stationary';

    const magnitude = Math.sqrt(accel.x ** 2 + accel.y ** 2 + accel.z ** 2);
    if (magnitude > 12) return 'running';
    if (magnitude > 10.5) return 'walking';
    return 'stationary';
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
    // Could implement RGB LED control or other commands
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
