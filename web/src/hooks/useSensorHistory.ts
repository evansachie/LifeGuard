import { useState, useEffect } from 'react';
import { SensorData as BLESensorData } from '../types/ble.types';

export interface HistoricalData {
  temperature: number[];
  humidity: number[];
  pressure: number[];
  co2: number[];
  gas: number[];
  timestamps: string[];
}

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
        const updated: HistoricalData = {
          temperature: [...prev.temperature],
          humidity: [...prev.humidity],
          pressure: [...prev.pressure],
          co2: [...prev.co2],
          gas: [...prev.gas],
          timestamps: [...prev.timestamps, timestamp].slice(-maxDataPoints),
        };

        // Extract environmental data for updating
        if (sensorData.environmental) {
          // Handle temperature
          if (
            'temperature' in sensorData.environmental &&
            typeof sensorData.environmental.temperature === 'number'
          ) {
            updated.temperature = [...prev.temperature, sensorData.environmental.temperature].slice(
              -maxDataPoints
            );
          }

          // Handle humidity
          if (
            'humidity' in sensorData.environmental &&
            typeof sensorData.environmental.humidity === 'number'
          ) {
            updated.humidity = [...prev.humidity, sensorData.environmental.humidity].slice(
              -maxDataPoints
            );
          }

          // Handle pressure
          if (
            'pressure' in sensorData.environmental &&
            typeof sensorData.environmental.pressure === 'number'
          ) {
            updated.pressure = [...prev.pressure, sensorData.environmental.pressure].slice(
              -maxDataPoints
            );
          }

          // Handle co2
          if (
            'co2' in sensorData.environmental &&
            typeof sensorData.environmental.co2 === 'number'
          ) {
            updated.co2 = [...prev.co2, sensorData.environmental.co2].slice(-maxDataPoints);
          }

          // Handle gas
          if (
            'gas' in sensorData.environmental &&
            typeof sensorData.environmental.gas === 'number'
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
