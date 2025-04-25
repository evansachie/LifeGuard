import React from 'react';
import { getAirQualityStatus, getStats } from '../../utils/airQualityUtils';

const SummaryCards = ({ historicalData }) => {
  const tempStats = getStats(historicalData.temperature);
  const humidityStats = getStats(historicalData.humidity);
  const pressureStats = getStats(historicalData.pressure);
  const co2Stats = getStats(historicalData.co2);
  const airQuality = getAirQualityStatus(co2Stats.current);

  return (
    <div className="summary-cards">
      <div className="summary-card">
        <div className="card-header">
          <h3>Temperature</h3>
          <span className="icon-temp">🌡️</span>
        </div>
        <p className="value">{tempStats.current.toFixed(1)}°C</p>
        <div className="stats-grid">
          <div className="stat">
            <span>Avg</span>
            <span>{tempStats.average}°C</span>
          </div>
          <div className="stat">
            <span>Min</span>
            <span>{tempStats.min}°C</span>
          </div>
          <div className="stat">
            <span>Max</span>
            <span>{tempStats.max}°C</span>
          </div>
        </div>
        <p className="trend" style={{ color: tempStats.trend > 0 ? '#FF4B4B' : '#00C853' }}>
          {tempStats.trend > 0 ? '↑' : '↓'} {Math.abs(tempStats.trend).toFixed(1)}° from previous
        </p>
      </div>

      <div className="summary-card">
        <div className="card-header">
          <h3>Air Quality</h3>
          <span className="icon-air">💨</span>
        </div>
        <p className="value" style={{ color: airQuality.color }}>
          {airQuality.status}
        </p>
        <div className="stats-grid">
          <div className="stat">
            <span>CO2</span>
            <span>{co2Stats.current} ppm</span>
          </div>
          <div className="stat">
            <span>Humidity</span>
            <span>{humidityStats.current}%</span>
          </div>
          <div className="stat">
            <span>Pressure</span>
            <span>{pressureStats.current} hPa</span>
          </div>
        </div>
        <p className="recommendation">
          {airQuality.status === 'Excellent' ? '✅ Optimal conditions' : '⚠️ Consider ventilation'}
        </p>
      </div>
    </div>
  );
};

export default SummaryCards;
