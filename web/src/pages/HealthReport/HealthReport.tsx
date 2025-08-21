import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaTemperatureHigh, FaTint, FaWalking, FaChartLine } from 'react-icons/fa';
import { WiBarometer } from 'react-icons/wi';
import { MdAir } from 'react-icons/md';
import { StatCard } from '../../components/HealthReport/StatCard';
import { ReportCard } from '../../components/HealthReport/ReportCard';
import { healthData } from '../../data/health-report-data';
import { RiHealthBookFill } from 'react-icons/ri';
import HealthReportModal from '../../components/HealthReportModal/HealthReportModal';
import { apiMethods } from '../../utils/api';
import { useBLE } from '../../contexts/BLEContext';
import './HealthReport.css';
import { IconType } from 'react-icons';

// Helper function to convert API data to stats format
const getStatsFromApiData = (apiData: any) => {
  console.log('🔍 Converting API data to stats:', apiData);
  const stats = [
    {
      icon: FaTemperatureHigh,
      label: 'Temperature',
      value: apiData.avgAmbientTemp ? `${apiData.avgAmbientTemp.toFixed(1)}°C` : '24°C',
      color: '#FF6B6B',
    },
    {
      icon: FaTint,
      label: 'Humidity',
      value: apiData.avgHumidity ? `${apiData.avgHumidity.toFixed(1)}%` : '58.8%',
      color: '#4A90E2',
    },
    {
      icon: WiBarometer,
      label: 'Pressure',
      value: '1013 hPa', // Not available in API, use default
      color: '#9B51E0',
    },
    {
      icon: FaWalking,
      label: 'Steps',
      value: apiData.totalSteps ? `${(apiData.totalSteps / 1000).toFixed(1)}K` : '1.2K',
      color: '#F5A623',
    },
    {
      icon: MdAir,
      label: 'Air Quality',
      value: apiData.avgAirQualityIndex ? `${apiData.avgAirQualityIndex} AQI` : '75 AQI',
      color: '#2ECC71',
    },
    {
      icon: FaChartLine,
      label: 'Activity',
      value: apiData.avgDailySteps ? `${(apiData.avgDailySteps / 1000).toFixed(1)}K avg` : '+15%',
      color: '#1ABC9C',
    },
  ];
  console.log('📊 Generated stats:', stats);
  return stats;
};

// Helper function to convert live Arduino data to stats format
const getStatsFromArduinoData = (sensorData: any) => {
  const env = sensorData?.environmental;
  return [
    {
      icon: FaTemperatureHigh,
      label: 'Temperature (Live)',
      value: env?.temperature ? `${env.temperature.toFixed(1)}°C` : '24°C',
      color: '#FF6B6B',
    },
    {
      icon: FaTint,
      label: 'Humidity (Live)',
      value: env?.humidity ? `${env.humidity}%` : '58.8%',
      color: '#4A90E2',
    },
    {
      icon: WiBarometer,
      label: 'Pressure (Live)',
      value: env?.pressure ? `${env.pressure.toFixed(1)} hPa` : '1013 hPa',
      color: '#9B51E0',
    },
    {
      icon: FaWalking,
      label: 'Motion (Live)',
      value: sensorData?.motion?.accelerometer ? 'Active' : 'Still',
      color: '#F5A623',
    },
    {
      icon: MdAir,
      label: 'Air Quality (Live)',
      value: env?.airQuality?.aqi ? `${env.airQuality.aqi.toFixed(0)} AQI` : '75 AQI',
      color: '#2ECC71',
    },
    {
      icon: FaChartLine,
      label: 'CO2 (Live)',
      value: env?.airQuality?.co2 ? `${env.airQuality.co2} ppm` : '400 ppm',
      color: '#1ABC9C',
    },
  ];
};

interface HealthReportProps {
  isDarkMode: boolean;
}

