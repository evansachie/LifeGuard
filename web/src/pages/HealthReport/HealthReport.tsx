import React, { useState } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import { StatCard } from '../../components/HealthReport/StatCard';
import { ReportCard } from '../../components/HealthReport/ReportCard';
import { healthData } from '../../data/health-report-data';
import { RiHealthBookFill } from 'react-icons/ri';
import HealthReportModal from '../../components/HealthReportModal/HealthReportModal';
import './HealthReport.css';
import { IconType } from 'react-icons';

interface HealthReportProps {
  isDarkMode: boolean;
}

const HealthReport: React.FC<HealthReportProps> = ({ isDarkMode }) => {
  const [showReportModal, setShowReportModal] = useState<boolean>(false);

  return (
    <div className={`health-report ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="health-report-container">
        {/* Header Section */}
        <div className="header-section">
          <div className="header-left">
            <RiHealthBookFill size={32} />
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
            <StatCard
              key={index}
              icon={stat.icon as IconType}
              label={stat.label}
              value={stat.value}
              color={stat.color}
            />
          ))}
        </div>

        {/* Reports Section */}
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
      </div>

      <HealthReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        userData={healthData}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default HealthReport;
