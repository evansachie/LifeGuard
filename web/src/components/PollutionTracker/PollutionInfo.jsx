import React from 'react';
import { motion } from 'framer-motion';
import { FaThermometerHalf, FaMask, FaWind } from 'react-icons/fa';

const getPollutionLevel = (value, type) => {
  switch(type) {
    case 'aqi':
      return value > 150 ? 'high' : value > 50 ? 'medium' : 'low';
    case 'pm25':
      return value > 35 ? 'high' : value > 12 ? 'medium' : 'low';
    case 'pm10':
      return value > 150 ? 'high' : value > 50 ? 'medium' : 'low';
    default:
      return 'medium';
  }
};

const PollutionInfo = ({ zone }) => (
  <motion.div
    className="pollution-info"
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
  >
    <h3>Air Quality Index</h3>
    <div className="info-grid">
      <motion.div 
        className="info-item"
        whileHover={{ scale: 1.05 }}
      >
        <FaThermometerHalf />
        <span className="label">AQI</span>
        <span className={`value ${getPollutionLevel(zone.data.aqi, 'aqi')}`}>
          {zone.data.aqi}
        </span>
      </motion.div>
      <motion.div 
        className="info-item"
        whileHover={{ scale: 1.05 }}
      >
        <FaMask />
        <span className="label">PM2.5</span>
        <span className={`value ${getPollutionLevel(zone.data.pm25, 'pm25')}`}>
          {zone.data.pm25}
        </span>
      </motion.div>
      <motion.div 
        className="info-item"
        whileHover={{ scale: 1.05 }}
      >
        <FaWind />
        <span className="label">PM10</span>
        <span className={`value ${getPollutionLevel(zone.data.pm10, 'pm10')}`}>
          {zone.data.pm10}
        </span>
      </motion.div>
    </div>
  </motion.div>
);

export default PollutionInfo;
