import React from 'react';
import './TimeframeSelector.css';

const TimeframeSelector = ({ isDarkMode, selectedTimeframe = 'today', onTimeframeChange }) => {
  const timeframes = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'This Quarter' },
    { id: 'year', label: 'This Year' }
  ];
  
  return (
    <div className={`timeframe-selector ${isDarkMode ? 'dark-mode' : ''}`}>
      <span className="timeframe-label">View data for:</span>
      <div className="timeframe-options">
        {timeframes.map(timeframe => (
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
