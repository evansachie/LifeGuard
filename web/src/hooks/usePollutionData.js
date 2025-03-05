import { useState, useEffect } from 'react';

/**
 * Custom hook to manage pollution and sensor data
 * @param {Object} sensorData - Real-time sensor data from BLE device
 * @returns {Object} Combined pollution data
 */
const usePollutionData = (sensorData) => {
  const [pollutionData, setPollutionData] = useState({
    temperature: 28.5,
    humidity: 65,
    pressure: 1013.25,
    steps: 1.2,
    aqi: 75,
    pm25: 15.2,
    pm10: 45.8,
    no2: 25.4,
    co2: 400,
    gas: 0
  });
  
  // Update pollutionData when sensorData changes
  useEffect(() => {
    if (sensorData) {
      setPollutionData(prev => ({
        ...prev,
        temperature: sensorData.temperature || prev.temperature,
        humidity: sensorData.humidity || prev.humidity,
        pressure: sensorData.pressure || prev.pressure,
        co2: sensorData.co2 || prev.co2,
        gas: sensorData.gas || prev.gas
      }));
    }
  }, [sensorData]);
  
  return pollutionData;
};

export default usePollutionData;
