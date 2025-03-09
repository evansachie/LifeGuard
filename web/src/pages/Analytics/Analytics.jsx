import React, { useState, useEffect } from 'react';
import './Analytics.css';
import { useBLE } from '../../contexts/BLEContext';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { TABS } from '../../utils/constants';
import EnvironmentCharts from '../../components/Analytics/EnvironmentCharts';
import AirQualityCharts from '../../components/Analytics/AirQualityCharts';
import ReportHeader from '../../components/Analytics/ReportHeader';
import SummaryCards from '../../components/Analytics/SummaryCards';
import { exportToCSV } from '../../utils/exportUtils';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function Analytics({ isDarkMode }) {
    const { sensorData } = useBLE();
    const [activeTab, setActiveTab] = useState('environment');
    const [historicalData, setHistoricalData] = useState({
        temperature: [],
        humidity: [],
        pressure: [],
        co2: [],
        gas: [],
        timestamps: []
    });
    const [dateRange, setDateRange] = useState('24h');

    useEffect(() => {
        if (sensorData) {
            const timestamp = new Date().toLocaleTimeString();
            setHistoricalData(prev => ({
                temperature: [...prev.temperature, sensorData.temperature].slice(-30),
                humidity: [...prev.humidity, sensorData.humidity].slice(-30),
                pressure: [...prev.pressure, sensorData.pressure].slice(-30),
                co2: [...prev.co2, sensorData.co2].slice(-30),
                gas: [...prev.gas, sensorData.gas].slice(-30),
                timestamps: [...prev.timestamps, timestamp].slice(-30)
            }));
        }
    }, [sensorData]);

    const renderEnvironmentCharts = () => (
        <EnvironmentCharts historicalData={historicalData} chartOptions={{ responsive: true }} />
    );

    const renderAirQualityCharts = () => (
        <AirQualityCharts historicalData={historicalData} chartOptions={{ responsive: true }} />
    );

    const renderReports = () => (
        <div className="reports-section">
            <ReportHeader dateRange={dateRange} onDateRangeChange={setDateRange} />
            <SummaryCards historicalData={historicalData} />
            <div className="export-section">
                <h3>Data Export</h3>
                <button className="export-btn" onClick={() => exportToCSV(historicalData)}>
                    Export as CSV
                </button>
            </div>
        </div>
    );

    return (
        <div className={`analytics-container ${isDarkMode ? 'dark-mode' : ''}`}>
            <div className="analytics-header">
                <h1>Sensor Analytics</h1>
                <div className="tabs">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="analytics-content">
                {activeTab === 'environment' && (
                    <div className="section">
                        <h2>Environmental Conditions</h2>
                        {renderEnvironmentCharts()}
                    </div>
                )}

                {activeTab === 'airQuality' && (
                    <div className="section">
                        <h2>Air Quality Analysis</h2>
                        {renderAirQualityCharts()}
                    </div>
                )}

                {activeTab === 'reports' && (
                    <div className="section">
                        <h2>Analytics Reports</h2>
                        {renderReports()}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Analytics; 