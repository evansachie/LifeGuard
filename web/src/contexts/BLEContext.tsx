import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { toast } from 'react-toastify';
import type {
  BLEContextType,
  BLEDevice,
  SensorReading,
  EnvironmentalData,
  MotionData,
} from '../types/ble.types';
import type { HealthMetrics } from '../types/api.types';

const BLEContext = createContext<BLEContextType | undefined>(undefined);

interface BLEProviderProps {
  children: ReactNode;
}

export const BLEProvider: React.FC<BLEProviderProps> = ({ children }) => {
  const [devices, setDevices] = useState<BLEDevice[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [connectedDevice, setConnectedDevice] = useState<BLEDevice | null>(null);
  const [latestSensorData, setLatestSensorData] = useState<{
    environmental?: EnvironmentalData;
    motion?: MotionData;
    health?: HealthMetrics;
  }>({});

  // Check if Web Bluetooth is supported
  const isBluetoothSupported = (): boolean => {
    return 'bluetooth' in navigator;
  };

  // Simulate sensor data for development/testing
  const generateMockSensorData = useCallback((): void => {
    const mockEnvironmentalData: EnvironmentalData = {
      temperature: 22 + Math.random() * 8, // 22-30°C
      humidity: 40 + Math.random() * 30, // 40-70%
      pressure: 1013 + Math.random() * 20, // 1013-1033 hPa
      airQuality: {
        aqi: Math.floor(50 + Math.random() * 100), // 50-150 AQI
        co2: 400 + Math.random() * 200, // 400-600 ppm
        voc: Math.random() * 500, // 0-500 ppb
        pm25: Math.random() * 35, // 0-35 µg/m³
        pm10: Math.random() * 50, // 0-50 µg/m³
      },
      timestamp: new Date().toISOString(),
      location: {
        latitude: 5.6037 + (Math.random() - 0.5) * 0.01, // Around Accra, Ghana
        longitude: -0.187 + (Math.random() - 0.5) * 0.01,
      },
    };

    const mockMotionData: MotionData = {
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
      activity: ['stationary', 'walking', 'running', 'cycling'][
        Math.floor(Math.random() * 4)
      ] as any,
      stepCount: Math.floor(Math.random() * 10000),
      fallDetected: Math.random() < 0.01, // 1% chance of fall detection
      timestamp: new Date().toISOString(),
    };

    const mockHealthData: HealthMetrics = {
      userId: localStorage.getItem('userId') || '',
      heartRate: 60 + Math.random() * 40, // 60-100 bpm
      bloodPressure: {
        systolic: 110 + Math.random() * 30, // 110-140 mmHg
        diastolic: 70 + Math.random() * 20, // 70-90 mmHg
      },
      temperature: 36.1 + Math.random() * 1.5, // 36.1-37.6°C
      oxygenSaturation: 95 + Math.random() * 5, // 95-100%
      timestamp: new Date().toISOString(),
    };

    setLatestSensorData({
      environmental: mockEnvironmentalData,
      motion: mockMotionData,
      health: mockHealthData,
    });
  }, []);

  // Start scanning for BLE devices
  const startScanning = useCallback(async (): Promise<void> => {
    if (!isBluetoothSupported()) {
      toast.error('Web Bluetooth is not supported in this browser');
      return;
    }

    try {
      setIsScanning(true);

      // For now, simulate device discovery
      setTimeout(() => {
        const mockDevices: BLEDevice[] = [
          {
            id: 'nicla-001',
            name: 'Arduino Nicla Sense ME',
            connected: false,
            batteryLevel: 85,
            lastSeen: new Date().toISOString(),
            deviceType: 'nicla',
          },
          {
            id: 'heart-001',
            name: 'Heart Rate Monitor',
            connected: false,
            batteryLevel: 72,
            lastSeen: new Date().toISOString(),
            deviceType: 'heart_rate',
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
  }, []);

  // Stop scanning for BLE devices
  const stopScanning = useCallback((): void => {
    setIsScanning(false);
    toast.info('Stopped scanning for devices');
  }, []);
  // Connect to a BLE device
  const connect = useCallback(
    async (deviceId: string): Promise<void> => {
      try {
        setIsConnecting(true);
        const device = devices.find((d) => d.id === deviceId);
        if (!device) {
          throw new Error('Device not found');
        }

        // Simulate connection process
        toast.info(`Connecting to ${device.name}...`);

        // Update device status
        setDevices((prev) =>
          prev.map(
            (d) => (d.id === deviceId ? { ...d, connected: true } : { ...d, connected: false }) // Disconnect other devices
          )
        );

        setConnectedDevice({ ...device, connected: true });
        toast.success(`Connected to ${device.name}`);

        // Start generating mock sensor data
        generateMockSensorData();
      } catch (error: any) {
        console.error('Error connecting to device:', error);
        toast.error(`Failed to connect: ${error.message}`);
      } finally {
        setIsConnecting(false);
      }
    },
    [devices, generateMockSensorData]
  );

  // Disconnect from a BLE device
  const disconnect = useCallback(
    async (deviceId: string): Promise<void> => {
      try {
        const device = devices.find((d) => d.id === deviceId);
        if (!device) {
          throw new Error('Device not found');
        }

        // Update device status
        setDevices((prev) => prev.map((d) => (d.id === deviceId ? { ...d, connected: false } : d)));

        setConnectedDevice(null);
        setLatestSensorData({});

        toast.success(`Disconnected from ${device.name}`);
      } catch (error: any) {
        console.error('Error disconnecting from device:', error);
        toast.error(`Failed to disconnect: ${error.message}`);
      }
    },
    [devices]
  );

  // Send command to BLE device
  const sendCommand = useCallback(
    async (deviceId: string, command: string): Promise<void> => {
      try {
        const device = devices.find((d) => d.id === deviceId);
        if (!device || !device.connected) {
          throw new Error('Device not connected');
        }

        // Simulate command sending
        console.log(`Sending command "${command}" to ${device.name}`);
        toast.success(`Command sent to ${device.name}`);
      } catch (error: any) {
        console.error('Error sending command:', error);
        toast.error(`Failed to send command: ${error.message}`);
      }
    },
    [devices]
  );

  // Periodically update sensor data when connected
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (connectedDevice) {
      interval = setInterval(() => {
        generateMockSensorData();
      }, 5000); // Update every 5 seconds
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [connectedDevice, generateMockSensorData]);

  // Handle fall detection alerts
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

    // Backward compatibility aliases
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
  if (context === undefined) {
    throw new Error('useBLE must be used within a BLEProvider');
  }
  return context;
};

// Backward compatibility alias
export const useBLEContext = useBLE;

export default BLEContext;
