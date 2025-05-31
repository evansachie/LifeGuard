import { useState, useEffect } from 'react';
// Import types from the correct location
import { EnvironmentalData, MotionData, SensorData as BLESensorData } from '../types/ble.types';

// Export the HistoricalData interface so it can be imported by other files
export interface HistoricalData {
  temperature: number[];
  humidity: number[];
  pressure: number[];
  co2: number[];
  gas: number[];
  timestamps: string[];
  [key: string]: Array<number | string>;
}

// Use the imported types from BLE context
const useSensorHistory = (sensorData: BLESensorData | null, maxDataPoints = 30): HistoricalData => {
  const [historicalData, setHistoricalData] = useState<HistoricalData>({
    temperature: [],
    humidity: [],
    pressure: [],
    co2: [],
    gas: [],
    timestamps: [],
  });

  useEffect(() => {
    if (sensorData) {
      const timestamp = new Date().toLocaleTimeString();
      setHistoricalData((prev) => {
        const updated = { ...prev };

        updated.timestamps = [...prev.timestamps, timestamp].slice(-maxDataPoints);

        // Extract environmental data for updating
        if (sensorData.environmental) {
          // Handle temperature
          if (
            'temperature' in sensorData.environmental &&
            sensorData.environmental.temperature !== undefined &&
            'temperature' in prev
          ) {
            updated.temperature = [...prev.temperature, sensorData.environmental.temperature].slice(
              -maxDataPoints
            );
          }

          // Handle humidity
          if (
            'humidity' in sensorData.environmental &&
            sensorData.environmental.humidity !== undefined &&
            'humidity' in prev
          ) {
            updated.humidity = [...prev.humidity, sensorData.environmental.humidity].slice(
              -maxDataPoints
            );
          }

          // Handle pressure
          if (
            'pressure' in sensorData.environmental &&
            sensorData.environmental.pressure !== undefined &&
            'pressure' in prev
          ) {
            updated.pressure = [...prev.pressure, sensorData.environmental.pressure].slice(
              -maxDataPoints
            );
          }

          // Handle co2
          if (
            'co2' in sensorData.environmental &&
            sensorData.environmental.co2 !== undefined &&
            'co2' in prev
          ) {
            updated.co2 = [...prev.co2, sensorData.environmental.co2].slice(-maxDataPoints);
          }

          // Handle gas
          if (
            'gas' in sensorData.environmental &&
            sensorData.environmental.gas !== undefined &&
            'gas' in prev
          ) {
            updated.gas = [...prev.gas, sensorData.environmental.gas].slice(-maxDataPoints);
          }
        }

        return updated;
      });
    }
  }, [sensorData, maxDataPoints]);

  return historicalData;
};

export default useSensorHistory;
