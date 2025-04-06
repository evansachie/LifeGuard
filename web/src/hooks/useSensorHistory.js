import { useState, useEffect } from 'react';

const useSensorHistory = (sensorData, maxDataPoints = 30) => {
    const [historicalData, setHistoricalData] = useState({
        temperature: [],
        humidity: [],
        pressure: [],
        co2: [],
        gas: [],
        timestamps: []
    });

    useEffect(() => {
        if (sensorData) {
            const timestamp = new Date().toLocaleTimeString();
            setHistoricalData(prev => {
                // Create a new object with updated arrays
                const updated = {};
                
                // Process each sensor value
                for (const key of Object.keys(prev)) {
                    if (key === 'timestamps') {
                        updated[key] = [...prev[key], timestamp].slice(-maxDataPoints);
                    } else if (key in sensorData) {
                        updated[key] = [...prev[key], sensorData[key]].slice(-maxDataPoints);
                    } else {
                        updated[key] = [...prev[key]];
                    }
                }
                
                return updated;
            });
        }
    }, [sensorData, maxDataPoints]);

    return historicalData;
};

export default useSensorHistory;