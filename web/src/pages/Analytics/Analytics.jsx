import React, { useState } from 'react';
import { useBLE } from '../../contexts/BLEContext';
import { TABS } from '../../utils/constants';
import TabNavigation from '../../components/Analytics/TabNavigation';
import TabContent from '../../components/Analytics/TabContent';
import useSensorHistory from '../../hooks/useSensorHistory';
import registerCharts from '../../utils/registerCharts';
import './Analytics.css';

registerCharts();

function Analytics({ isDarkMode }) {
    const { sensorData } = useBLE();
    const [activeTab, setActiveTab] = useState('environment');
    const [dateRange, setDateRange] = useState('24h');
    
    const historicalData = useSensorHistory(sensorData, 30);

    return (
        <div className={`analytics-container ${isDarkMode ? 'dark-mode' : ''}`}>
            <div className="analytics-header">
                <h1>Sensor Analytics</h1>
                <TabNavigation 
                    activeTab={activeTab} 
                    onTabChange={setActiveTab} 
                    tabs={TABS} 
                />
            </div>

            <div className="analytics-content">
                <TabContent 
                    activeTab={activeTab} 
                    historicalData={historicalData} 
                    dateRange={dateRange} 
                    onDateRangeChange={setDateRange} 
                />
            </div>
        </div>
    );
}

export default Analytics;