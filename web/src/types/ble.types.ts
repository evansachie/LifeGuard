export interface BLEDevice {
  id: string;
  name: string;
  connected: boolean;
  batteryLevel?: number;
  lastSeen: string;
  deviceType: 'nicla' | 'heart_rate' | 'temperature' | 'environmental';
}

export interface SensorReading {
  id: string;
  deviceId: string;
  sensorType: string;
  value: number;
  unit: string;
  timestamp: string;
  accuracy?: number;
}

export interface EnvironmentalData {
  temperature?: number;
  humidity?: number;
  pressure?: number;
  co2?: number;
  gas?: number;
}

export interface MotionData {
  steps?: number;
  activity?: string;
  accelerometer?: {
    x: number;
    y: number;
    z: number;
  };
  gyroscope?: {
    x: number;
    y: number;
    z: number;
  };
  magnetometer?: {
    x: number;
    y: number;
    z: number;
  };
  fallDetected?: boolean;
  timestamp?: string;
}

export interface HealthMetrics {
  heartRate?: number;
}

export interface SensorData {
  environmental?: EnvironmentalData;
  motion?: MotionData;
  health?: HealthMetrics;
}

export interface BLEContextType {
  devices: BLEDevice[];
  isScanning: boolean;
  connectedDevice: BLEDevice | null;
  latestSensorData: SensorData;
  connect: (deviceId: string) => Promise<void>;
  disconnect: (deviceId: string) => Promise<void>;
  startScanning: () => void;
  stopScanning: () => void;
  sendCommand: (deviceId: string, command: string) => Promise<void>;
  
  // Backward compatibility aliases for Dashboard
  bleDevice: BLEDevice | null;
  isConnecting: boolean;
  sensorData: SensorData;
  connectToDevice: (deviceId: string) => Promise<void>;
  disconnectDevice: (deviceId: string) => Promise<void>;
}
