import { HealthMetrics } from "./api.types";

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
  temperature: number;
  humidity: number;
  pressure: number;
  airQuality: {
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
  activity: 'stationary' | 'walking' | 'running' | 'cycling' | 'unknown';
  stepCount: number;
  fallDetected: boolean;
  timestamp: string;
}

export interface BLEContextType {
  devices: BLEDevice[];
  isScanning: boolean;
  connectedDevice: BLEDevice | null;
  latestSensorData: {
    environmental?: EnvironmentalData;
    motion?: MotionData;
    health?: HealthMetrics;
  };
  connect: (deviceId: string) => Promise<void>;
  disconnect: (deviceId: string) => Promise<void>;
  startScanning: () => void;
  stopScanning: () => void;
  sendCommand: (deviceId: string, command: string) => Promise<void>;
  
  // Backward compatibility aliases for Dashboard
  bleDevice: BLEDevice | null;
  isConnecting: boolean;
  sensorData: {
    environmental?: EnvironmentalData;
    motion?: MotionData;
    health?: HealthMetrics;
  };
  connectToDevice: (deviceId: string) => Promise<void>;
  disconnectDevice: (deviceId: string) => Promise<void>;
}
