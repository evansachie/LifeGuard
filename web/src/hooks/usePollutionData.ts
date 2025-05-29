import { useState, useEffect } from 'react';
import { SensorData as BLESensorData } from '../types/ble.types';
import { PollutionData } from '../types/common.types';

// Initial placeholder values for pollution data
const initialPollutionData: PollutionData = {
  temperature: 28.5,
  humidity: 52,
  pressure: 1013,
  steps: 8500,
  aqi: 75,
  pm25: 15.2,
  pm10: 45.8,
  no2: 25.4,
  co2: 450,
  gas: 320,
};

/**
 * Custom hook to process sensor data into pollution metrics
 * @param sensorData - Data from BLE sensors
 * @returns Processed pollution data
 */
const usePollutionData = (sensorData: BLESensorData | null): PollutionData => {
  const [pollutionData, setPollutionData] = useState<PollutionData>(initialPollutionData);

  useEffect(() => {
    if (sensorData && sensorData.environmental) {
      const env = sensorData.environmental;
      setPollutionData((prev) => ({
        ...prev,
        temperature: env.temperature ?? prev.temperature,
        humidity: env.humidity ?? prev.humidity,
        pressure: env.pressure ?? prev.pressure,
        co2: env.co2 ?? (env.airQuality?.co2 ?? prev.co2),
        gas: env.gas ?? prev.gas,
        // Handle air quality properties if available
        aqi: env.airQuality?.aqi ?? prev.aqi,
        pm25: env.airQuality?.pm25 ?? prev.pm25,
        pm10: env.airQuality?.pm10 ?? prev.pm10,
      }));
    }

    if (sensorData && sensorData.motion) {
      const motion = sensorData.motion;
      setPollutionData((prev) => ({
        ...prev,
        // Handle both steps and stepCount properties
        steps: motion.steps ?? motion.stepCount ?? prev.steps,
      }));
    }
  }, [sensorData]);

  return pollutionData;
};

export default usePollutionData;
