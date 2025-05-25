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
      setPollutionData((prev) => ({
        ...prev,
        temperature: sensorData.environmental?.temperature ?? prev.temperature,
        humidity: sensorData.environmental?.humidity ?? prev.humidity,
        pressure: sensorData.environmental?.pressure ?? prev.pressure,
        co2: sensorData.environmental?.co2 ?? prev.co2,
        gas: sensorData.environmental?.gas ?? prev.gas,
      }));
    }

    if (sensorData && sensorData.motion) {
      setPollutionData((prev) => ({
        ...prev,
        steps: sensorData.motion?.steps ?? prev.steps,
      }));
    }
  }, [sensorData]);

  return pollutionData;
};

export default usePollutionData;
