import React, { useState } from 'react';
import { useBLE } from '../../contexts/BLEContext';
import { analyticsTabsData } from '../../utils/constants';
import TabNavigation from '../../components/Analytics/TabNavigation';
import TabContent from '../../components/Analytics/TabContent';
import useSensorHistory from '../../hooks/useSensorHistory';
import registerCharts from '../../utils/registerCharts';
import { IoMdAnalytics } from 'react-icons/io';
import './Analytics.css';

registerCharts();

interface AnalyticsProps {
  isDarkMode: boolean;
}

type TabType = 'environment' | 'airQuality' | 'reports';
type DateRangeType = '24h' | '7d' | '30d' | '90d';

const Analytics: React.FC<AnalyticsProps> = ({ isDarkMode }) => {
  const { sensorData } = useBLE();
  const [activeTab, setActiveTab] = useState<TabType>('environment');
  const [dateRange, setDateRange] = useState<DateRangeType>('24h');

  const historicalData = useSensorHistory(sensorData, 30);

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
        onTabChange={(tab: TabType) => setActiveTab(tab)}
        tabs={analyticsTabsData}
      />

      <div className="analytics-content">
        <TabContent
          activeTab={activeTab}
          historicalData={historicalData}
          dateRange={dateRange}
          onDateRangeChange={(range: DateRangeType) => setDateRange(range)}
        />
      </div>
    </div>
  );
};

export default Analytics;
