import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { toast } from 'react-toastify';
import { BLEContextType, BLEDevice, SensorData, emptySensorData } from '../types/ble.types';

const BLEContext = createContext<BLEContextType | null>(null);

interface BLEProviderProps {
  children: ReactNode;
}

export const BLEProvider: React.FC<BLEProviderProps> = ({ children }) => {
  const [devices, setDevices] = useState<BLEDevice[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [connectedDevice, setConnectedDevice] = useState<BLEDevice | null>(null);
  const [latestSensorData, setLatestSensorData] = useState<SensorData>(emptySensorData);

  const sensorIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const connect = async (deviceId: string): Promise<void> => {
    if (!navigator.bluetooth) {
      throw new Error('Web Bluetooth is not supported in this browser');
    }

    setIsConnecting(true);
    try {
      const bluetoothDevice = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['battery_service', 'device_information'],
      });

      const device: BLEDevice = {
        id: bluetoothDevice.id || deviceId,
        name: bluetoothDevice.name || `BLE Device ${deviceId}`,
        connected: true,
        batteryLevel: 85,
        lastSeen: new Date().toISOString(),
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

      startSensorDataSimulation();
    } catch (error) {
      console.error('Error connecting to device:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async (deviceId: string): Promise<void> => {
    try {
      setConnectedDevice(null);
      setDevices((prev) => prev.map((d) => (d.id === deviceId ? { ...d, connected: false } : d)));
      setLatestSensorData(emptySensorData);

      if (sensorIntervalRef.current) {
        clearInterval(sensorIntervalRef.current);
        sensorIntervalRef.current = null;
      }

      toast.success(`Disconnected from device`);
    } catch (error: any) {
      console.error('Error disconnecting from device:', error);
      toast.error(`Failed to disconnect: ${error.message}`);
    }
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
            id: 'device-1',
            name: 'LifeGuard Sensor Pro',
            connected: false,
            deviceType: 'health-monitor',
          },
          {
            id: 'device-2',
            name: 'Environmental Monitor',
            connected: false,
            deviceType: 'environmental',
          },
        ];
        setDevices(mockDevices);
        setIsScanning(false);
        toast.success('Found BLE devices');
      }, 2000);
    } catch (error: any) {
      console.error('Error starting BLE scan:', error);
      toast.error(`Failed to start scanning: ${error.message}`);
      setIsScanning(false);
    }
  };

  const stopScanning = (): void => {
    setIsScanning(false);
    toast.info('Stopped scanning for devices');
  };

  const sendCommand = async (deviceId: string, command: string): Promise<void> => {
    console.log(`Sending command "${command}" to device ${deviceId}`);
    // Implement command sending logic
  };

  const startSensorDataSimulation = (): void => {
    if (sensorIntervalRef.current) {
      clearInterval(sensorIntervalRef.current);
    }

    sensorIntervalRef.current = setInterval(() => {
      if (connectedDevice) {
        const newSensorData: SensorData = {
          environmental: {
            temperature: 20 + Math.random() * 10,
            humidity: 40 + Math.random() * 20,
            pressure: 1000 + Math.random() * 50,
            airQuality: {
              aqi: 50 + Math.random() * 100,
              co2: 400 + Math.random() * 200,
              voc: 0.1 + Math.random() * 0.5,
              pm25: 10 + Math.random() * 20,
              pm10: 15 + Math.random() * 25,
            },
            timestamp: new Date().toISOString(),
          },
          motion: {
            accelerometer: {
              x: (Math.random() - 0.5) * 2,
              y: (Math.random() - 0.5) * 2,
              z: 9.8 + (Math.random() - 0.5) * 0.5,
            },
            gyroscope: {
              x: (Math.random() - 0.5) * 10,
              y: (Math.random() - 0.5) * 10,
              z: (Math.random() - 0.5) * 10,
            },
            magnetometer: {
              x: (Math.random() - 0.5) * 100,
              y: (Math.random() - 0.5) * 100,
              z: (Math.random() - 0.5) * 100,
            },
            activity: ['stationary', 'walking', 'running'][Math.floor(Math.random() * 3)] as
              | 'stationary'
              | 'walking'
              | 'running',
            stepCount: Math.floor(Math.random() * 10000),
            fallDetected: Math.random() < 0.01,
            timestamp: new Date().toISOString(),
          },
          health: {
            heartRate: 60 + Math.random() * 40,
            bloodPressure: {
              systolic: 110 + Math.random() * 20,
              diastolic: 70 + Math.random() * 15,
            },
            oxygenSaturation: 95 + Math.random() * 5,
            bodyTemperature: 36.5 + Math.random() * 1,
            timestamp: new Date().toISOString(),
          },
          timestamp: new Date().toISOString(),
        };

        setLatestSensorData(newSensorData);
      } else {
        if (sensorIntervalRef.current) {
          clearInterval(sensorIntervalRef.current);
          sensorIntervalRef.current = null;
        }
      }
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (sensorIntervalRef.current) {
        clearInterval(sensorIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (connectedDevice) {
      interval = setInterval(() => {
        setLatestSensorData((prevData) => ({
          ...prevData,
          environmental: {
            temperature: 20 + Math.random() * 10,
            humidity: 40 + Math.random() * 20,
            pressure: 1000 + Math.random() * 50,
            airQuality: {
              aqi: 50 + Math.random() * 100,
              co2: 400 + Math.random() * 200,
              voc: 0.1 + Math.random() * 0.5,
              pm25: 10 + Math.random() * 20,
              pm10: 15 + Math.random() * 25,
            },
            timestamp: new Date().toISOString(),
            location: prevData.environmental?.location,
          },
          motion: {
            accelerometer: {
              x: (Math.random() - 0.5) * 2,
              y: (Math.random() - 0.5) * 2,
              z: 9.8 + (Math.random() - 0.5) * 0.5,
            },
            gyroscope: {
              x: (Math.random() - 0.5) * 10,
              y: (Math.random() - 0.5) * 10,
              z: (Math.random() - 0.5) * 10,
            },
            magnetometer: {
              x: (Math.random() - 0.5) * 100,
              y: (Math.random() - 0.5) * 100,
              z: (Math.random() - 0.5) * 100,
            },
            activity: ['stationary', 'walking', 'running'][Math.floor(Math.random() * 3)] as
              | 'stationary'
              | 'walking'
              | 'running',
            stepCount: Math.floor(Math.random() * 10000),
            fallDetected: Math.random() < 0.01,
            timestamp: new Date().toISOString(),
          },
          health: {
            heartRate: 60 + Math.random() * 40,
            bloodPressure: {
              systolic: 110 + Math.random() * 20,
              diastolic: 70 + Math.random() * 15,
            },
            oxygenSaturation: 95 + Math.random() * 5,
            bodyTemperature: 36.5 + Math.random() * 1,
            timestamp: new Date().toISOString(),
          },
          timestamp: new Date().toISOString(),
        }));
      }, 5000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [connectedDevice]);

  useEffect(() => {
    if (latestSensorData.motion?.fallDetected) {
      toast.error('⚠️ Fall detected! Emergency contacts will be notified.', {
        autoClose: false,
      });
    }
  }, [latestSensorData.motion?.fallDetected]);

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