const HealthReport = ({ isDarkMode }: HealthReportProps) => {
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [healthReportData, setHealthReportData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [dateRange, setDateRange] = useState<string>('30');
  const [showLiveData, setShowLiveData] = useState<boolean>(false);

  // Get live Arduino sensor data
  const { latestSensorData, connectedDevice } = useBLE();

  const deviceId = 'n0pTQbgNwb4mrDjVLs3Xzw==';

  // Fetch health report data
  useEffect(() => {
    const fetchHealthReport = async () => {
      try {
        setLoading(true);
        setError('');

        console.log(`📊 Fetching health report for device: ${deviceId}, range: ${dateRange} days`);

        const response = await apiMethods.getHealthReport(deviceId, dateRange);

        if (response && (response.isSuccess ? response.data : response)) {
          const healthData = response.isSuccess ? response.data : response;
          console.log('✅ Health report data received:', healthData);
          setHealthReportData(healthData);
        } else {
          console.warn('⚠️ Using fallback health data - API response:', response);
          // Fallback to mock data if API fails
          setHealthReportData(null);
        }
      } catch (err) {
        console.error('❌ Error fetching health report:', err);
        setError('Failed to load health report data');
        // Fallback to mock data on error
        setHealthReportData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthReport();
  }, [dateRange]);

  // Handle date range change
  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
  };

  return (
    <div className={`health-report ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="health-report-container">
        {/* Header Section */}
        <div className="header-section">
          <div className="header-left">
            <RiHealthBookFill size={32} />
            <h1 className="page-title">Health Report</h1>
            <p className="subtitle">
              Track your health metrics and environmental conditions
              {connectedDevice && (
                <span className="arduino-status">• 🔴 Arduino Nicla Sense ME Connected</span>
              )}
            </p>
          </div>
          <div className="header-right">
            <div className="date-picker">
              <FaCalendarAlt />
              <select
                value={dateRange}
                onChange={(e) => handleDateRangeChange(e.target.value)}
                className="date-range-select"
                title="Select date range"
                aria-label="Select date range for health report"
              >
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
                <option value="365">Last Year</option>
              </select>
            </div>
            {connectedDevice && (
              <button
                className={`live-data-toggle ${showLiveData ? 'active' : ''}`}
                onClick={() => setShowLiveData(!showLiveData)}
                title="Toggle between historical and live Arduino data"
              >
                {showLiveData ? '📊 Historical' : '🔴 Live Arduino'}
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-container">
            <p>Loading health report data...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        )}

        {/* Stats Grid */}
        {!loading && !error && (
          <div className="stats-grid">
            {(() => {
              if (showLiveData && connectedDevice && latestSensorData) {
                console.log('🔴 Rendering LIVE Arduino data');
                return getStatsFromArduinoData(latestSensorData).map((stat, index) => (
                  <StatCard
                    key={`live-${index}`}
                    icon={stat.icon as IconType}
                    label={stat.label}
                    value={stat.value}
                    color={stat.color}
                  />
                ));
              } else {
                console.log('📊 Rendering health report data:', {
                  hasHealthReportData: !!healthReportData,
                  healthReportData,
                  usingFallback: !healthReportData,
                });
                return (
                  healthReportData ? getStatsFromApiData(healthReportData) : healthData.stats
                ).map((stat, index) => (
                  <StatCard
                    key={`historical-${index}`}
                    icon={stat.icon as IconType}
                    label={stat.label}
                    value={stat.value}
                    color={stat.color}
                  />
                ));
              }
            })()}
          </div>
        )}

        {/* Reports Section */}
        {!loading && !error && (
          <div className="reports-container">
            <div className="reports-header">
              <h2>Recent Reports</h2>
              <button className="generate-button" onClick={() => setShowReportModal(true)}>
                Generate New Report
              </button>
            </div>
            <div className="reports-list">
              {healthData.reports.map((report) => (
                <ReportCard key={report.id} {...report} />
              ))}
            </div>
          </div>
        )}
      </div>

      <HealthReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        userData={healthReportData || healthData}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default HealthReport;
