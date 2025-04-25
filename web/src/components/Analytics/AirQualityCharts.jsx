import React from 'react';
import { Line } from 'react-chartjs-2';

const AirQualityCharts = ({ historicalData, chartOptions }) => (
  <div className="charts-grid">
    <div className="chart-container">
      <h3>CO2 Levels</h3>
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

    <div className="chart-container">
      <h3>Gas Composition</h3>
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

export default AirQualityCharts;
