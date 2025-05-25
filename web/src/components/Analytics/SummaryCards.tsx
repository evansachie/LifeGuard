import React from 'react';
import { getAirQualityStatus, getStats } from '../../utils/airQualityUtils';
import { HistoricalData } from '../../hooks/useSensorHistory';

interface SummaryCardsProps {
  historicalData: HistoricalData;
  isDarkMode?: boolean;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ historicalData, isDarkMode = false }) => {
  const tempStats = getStats(historicalData.temperature);
  const humidityStats = getStats(historicalData.humidity);
  const pressureStats = getStats(historicalData.pressure);
  const co2Stats = getStats(historicalData.co2);
  const airQuality = getAirQualityStatus(co2Stats.current);

  return (
    <div className="summary-cards grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      <div className={`summary-card rounded-xl p-5 shadow-md ${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'}`}>
        <div className="card-header flex justify-between items-center mb-3">
          <h3 className="text-xl font-medium">Temperature</h3>
          <span className="icon-temp text-2xl">🌡️</span>
        </div>
        <p className="value text-3xl font-bold">{tempStats.current.toFixed(1)}°C</p>
        <div className="stats-grid grid grid-cols-3 gap-4 my-4">
          <div className="stat">
            <span className="text-sm opacity-75">Avg</span>
            <span className="font-medium">{tempStats.average}°C</span>
          </div>
          <div className="stat">
            <span className="text-sm opacity-75">Min</span>
            <span className="font-medium">{tempStats.min}°C</span>
          </div>
          <div className="stat">
            <span className="text-sm opacity-75">Max</span>
            <span className="font-medium">{tempStats.max}°C</span>
          </div>
        </div>
        <p className="trend" style={{ color: tempStats.trend > 0 ? '#FF4B4B' : '#00C853' }}>
          {tempStats.trend > 0 ? '↑' : '↓'} {Math.abs(tempStats.trend).toFixed(1)}° from previous
        </p>
      </div>

      <div className={`summary-card rounded-xl p-5 shadow-md ${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'}`}>
        <div className="card-header flex justify-between items-center mb-3">
          <h3 className="text-xl font-medium">Air Quality</h3>
          <span className="icon-air text-2xl">💨</span>
        </div>
        <p className="value text-3xl font-bold" style={{ color: airQuality.color }}>
          {airQuality.status}
        </p>
        <div className="stats-grid grid grid-cols-3 gap-4 my-4">
          <div className="stat">
            <span className="text-sm opacity-75">CO2</span>
            <span className="font-medium">{co2Stats.current} ppm</span>
          </div>
          <div className="stat">
            <span className="text-sm opacity-75">Humidity</span>
            <span className="font-medium">{humidityStats.current}%</span>
          </div>
          <div className="stat">
            <span className="text-sm opacity-75">Pressure</span>
            <span className="font-medium">{pressureStats.current} hPa</span>
          </div>
        </div>
        <p className="recommendation mt-2">
          {airQuality.status === 'Excellent' ? '✅ Optimal conditions' : '⚠️ Consider ventilation'}
        </p>
      </div>
    </div>
  );
};

export default SummaryCards;
