import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HealthReport.css';
import { FaTemperatureHigh, FaTint, FaWalking, FaFileAlt, FaChartLine, FaCalendarAlt } from 'react-icons/fa';
import { WiBarometer } from "react-icons/wi";
import { MdAir } from "react-icons/md";

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="stat-card" style={{ '--card-color': color }}>
    <div className="stat-icon">
      <Icon />
    </div>
    <div className="stat-info">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  </div>
);

const ReportCard = ({ date, type, status }) => (
  <div className="report-card">
    <div className="report-card-left">
      <div className="report-icon">
        <FaFileAlt />
      </div>
      <div className="report-info">
        <h3 className="report-title">{type}</h3>
        <p className="report-date">{date}</p>
      </div>
    </div>
    <div className="report-status" style={{ '--status-color': status === 'Normal' ? '#4CAF50' : '#FF9800' }}>
      {status}
    </div>
  </div>
);

export default function HealthReport({ isDarkMode }) {
  const navigate = useNavigate();
  
  // Mock data
  const healthData = {
    stats: [
      { icon: FaTemperatureHigh, label: 'Temperature', value: '30°C', color: '#FF6B6B' },
      { icon: FaTint, label: 'Humidity', value: '58.8%', color: '#4A90E2' },
      { icon: WiBarometer, label: 'Pressure', value: '1013 hPa', color: '#9B51E0' },
      { icon: FaWalking, label: 'Steps', value: '1.2K', color: '#F5A623' },
      { icon: MdAir, label: 'Air Quality', value: '75 AQI', color: '#2ECC71' },
      { icon: FaChartLine, label: 'Activity', value: '+15%', color: '#1ABC9C' }
    ],
    reports: [
      { id: 1, date: 'Jul 10, 2023', type: 'General Health Report', status: 'Normal' },
      { id: 2, date: 'Jul 5, 2023', type: 'Air Quality Report', status: 'Warning' },
      { id: 3, date: 'Jul 1, 2023', type: 'Activity Report', status: 'Normal' }
    ]
  };

  return (
    <div className={`health-report ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="health-report-container">
        {/* Header Section */}
        <div className="header-section">
          <div className="header-left">
            <h1 className="page-title">Health Report</h1>
            <p className="subtitle">Track your health metrics and environmental conditions</p>
          </div>
          <div className="header-right">
            <div className="date-picker">
              <FaCalendarAlt />
              <span>Last 30 Days</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {healthData.stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Reports Section */}
        <div className="reports-container">
          <div className="reports-header">
            <h2>Recent Reports</h2>
            <button className="generate-button">Generate New Report</button>
          </div>
          <div className="reports-list">
            {healthData.reports.map(report => (
              <ReportCard key={report.id} {...report} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
