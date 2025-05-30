import React from 'react';
import EnvironmentCharts from './EnvironmentCharts';
import AirQualityCharts from './AirQualityCharts';
import ReportsSection from './ReportsSection';

type TabType = 'environment' | 'airQuality' | 'reports';
type DateRangeType = '24h' | '7d' | '30d' | '90d';

export interface TabContentProps {
  activeTab: TabType;
  historicalData: any;
  dateRange: DateRangeType;
  onDateRangeChange: (range: DateRangeType) => void;
}

const TabContent: React.FC<TabContentProps> = ({ 
  activeTab, 
  historicalData, 
  dateRange, 
  onDateRangeChange 
}) => {
  const chartOptions = { responsive: true };

  const tabComponents = {
    environment: (
      <div className="section">
        <h2 className="text-gray-800">Environmental Conditions</h2>
        <EnvironmentCharts 
          historicalData={historicalData} 
          chartOptions={chartOptions}
        />
      </div>
    ),
    airQuality: (
      <div className="section">
        <h2 className="text-gray-800">Air Quality Analysis</h2>
        <AirQualityCharts 
          historicalData={historicalData} 
          chartOptions={chartOptions}
        />
      </div>
    ),
    reports: (
      <div className="section">
        <h2 className="text-gray-800">Analytics Reports</h2>
        <ReportsSection
          dateRange={dateRange}
          onDateRangeChange={onDateRangeChange}
          historicalData={historicalData}
        />
      </div>
    ),
  };

  return tabComponents[activeTab] || null;
};

export default TabContent;
