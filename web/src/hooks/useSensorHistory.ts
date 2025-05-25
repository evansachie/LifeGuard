import { useState, useEffect } from 'react';

interface SensorData {
  temperature?: number;
  humidity?: number;
  pressure?: number;
  co2?: number;
  gas?: number;
  [key: string]: number | undefined;
}

interface HistoricalData {
  temperature: number[];
  humidity: number[];
  pressure: number[];
  co2: number[];
  gas: number[];
  timestamps: string[];
  [key: string]: Array<number | string>;
}

const useSensorHistory = (sensorData: SensorData | null, maxDataPoints = 30): HistoricalData => {
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

        // Update sensor values
        for (const key of Object.keys(sensorData)) {
          if (key in prev) {
            // Only update keys that exist in our state
            const value = sensorData[key];
            if (value !== undefined) {
              updated[key] = [...(prev[key] as number[]), value].slice(-maxDataPoints);
            }
          }
        }

        return updated;
      });
    }
  }, [sensorData, maxDataPoints]);

  return historicalData;
};

export default useSensorHistory;
