export interface BLEDevice {
  id: string;
  name: string;
  deviceId?: string;
  connected: boolean;
  batteryLevel?: number;
  lastSeen?: string;
  deviceType?: string;
}

export interface EnvironmentalData {
  temperature: number;
  humidity: number;
  pressure: number;
  co2?: number;
  gas?: number;
  airQuality?: {
    aqi: number;
    co2: number;
    voc: number;
    pm25: number;
    pm10: number;
  };
  timestamp: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface MotionData {
  accelerometer: {
    x: number;
    y: number;
    z: number;
  };
  gyroscope: {
    x: number;
    y: number;
    z: number;
  };
  magnetometer: {
    x: number;
    y: number;
    z: number;
  };
  activity: 'stationary' | 'walking' | 'running' | 'cycling' | 'still' | 'unknown';
  stepCount: number;
  steps?: number; // Alternative property name for steps
  activityStatus?: string; // Human readable activity status
  fallDetected: boolean;
  timestamp: string;
}

export interface SensorData {
  environmental?: EnvironmentalData;
  motion?: MotionData;
  health?: {
    heartRate?: number;
    bloodPressure?: {
      systolic: number;
      diastolic: number;
    };
    oxygenSaturation?: number;
    bodyTemperature?: number;
    timestamp?: string;
  };
  timestamp?: string;
}

export interface SensorReading {
  deviceId: string;
  timestamp: string;
  environmental?: EnvironmentalData;
  motion?: MotionData;
  health?: SensorData['health'];
}

export interface BLEContextType {
  devices: BLEDevice[];
  isScanning: boolean;
  connectedDevice: BLEDevice | null;
  latestSensorData: SensorData;
  connect: () => Promise<void>;
  disconnect: (deviceId: string) => Promise<void>;
  startScanning: () => Promise<void>;
  stopScanning: () => void;
  sendCommand: (deviceId: string, command: string) => Promise<void>;

  // Legacy aliases for backward compatibility
  bleDevice: BLEDevice | null;
  isConnecting: boolean;
  sensorData: SensorData;
  connectToDevice: () => Promise<void>;
  disconnectDevice: (deviceId: string) => Promise<void>;
}

export type { BLEDevice as Device, SensorData as Sensors, EnvironmentalData as Environment };

export const emptySensorData: SensorData = {
  environmental: undefined,
  motion: undefined,
  health: undefined,
  timestamp: undefined,
};
