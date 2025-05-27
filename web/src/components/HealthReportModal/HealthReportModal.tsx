import React from 'react';
import { FaTemperatureHigh, FaWalking } from 'react-icons/fa';
import { WiHumidity, WiBarometer } from 'react-icons/wi';
import { FaDownload, FaFileCsv } from 'react-icons/fa';
import { generateHealthReport, HealthReportData } from '../../data/health-report-data';
import Modal from '../Modal/Modal';
import { UserData } from '../../types/common.types';

interface HealthReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: UserData | any;
  isDarkMode: boolean;
}

const HealthReportModal: React.FC<HealthReportModalProps> = ({ isOpen, onClose, userData, isDarkMode }) => {
  const report: HealthReportData | null = isOpen ? generateHealthReport(userData) : null;

  const iconMapping = {
    temperature: <FaTemperatureHigh size={32} />,
    humidity: <WiHumidity size={32} />,
    pressure: <WiBarometer size={42} />,
    activityLevel: <FaWalking size={32} />,
  };

  const handlePdfDownload = (): void => {
    window.print();
  };

  const handleCsvDownload = (): void => {
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

  if (!report) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      maxWidth="max-w-4xl" 
      isDarkMode={isDarkMode}
      showCloseButton={true}
      zIndex="z-[1100]"
    >
      <div className="w-full max-h-[80vh] overflow-y-auto">
        {/* Header with Download Buttons */}
        <div className="sticky top-0 z-10 flex justify-end items-center p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-3">
            <button
              onClick={handlePdfDownload}
              aria-label="Download PDF"
              className="flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors text-sm font-medium"
            >
              <FaDownload /> PDF
            </button>
            <button
              onClick={handleCsvDownload}
              aria-label="Download CSV"
              className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors text-sm font-medium"
            >
              <FaFileCsv /> CSV
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div className="p-4 md:p-6">
          {/* Report Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex-shrink-0">
              <img src="/images/lifeguard-2.svg" alt="LifeGuard Logo" className="h-20 w-auto" />
            </div>
            <div className="flex-grow text-center md:text-left">
              <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">Health Report</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                <span className="font-semibold">Report ID:</span> {report.userInfo.reportId}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                <span className="font-semibold">Date:</span> {report.userInfo.date}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Patient:</span> {report.userInfo.name}
              </p>
            </div>
          </div>

          {/* Vital Statistics Section */}
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 pb-1 border-b-2 border-gray-200 dark:border-gray-700">
              Vital Statistics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
              {Object.entries(report.vitals).map(([key, value]) => (
                <div 
                  key={key} 
                  className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-700 transition-transform hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex justify-center text-indigo-500 dark:text-indigo-400 mb-2">
                    {iconMapping[key as keyof typeof iconMapping] || <FaTemperatureHigh />}
                  </div>
                  <h3 className="text-md font-medium text-center text-gray-700 dark:text-gray-300 capitalize mb-1">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  <div className="text-xl font-bold text-center text-gray-900 dark:text-gray-100 mb-2">
                    {value.average}
                  </div>
                  <div 
                    className={`
                      text-xs font-semibold uppercase text-center py-1 px-2 rounded-full mx-auto w-fit
                      ${value.status.toLowerCase() === 'normal' 
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' 
                        : value.status.toLowerCase() === 'low'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                      }
                    `}
                  >
                    {value.status}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Environmental Metrics Section */}
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 pb-1 border-b-2 border-gray-200 dark:border-gray-700">
              Environmental Metrics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(report.environmentalMetrics).map(([key, value]) => (
                <div 
                  key={key} 
                  className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-700 transition-transform hover:-translate-y-1 hover:shadow-md"
                >
                  <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 capitalize mb-1">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  <div className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {value.average}
                  </div>
                  <div 
                    className={`
                      text-xs font-semibold uppercase py-1 px-2 rounded-full w-fit
                      ${value.status.toLowerCase() === 'normal' || value.status.toLowerCase() === 'optimal'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' 
                        : value.status.toLowerCase() === 'moderate'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }
                    `}
                  >
                    {value.status}
                  </div>
                  {key === 'airQuality' && 'pollutants' in value && (
                    <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700 text-sm">
                      <p className="text-gray-600 dark:text-gray-400 mb-1">
                        <span className="font-medium">PM2.5:</span> {value.pollutants.pm25}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 mb-1">
                        <span className="font-medium">PM10:</span> {value.pollutants.pm10}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">NO₂:</span> {value.pollutants.no2}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Activity Metrics Section */}
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 pb-1 border-b-2 border-gray-200 dark:border-gray-700">
              Activity Metrics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(report.activityMetrics).map(([key, value]) => (
                <div 
                  key={key} 
                  className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-700 transition-transform hover:-translate-y-1 hover:shadow-md"
                >
                  <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 capitalize mb-1">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  <div className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {value.average}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Goal: {value.goal}
                  </p>
                  <div 
                    className={`
                      text-xs font-semibold uppercase py-1 px-2 rounded-full w-fit
                      ${value.status.toLowerCase() === 'good' || value.status.toLowerCase() === 'on track' || value.status.toLowerCase() === 'improving'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' 
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                      }
                    `}
                  >
                    {value.status}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recommendations Section */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 pb-1 border-b-2 border-gray-200 dark:border-gray-700">
              Recommendations
            </h2>
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border-l-4 border-indigo-500 dark:border-indigo-600">
              <ul className="space-y-2">
                {report.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block h-2 w-2 rounded-full bg-indigo-500 dark:bg-indigo-400 mt-2 mr-3"></span>
                    <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>

      <style>
        {`
        @media print {
          @page { size: portrait; margin: 1cm; }
          body * { visibility: hidden; }
          .modal-content, .modal-content * { visibility: visible; }
          .modal-content { position: absolute; left: 0; top: 0; }
          button, .close-button { display: none !important; }
        }
        `}
      </style>
    </Modal>
  );
};

export default HealthReportModal;
