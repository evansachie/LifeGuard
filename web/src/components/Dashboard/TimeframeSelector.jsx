import React from 'react';
import { timeframes } from '../../data/timeframes';
import './TimeframeSelector.css';

const TimeframeSelector = ({ isDarkMode, selectedTimeframe = 'today', onTimeframeChange }) => {
  return (
    <div className={`timeframe-selector ${isDarkMode ? 'dark-mode' : ''}`}>
      <span className="timeframe-label">View data for:</span>
      <div className="timeframe-options">
        {timeframes.map((timeframe) => (
          <button
            key={timeframe.id}
            className={`timeframe-btn ${selectedTimeframe === timeframe.id ? 'active' : ''}`}
            onClick={() => onTimeframeChange(timeframe.id)}
          >
            {timeframe.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeframeSelector;
