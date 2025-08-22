import { motion } from 'framer-motion';
import {
  FaThermometerHalf,
  FaMask,
  FaWind,
  FaSmog,
  FaTint,
  FaTemperatureHigh,
} from 'react-icons/fa';
import { getPollutionLevel } from '../../utils/getPollutionLevel';
import { PollutionZone } from '../../types/pollutionTracker.types';

interface PollutionInfoProps {
  zone: PollutionZone;
}

const PollutionInfo = ({ zone }: PollutionInfoProps) => {
  // Log pollution tracker data source with enhanced detection
  if (zone.isRealTime) {
    console.log('� POLLUTION TRACKER ZONE DATA (REAL-TIME FIREBASE):');
    console.log('   📍 Zone:', zone.name);
    console.log('   🌿 AQI:', zone.data.aqi, '[REAL-TIME ARDUINO NICLA SENSE ME DATA]');
    console.log('   🌫️ PM2.5:', zone.data.pm25, 'µg/m³ [REAL-TIME ARDUINO NICLA SENSE ME DATA]');
    console.log('   🌫️ PM10:', zone.data.pm10, 'µg/m³ [REAL-TIME ARDUINO NICLA SENSE ME DATA]');
    console.log('   📊 Coordinates:', zone.coordinates, '[REAL GPS LOCATION]');
    console.log('   ⏰ Description:', zone.description);
  } else {
    console.log('�🗺️ POLLUTION TRACKER ZONE DATA (HARDCODED FALLBACK):');
    console.log('   📍 Zone:', zone.name);
    console.log('   🌿 AQI:', zone.data.aqi, '[HARDCODED MOCK DATA]');
    console.log('   🌫️ PM2.5:', zone.data.pm25, 'µg/m³ [HARDCODED MOCK DATA]');
    console.log('   🌫️ PM10:', zone.data.pm10, 'µg/m³ [HARDCODED MOCK DATA]');
    console.log('   📊 Coordinates:', zone.coordinates, '[HARDCODED LOCATIONS]');
  }

  return (
    <motion.div
      className="pollution-info"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      <div className="flex justify-between items-start mb-2">
        <h3>Air Quality Index</h3>
        {zone.isRealTime && (
          <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">🔴 LIVE</span>
        )}
      </div>
      {zone.isRealTime && (
        <p className="text-xs text-gray-500 mb-3">Real-time data from Arduino Nicla Sense ME</p>
      )}
      <div className="info-grid">
        <motion.div className="info-item" whileHover={{ scale: 1.05 }}>
          <FaThermometerHalf />
          <span className="label">AQI</span>
          <span className={`value ${getPollutionLevel(zone.data.aqi, 'aqi')}`}>
            {zone.data.aqi}
          </span>
        </motion.div>

        {zone.data.co2 && (
          <motion.div className="info-item" whileHover={{ scale: 1.05 }}>
            <FaSmog />
            <span className="label">CO2</span>
            <span
              className={`value ${zone.data.co2 > 1000 ? 'high' : zone.data.co2 > 400 ? 'moderate' : 'normal'}`}
            >
              {zone.data.co2} ppm
            </span>
          </motion.div>
        )}

        {zone.realTimeData?.temperature && (
          <motion.div className="info-item" whileHover={{ scale: 1.05 }}>
            <FaTemperatureHigh />
            <span className="label">Temp</span>
            <span className={`value ${zone.realTimeData.temperature > 30 ? 'high' : 'normal'}`}>
              {zone.realTimeData.temperature.toFixed(1)}°C
            </span>
          </motion.div>
        )}

        {zone.realTimeData?.humidity && (
          <motion.div className="info-item" whileHover={{ scale: 1.05 }}>
            <FaTint />
            <span className="label">Humidity</span>
            <span className={`value ${zone.realTimeData.humidity > 70 ? 'high' : 'normal'}`}>
              {zone.realTimeData.humidity}%
            </span>
          </motion.div>
        )}

        <motion.div className="info-item" whileHover={{ scale: 1.05 }}>
          <FaMask />
          <span className="label">PM2.5</span>
          <span className={`value ${getPollutionLevel(zone.data.pm25, 'pm25')}`}>
            {zone.data.pm25}
          </span>
        </motion.div>
        <motion.div className="info-item" whileHover={{ scale: 1.05 }}>
          <FaWind />
          <span className="label">PM10</span>
          <span className={`value ${getPollutionLevel(zone.data.pm10, 'pm10')}`}>
            {zone.data.pm10}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PollutionInfo;
