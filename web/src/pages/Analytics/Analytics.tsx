import React, { useState } from 'react';
import { useBLE } from '../../contexts/BLEContext';
import { TABS } from '../../utils/constants';
import TabNavigation, { Tab as TabNavigationType } from '../../components/Analytics/TabNavigation';
import TabContent from '../../components/Analytics/TabContent';
import useSensorHistory from '../../hooks/useSensorHistory';
import registerCharts from '../../utils/registerCharts';
import { IoMdAnalytics } from 'react-icons/io';
import './Analytics.css';

registerCharts();

interface AnalyticsProps {
  isDarkMode: boolean;
}

function Analytics({ isDarkMode }: AnalyticsProps) {
  const { sensorData } = useBLE();
  // Ensure activeTab is one of the allowed values
  const [activeTab, setActiveTab] = useState<'environment' | 'airQuality' | 'reports'>('environment');
  const [dateRange, setDateRange] = useState('24h');

  const historicalData = useSensorHistory(sensorData, 30);
  
  // Properly type the tabs by first casting to unknown, then to the Tab type
  const analyticsTabs = TABS as unknown as TabNavigationType[];

  return (
    <div className={`analytics-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <IoMdAnalytics className="text-3xl" />
          <h1 className="text-3xl font-semibold">Sensor Analytics</h1>
        </div>
      </div>

      <TabNavigation 
        activeTab={activeTab} 
        onTabChange={(tabId) => setActiveTab(tabId as 'environment' | 'airQuality' | 'reports')} 
        tabs={analyticsTabs} 
      />

      <div className="analytics-content">
        <TabContent
          activeTab={activeTab}
          historicalData={historicalData}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
}

export default Analytics;
