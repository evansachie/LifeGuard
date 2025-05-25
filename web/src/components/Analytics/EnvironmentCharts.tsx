import React from 'react';
import { Line } from 'react-chartjs-2';
import { HistoricalData } from '../../hooks/useSensorHistory';
import { ChartOptions } from 'chart.js';

interface EnvironmentChartsProps {
  historicalData: HistoricalData;
  chartOptions: ChartOptions<'line'>;
  isDarkMode?: boolean;
}

const EnvironmentCharts: React.FC<EnvironmentChartsProps> = ({ 
  historicalData, 
  chartOptions,
  isDarkMode = false
}) => {
  console.log('EnvironmentCharts isDarkMode:', isDarkMode);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
      <div className={`chart-container ${isDarkMode ? 'dark-mode-chart bg-gray-800' : 'light-mode-chart bg-white'} rounded-xl p-6 shadow-md h-[300px] overflow-hidden flex flex-col justify-between`}>
        <h3 className={`mb-4 text-xl ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Temperature Trend</h3>
        <Line
          data={{
            labels: historicalData.timestamps,
            datasets: [
              {
                label: 'Temperature (°C)',
                data: historicalData.temperature,
                borderColor: '#ff6b6b',
                tension: 0.4,
              },
            ],
          }}
          options={chartOptions}
        />
      </div>

      <div className={`chart-container ${isDarkMode ? 'dark-mode-chart bg-gray-800' : 'light-mode-chart bg-white'} rounded-xl p-6 shadow-md h-[300px] overflow-hidden flex flex-col justify-between`}>
        <h3 className={`mb-4 text-xl ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Humidity Trend</h3>
        <Line
          data={{
            labels: historicalData.timestamps,
            datasets: [
              {
                label: 'Humidity (%)',
                data: historicalData.humidity,
                borderColor: '#4dabf7',
                tension: 0.4,
              },
            ],
          }}
          options={chartOptions}
        />
      </div>

      <div className={`chart-container ${isDarkMode ? 'dark-mode-chart bg-gray-800' : 'light-mode-chart bg-white'} rounded-xl p-6 shadow-md h-[300px] overflow-hidden flex flex-col justify-between`}>
        <h3 className={`mb-4 text-xl ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Pressure Trend</h3>
        <Line
          data={{
            labels: historicalData.timestamps,
            datasets: [
              {
                label: 'Pressure (hPa)',
                data: historicalData.pressure,
                borderColor: '#51cf66',
                tension: 0.4,
              },
            ],
          }}
          options={chartOptions}
        />
      </div>

      <div className={`chart-container ${isDarkMode ? 'dark-mode-chart bg-gray-800' : 'light-mode-chart bg-white'} rounded-xl p-6 shadow-md h-[300px] overflow-hidden flex flex-col justify-between`}>
        <h3 className={`mb-4 text-xl ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Gas Composition Trend</h3>
        <Line
          data={{
            labels: historicalData.timestamps,
            datasets: [
              {
                label: 'Gas (ppb)',
                data: historicalData.gas,
                borderColor: '#D65DB1',
                tension: 0.4,
              },
            ],
          }}
          options={chartOptions}
        />
      </div>
    </div>
  );
}

export default EnvironmentCharts;
