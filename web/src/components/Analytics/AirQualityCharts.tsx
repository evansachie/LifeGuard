import { Line } from 'react-chartjs-2';
import { HistoricalData } from '../../hooks/useSensorHistory';
import { ChartOptions } from 'chart.js';

interface AirQualityChartsProps {
  historicalData: HistoricalData;
  chartOptions: ChartOptions<'line'>;
  isDarkMode?: boolean;
}

const AirQualityCharts = ({
  historicalData,
  chartOptions,
  isDarkMode = false,
}: AirQualityChartsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
      <div
        className={`chart-container ${isDarkMode ? 'dark-mode-chart bg-gray-800' : 'light-mode-chart bg-white'} rounded-xl p-6 shadow-md h-[300px] overflow-hidden flex flex-col justify-between`}
      >
        <h3 className={`mb-4 text-xl ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          CO2 Levels
        </h3>
        <Line
          data={{
            labels: historicalData.timestamps,
            datasets: [
              {
                label: 'CO2 (ppm)',
                data: historicalData.co2,
                borderColor: '#845EC2',
                tension: 0.4,
              },
            ],
          }}
          options={chartOptions}
        />
      </div>

      <div
        className={`chart-container ${isDarkMode ? 'dark-mode-chart bg-gray-800' : 'light-mode-chart bg-white'} rounded-xl p-6 shadow-md h-[300px] overflow-hidden flex flex-col justify-between`}
      >
        <h3 className={`mb-4 text-xl ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          VOC Levels
        </h3>
        <Line
          data={{
            labels: historicalData.timestamps,
            datasets: [
              {
                label: 'VOC (ppb)',
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
};

export default AirQualityCharts;
