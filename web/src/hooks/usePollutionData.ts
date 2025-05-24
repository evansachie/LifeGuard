import { useState, useEffect } from 'react';
import { EnvironmentalData, MotionData } from '../types/ble.types';
import { HealthMetrics } from '../types/api.types';

interface BLESensorData {
  environmental?: EnvironmentalData;
  motion?: MotionData;
  health?: HealthMetrics;
}

interface PollutionData {
  temperature: number;
  humidity: number;
  pressure: number;
  steps: number;
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  co2: number;
  gas: number;
}

/**
 * Custom hook to manage pollution and sensor data
 * @param sensorData - Real-time sensor data from BLE device
 * @returns Combined pollution data
 */
const usePollutionData = (sensorData: BLESensorData | null | undefined): PollutionData => {
  const [pollutionData, setPollutionData] = useState<PollutionData>({
    temperature: 28.5,
    humidity: 65,
    pressure: 1013.25,
    steps: 1.2,
    aqi: 75,
    pm25: 15.2,
    pm10: 45.8,
    no2: 25.4,
    co2: 400,
    gas: 0,
  });

  // Update pollutionData when sensorData changes
  useEffect(() => {
    if (sensorData?.environmental) {
      const env = sensorData.environmental;
      setPollutionData((prev) => ({
        ...prev,
        temperature: env.temperature || prev.temperature,
        humidity: env.humidity || prev.humidity,
        pressure: env.pressure || prev.pressure,
        aqi: env.airQuality?.aqi || prev.aqi,
        co2: env.airQuality?.co2 || prev.co2,
        pm25: env.airQuality?.pm25 || prev.pm25,
        pm10: env.airQuality?.pm10 || prev.pm10,
      }));
    }
  }, [sensorData]);

  return pollutionData;
};

export default usePollutionData;
