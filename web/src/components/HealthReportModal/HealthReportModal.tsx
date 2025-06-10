import { FaTemperatureHigh, FaWalking, FaTimes, FaHeart, FaLungs } from 'react-icons/fa';
import { WiHumidity, WiBarometer } from 'react-icons/wi';
import { FaDownload, FaChartLine, FaShieldAlt } from 'react-icons/fa';
import { generateHealthReport, HealthReportData } from '../../data/health-report-data';
import Modal from '../Modal/Modal';
import { UserData } from '../../types/common.types';
import { generateHealthReportPDF } from '../../utils/pdfGenerator';
import { ragService } from '../../services/ragService';
import { toast } from 'react-toastify';
import { useState } from 'react';

interface HealthReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: UserData | any;
  isDarkMode: boolean;
}

const HealthReportModal = ({ isOpen, onClose, userData, isDarkMode }: HealthReportModalProps) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const report: HealthReportData | null = isOpen ? generateHealthReport(userData) : null;

  const iconMapping = {
    temperature: <FaTemperatureHigh size={24} className="text-red-500" />,
    humidity: <WiHumidity size={28} className="text-blue-500" />,
    pressure: <WiBarometer size={32} className="text-purple-500" />,
    activityLevel: <FaWalking size={24} className="text-green-500" />,
    heartRate: <FaHeart size={24} className="text-red-500" />,
    oxygenLevel: <FaLungs size={24} className="text-blue-500" />,
  };

  const handlePdfDownload = async (): Promise<void> => {
    if (!report) return;

    try {
      const pdfBlob = await generateHealthReportPDF(report);

      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `lifeguard_health_report_${report.userInfo.reportId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  const handleGenerateAndUploadToRAG = async (): Promise<void> => {
    if (!report) return;

    try {
      setIsUploading(true);
      const userId = localStorage.getItem('userId');

      if (!userId) {
        toast.error('User not authenticated');
        return;
      }

      // Generate PDF
      const pdfBlob = await generateHealthReportPDF(report);
      const filename = `lifeguard_health_report_${report.userInfo.reportId}.pdf`;

      // Upload to RAG system
      await ragService.uploadPDF(userId, pdfBlob, filename);

      toast.success(
        'Health report uploaded to AI assistant! You can now ask questions about your health data.'
      );
    } catch (error) {
      console.error('Error uploading to RAG:', error);
      toast.error('Failed to upload report to AI assistant');
    } finally {
      setIsUploading(false);
    }
  };

  if (!report) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-6xl"
      isDarkMode={isDarkMode}
      showCloseButton={false}
      zIndex="z-[1100]"
    >
      <div
        className={`w-full max-w-6xl mx-auto max-h-[90vh] overflow-hidden rounded-2xl ${
          isDarkMode ? 'bg-dark-bg' : 'bg-white'
        }`}
      >
        {/* Modern Header with Gradient */}
        <div
          className={`relative overflow-hidden ${
            isDarkMode
              ? 'bg-gradient-to-br from-dark-bg via-gray-800 to-gray-700'
              : 'bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700'
          }`}
        >
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="relative p-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-4">
                <div
                  className={`p-3 rounded-xl ${
                    isDarkMode ? 'bg-gray-800/70' : 'bg-white/20'
                  } backdrop-blur-sm`}
                >
                  <FaShieldAlt className="text-2xl text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1">Health Analytics Report</h1>
                  <div className="flex items-center space-x-4 text-white/80">
                    <span className="flex items-center space-x-1">
                      <span className="text-sm">ID:</span>
                      <span className="font-mono text-sm">{report.userInfo.reportId}</span>
                    </span>
                    <span className="text-sm">{report.userInfo.date}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handlePdfDownload}
                  className={`flex items-center space-x-2 px-4 py-2 ${
                    isDarkMode
                      ? 'bg-gray-800/60 hover:bg-gray-700/60'
                      : 'bg-white/20 hover:bg-white/30'
                  } text-white rounded-lg transition-all duration-200 backdrop-blur-sm`}
                  type="button"
                  aria-label="Download PDF"
                >
                  <FaDownload className="text-sm" />
                  <span className="text-sm font-medium">Download PDF</span>
                </button>

                <button
                  onClick={handleGenerateAndUploadToRAG}
                  disabled={isUploading}
                  className={`flex items-center space-x-2 px-4 py-2 ${
                    isDarkMode
                      ? 'bg-blue-600/60 hover:bg-blue-700/60'
                      : 'bg-blue-500/80 hover:bg-blue-600/80'
                  } text-white rounded-lg transition-all duration-200 backdrop-blur-sm disabled:opacity-50`}
                  type="button"
                  aria-label="Upload to AI Assistant"
                >
                  <FaChartLine className="text-sm" />
                  <span className="text-sm font-medium">
                    {isUploading ? 'Uploading...' : 'Upload to AI Assistant'}
                  </span>
                </button>

                <button
                  onClick={onClose}
                  className={`p-2 ${
                    isDarkMode
                      ? 'bg-gray-800/60 hover:bg-gray-700/60'
                      : 'bg-white/20 hover:bg-white/30'
                  } text-white rounded-lg transition-all duration-200 backdrop-blur-sm`}
                  type="button"
                  aria-label="Close report"
                >
                  <FaTimes className="text-lg" />
                </button>
              </div>
            </div>

            <div
              className={`mt-4 p-4 ${
                isDarkMode ? 'bg-gray-800/60' : 'bg-white/10'
              } rounded-xl backdrop-blur-sm`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-12 h-12 ${
                    isDarkMode ? 'bg-gray-800/80' : 'bg-white/20'
                  } rounded-full flex items-center justify-center`}
                >
                  <span className="text-white font-bold text-lg">
                    {report.userInfo.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">{report.userInfo.name}</h2>
                  <p className="text-white/70">Patient Health Summary</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="max-h-[60vh] overflow-y-auto">
          <div className={`p-6 space-y-8 ${isDarkMode ? 'bg-dark-bg' : 'bg-gray-50'}`}>
            {/* Vital Statistics - Enhanced Grid */}
            <section>
              <div className="flex items-center space-x-3 mb-6">
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-red-500/20' : 'bg-red-100'}`}>
                  <FaHeart className={`text-lg ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
                </div>
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Vital Statistics
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {Object.entries(report.vitals).map(([key, value]) => (
                  <div
                    key={key}
                    className={`relative p-6 rounded-2xl border transition-all duration-300 hover:scale-105 ${
                      isDarkMode
                        ? 'bg-dark-bg border-gray-700 hover:border-gray-600'
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`p-3 rounded-xl ${
                          value.status.toLowerCase() === 'normal'
                            ? isDarkMode
                              ? 'bg-green-500/20'
                              : 'bg-green-100'
                            : value.status.toLowerCase() === 'low'
                              ? isDarkMode
                                ? 'bg-red-500/20'
                                : 'bg-red-100'
                              : isDarkMode
                                ? 'bg-yellow-500/20'
                                : 'bg-yellow-100'
                        }`}
                      >
                        {iconMapping[key as keyof typeof iconMapping] || <FaChartLine />}
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          value.status.toLowerCase() === 'normal'
                            ? isDarkMode
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-green-100 text-green-800'
                            : value.status.toLowerCase() === 'low'
                              ? isDarkMode
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-red-100 text-red-800'
                              : isDarkMode
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {value.status}
                      </div>
                    </div>

                    <h3
                      className={`text-lg font-semibold mb-2 ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-700'
                      }`}
                    >
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                    </h3>

                    <div
                      className={`text-3xl font-bold mb-3 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {value.average}
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Min: {value.min}
                      </span>
                      <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Max: {value.max}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Environmental Metrics - Modern Cards */}
            <section>
              <div className="flex items-center space-x-3 mb-6">
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                  <WiBarometer
                    className={`text-xl ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}
                  />
                </div>
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Environmental Metrics
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(report.environmentalMetrics).map(([key, value]) => (
                  <div
                    key={key}
                    className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-105 ${
                      isDarkMode
                        ? 'bg-dark-bg border-gray-700 hover:border-gray-600'
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3
                        className={`text-lg font-semibold ${
                          isDarkMode ? 'text-gray-200' : 'text-gray-700'
                        }`}
                      >
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                      </h3>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          value.status.toLowerCase() === 'normal' ||
                          value.status.toLowerCase() === 'optimal'
                            ? isDarkMode
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-green-100 text-green-800'
                            : value.status.toLowerCase() === 'moderate'
                              ? isDarkMode
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-yellow-100 text-yellow-800'
                              : isDarkMode
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {value.status}
                      </div>
                    </div>

                    <div
                      className={`text-2xl font-bold mb-4 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {value.average}
                    </div>

                    {key === 'airQuality' && 'pollutants' in value && (
                      <div
                        className={`pt-4 border-t space-y-2 ${
                          isDarkMode ? 'border-gray-700' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between">
                          <span
                            className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                          >
                            PM2.5:
                          </span>
                          <span
                            className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                          >
                            {value.pollutants.pm25}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span
                            className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                          >
                            PM10:
                          </span>
                          <span
                            className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                          >
                            {value.pollutants.pm10}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span
                            className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                          >
                            NO₂:
                          </span>
                          <span
                            className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                          >
                            {value.pollutants.no2}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Activity Metrics */}
            <section>
              <div className="flex items-center space-x-3 mb-6">
                <div
                  className={`p-2 rounded-lg ${isDarkMode ? 'bg-green-500/20' : 'bg-green-100'}`}
                >
                  <FaWalking
                    className={`text-lg ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}
                  />
                </div>
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Activity Metrics
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(report.activityMetrics).map(([key, value]) => (
                  <div
                    key={key}
                    className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-105 ${
                      isDarkMode
                        ? 'bg-dark-bg border-gray-700 hover:border-gray-600'
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3
                        className={`text-lg font-semibold ${
                          isDarkMode ? 'text-gray-200' : 'text-gray-700'
                        }`}
                      >
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                      </h3>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          value.status.toLowerCase() === 'good' ||
                          value.status.toLowerCase() === 'on track' ||
                          value.status.toLowerCase() === 'improving'
                            ? isDarkMode
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-green-100 text-green-800'
                            : isDarkMode
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {value.status}
                      </div>
                    </div>

                    <div
                      className={`text-2xl font-bold mb-2 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {value.average}
                    </div>

                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Goal: {value.goal}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Recommendations - Enhanced */}
            <section>
              <div className="flex items-center space-x-3 mb-6">
                <div
                  className={`p-2 rounded-lg ${isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'}`}
                >
                  <FaChartLine
                    className={`text-lg ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}
                  />
                </div>
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Health Recommendations
                </h2>
              </div>

              <div
                className={`p-6 rounded-2xl border-l-4 ${
                  isDarkMode
                    ? 'bg-dark-bg border-purple-500'
                    : 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-500'
                }`}
              >
                <div className="space-y-4">
                  {report.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isDarkMode
                            ? 'bg-purple-500/20 text-purple-400'
                            : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <p
                        className={`text-sm leading-relaxed ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        {rec}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <style>
        {`
        @media print {
          @page { size: portrait; margin: 1cm; }
          body * { visibility: hidden; }
          .modal-content, .modal-content * { visibility: visible; }
          .modal-content { position: absolute; left: 0; top: 0; }
          button { display: none !important; }
        }
        `}
      </style>
    </Modal>
  );
};

export default HealthReportModal;
