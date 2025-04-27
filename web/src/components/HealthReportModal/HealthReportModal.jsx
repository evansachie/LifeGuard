import React, { useRef, useEffect } from 'react';
import { FaTemperatureHigh, FaWalking } from 'react-icons/fa';
import { WiHumidity, WiBarometer } from 'react-icons/wi';
import { FaTimes, FaDownload, FaFileCsv } from 'react-icons/fa';
import { generateHealthReport } from '../../data/health-report-data';
import AccessibleDropdown from '../AccessibleDropdown/AccessibleDropdown';
import './HealthReportModal.css';

export default function HealthReportModal({ isOpen, onClose, userData, isDarkMode }) {
  const modalRef = useRef(null);

  const report = isOpen ? generateHealthReport(userData) : null;

  const iconMapping = {
    temperature: <FaTemperatureHigh size={32} />,
    humidity: <WiHumidity size={32} />,
    pressure: <WiBarometer size={42} />,
    activityLevel: <FaWalking size={32} />,
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose, isOpen]);

  const handlePdfDownload = () => {
    window.print();
  };

  const handleCsvDownload = () => {
    if (!report) return;

    // Convert report data to CSV format
    const csvData = [
      ['Report ID', report.userInfo.reportId],
      ['Date', report.userInfo.date],
      ['Patient', report.userInfo.name],
      [''],
      ['Vital Statistics'],
      ['Metric', 'Average', 'Min', 'Max', 'Status'],
      ...Object.entries(report.vitals).map(([key, value]) => [
        key,
        value.average,
        value.min,
        value.max,
        value.status,
      ]),
      [''],
      ['Environmental Metrics'],
      ['Metric', 'Average', 'Status'],
      ...Object.entries(report.environmentalMetrics).map(([key, value]) => [
        key,
        value.average,
        value.status,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    // Create and download CSV file
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `health_report_${report.userInfo.reportId}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="health-report-modal-overlay">
      <div ref={modalRef} className={`health-report-modal ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className="modal-header">
          <AccessibleDropdown
            isOpen={false}
            onToggle={onClose}
            ariaLabel="Close health report"
            className="close-button"
          >
            <FaTimes />
          </AccessibleDropdown>

          <div className="download-buttons">
            <AccessibleDropdown
              isOpen={false}
              onToggle={handlePdfDownload}
              ariaLabel="Download PDF"
              className="download-button pdf"
            >
              <FaDownload /> PDF
            </AccessibleDropdown>

            <AccessibleDropdown
              isOpen={false}
              onToggle={handleCsvDownload}
              ariaLabel="Download CSV"
              className="download-button csv"
            >
              <FaFileCsv /> CSV
            </AccessibleDropdown>
          </div>
        </div>

        <div className="report-content">
          <div className="report-header">
            <img src="/images/lifeguard-2.svg" alt="LifeGuard Logo" className="report-logo" />
            <div className="report-meta">
              <p>Report ID: {report.userInfo.reportId}</p>
              <p>Date: {report.userInfo.date}</p>
              <p>Patient: {report.userInfo.name}</p>
            </div>
          </div>

          <section className="report-section">
            <h2>Vital Statistics</h2>
            <div className="metrics-grid">
              {Object.entries(report.vitals).map(([key, value]) => (
                <div key={key} className="metric-card">
                  {iconMapping[key] || <FaTemperatureHigh />}
                  <h3>{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                  <div className="metric-value">{value.average}</div>
                  <div className={`metric-status ${value.status.toLowerCase()}`}>
                    {value.status}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="report-section">
            <h2>Recommendations</h2>
            <ul className="recommendations-list">
              {report.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
