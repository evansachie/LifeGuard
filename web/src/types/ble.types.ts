export interface BLEDevice {
  id: string;
  name: string;
  deviceId?: string;
  connected: boolean;
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
  airQuality?: {
    aqi: number;
    co2: number;
    voc: number;
    pm25: number;
    pm10: number;
  };
}

export interface MotionData {
  steps?: number;
  stepCount?: number;
  activity?: string;
  calories?: number;
  distance?: number;
}

export interface HealthMetrics {
  heartRate?: number;
}

export interface SensorData {
  environmental?: EnvironmentalData;
  motion?: MotionData;
  timestamp?: string;
}

export interface BLEContextType {
  bleDevice: BLEDevice | null;
  isConnecting: boolean;
  sensorData: SensorData | null;
  connectToDevice: (deviceId: string) => Promise<void>;
  disconnectDevice: (deviceId: string) => Promise<void>;
  scanForDevices?: () => Promise<BLEDevice[]>;
}
