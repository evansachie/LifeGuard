import React from 'react';
import { Line } from 'react-chartjs-2';
import "./EnvironmentCharts.css";

const EnvironmentCharts = ({ historicalData, chartOptions }) => (
    <div className="charts-grid">
        <div className="chart-container">
            <h3>Temperature Trend</h3>
            <Line 
                data={{
                    labels: historicalData.timestamps,
                    datasets: [{
                        label: 'Temperature (°C)',
                        data: historicalData.temperature,
                        borderColor: '#ff6b6b',
                        tension: 0.4
                    }]
                }}
                options={chartOptions}
            />
        </div>

        <div className="chart-container">
            <h3>Humidity Trend</h3>
            <Line 
                data={{
                    labels: historicalData.timestamps,
                    datasets: [{
                        label: 'Humidity (%)',
                        data: historicalData.humidity,
                        borderColor: '#4dabf7',
                        tension: 0.4
                    }]
                }}
                options={chartOptions}
            />
        </div>

        <div className="chart-container">
            <h3>Pressure Trend</h3>
            <Line 
                data={{
                    labels: historicalData.timestamps,
                    datasets: [{
                        label: 'Pressure (hPa)',
                        data: historicalData.pressure,
                        borderColor: '#51cf66',
                        tension: 0.4
                    }]
                }}
                options={chartOptions}
            />
        </div>

        <div className="chart-container">
            <h3>Gas Composition Trend</h3>
            <Line 
                data={{
                    labels: historicalData.timestamps,
                    datasets: [{
                        label: 'Gas (ppb)',
                        data: historicalData.gas,
                        borderColor: '#D65DB1',
                        tension: 0.4
                    }]
                }}
                options={chartOptions}
            />
        </div>
    </div>
);

export default EnvironmentCharts; 