import React from 'react';
import EnvironmentCharts from './EnvironmentCharts';
import AirQualityCharts from './AirQualityCharts';
import ReportsSection from './ReportsSection';
import { HistoricalData } from '../../hooks/useSensorHistory';

interface TabContentProps {
  activeTab: 'environment' | 'airQuality' | 'reports';
  historicalData: HistoricalData;
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  isDarkMode?: boolean;
}

const TabContent: React.FC<TabContentProps> = ({ 
  activeTab, 
  historicalData, 
  dateRange, 
  onDateRangeChange,
  isDarkMode = false
}) => {
  // Add console log to debug isDarkMode value
  console.log('TabContent isDarkMode:', isDarkMode);
  
  const chartOptions = { responsive: true };

  const tabComponents = {
    environment: (
      <div className="section">
        <h2 className={isDarkMode ? 'text-white' : 'text-gray-800'}>Environmental Conditions</h2>
        <EnvironmentCharts 
          historicalData={historicalData} 
          chartOptions={chartOptions}
          isDarkMode={isDarkMode} 
        />
      </div>
    ),
    airQuality: (
      <div className="section">
        <h2 className={isDarkMode ? 'text-white' : 'text-gray-800'}>Air Quality Analysis</h2>
        <AirQualityCharts 
          historicalData={historicalData} 
          chartOptions={chartOptions}
          isDarkMode={isDarkMode} 
        />
      </div>
    ),
    reports: (
      <div className="section">
        <h2 className={isDarkMode ? 'text-white' : 'text-gray-800'}>Analytics Reports</h2>
        <ReportsSection
          dateRange={dateRange}
          onDateRangeChange={onDateRangeChange}
          historicalData={historicalData}
          isDarkMode={isDarkMode}
        />
      </div>
    ),
  };

  return tabComponents[activeTab] || null;
};

export default TabContent;
