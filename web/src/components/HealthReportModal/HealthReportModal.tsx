import { FaTemperatureHigh, FaWalking, FaTimes, FaHeart, FaLungs } from 'react-icons/fa';
import { WiHumidity, WiBarometer } from 'react-icons/wi';
import { FaDownload, FaChartLine, FaShieldAlt } from 'react-icons/fa';
import { generateHealthReport } from '../../data/health-report-data';
import Modal from '../Modal/Modal';
import { UserData } from '../../types/common.types';
import { generateEnhancedHealthReport } from '../../services/healthReportDataService';
import { generateHealthReportPDF } from '../../utils/pdfGenerator';
import { ragService } from '../../services/ragService';
import { apiMethods } from '../../utils/api';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { FaPills, FaPhoneAlt, FaStickyNote, FaMusic } from 'react-icons/fa';

interface HealthReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: UserData | any;
  isDarkMode: boolean;
}

interface VitalValue {
  average: string;
  min: string;
  max: string;
  status: string;
}

interface EnvironmentalValue {
  average: string;
  status: string;
  pollutants?: {
    pm25: string;
    pm10: string;
    no2: string;
  };
}

interface ActivityValue {
  average?: string;
  value?: number;
  status: string;
  goal: string;
}

const HealthReportModal = ({ isOpen, onClose, userData, isDarkMode }: HealthReportModalProps) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [enhancedReport, setEnhancedReport] = useState<any>(null);
  const [fallbackReport, setFallbackReport] = useState<any>(null);
  const [healthReportData, setHealthReportData] = useState<any>(null);

  // Generate enhanced report when modal opens
  useEffect(() => {
    if (isOpen) {
      const generateReport = async () => {
        setIsGenerating(true);
        try {
          const userId = localStorage.getItem('userId');

          // Try to fetch both enhanced report and health report API data
          const promises = [];

          if (userId) {
            promises.push(
              generateEnhancedHealthReport(userId).catch((error) => {
                console.warn('Enhanced report failed:', error);
                return null;
              })
            );
          }

          // Always try to get health report API data
          const deviceId = 'n0pTQbgNwb4mrDjVLs3Xzw=='; // Use same device ID as HealthReport page
          promises.push(
            apiMethods.getHealthReport(deviceId, '30').catch((error) => {
              console.warn('Health report API failed:', error);
              return null;
            })
          );

          const [enhanced, healthApiResponse] = await Promise.all(promises);

          if (enhanced) {
            setEnhancedReport(enhanced);
          }

          if (healthApiResponse) {
            // Handle different response formats
            let healthData = null;

            // Check if it's an API response wrapper
            if (typeof healthApiResponse === 'object' && 'isSuccess' in healthApiResponse) {
              if (healthApiResponse.isSuccess && healthApiResponse.data) {
                healthData = healthApiResponse.data;
              }
            } else {
              // Direct response data
              healthData = healthApiResponse;
            }

            if (healthData) {
              console.log('📊 Health Report Modal - API data received:', healthData);
              setHealthReportData(healthData);
            }
          }

          // If we don't have enhanced report but have user ID, still try enhanced
          if (!enhanced && userId) {
            try {
              const enhancedFallback = await generateEnhancedHealthReport(userId);
              setEnhancedReport(enhancedFallback);
            } catch (enhancedError) {
              console.error('Enhanced report fallback failed:', enhancedError);
            }
          }

          // Generate basic fallback report if no user ID or enhanced fails
          if (!enhanced && !userId) {
            const fallback = await generateHealthReport(userData);
            setFallbackReport(fallback);
          }
        } catch (error) {
          console.error('Error generating report:', error);
          // Generate fallback report on error
          try {
            const fallback = await generateHealthReport(userData);
            setFallbackReport(fallback);
          } catch (fallbackError) {
            console.error('Error generating fallback report:', fallbackError);
            toast.error('Failed to load health data');
          }
        } finally {
          setIsGenerating(false);
        }
      };
      generateReport();
    } else {
      // Reset state when modal closes
      setEnhancedReport(null);
      setFallbackReport(null);
      setHealthReportData(null);
      setIsGenerating(false);
    }
  }, [isOpen, userData]);

  // Use enhanced report or fallback to legacy format
  const report = enhancedReport || fallbackReport;

  const iconMapping = {
    temperature: <FaTemperatureHigh size={24} className="text-red-500" />,
    humidity: <WiHumidity size={28} className="text-blue-500" />,
    pressure: <WiBarometer size={32} className="text-purple-500" />,
    activityLevel: <FaWalking size={24} className="text-green-500" />,
    heartRate: <FaHeart size={24} className="text-red-500" />,
    oxygenLevel: <FaLungs size={24} className="text-blue-500" />,
  };

  const handlePdfDownload = async (): Promise<void> => {
    if (!report) {
      toast.error('No report data available for download');
      return;
    }

    try {
      // Use enhanced report for PDF generation if available, otherwise use fallback
      const reportForPdf = enhancedReport || report;
      const pdfBlob = await generateHealthReportPDF(reportForPdf);

      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `lifeguard_health_report_${reportForPdf.userInfo?.reportId || 'basic'}.pdf`;
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
    if (!enhancedReport) {
      toast.error('Enhanced report required for AI assistant upload');
      return;
    }

    try {
      setIsUploading(true);
      const userId = localStorage.getItem('userId');

      if (!userId) {
        toast.error('User not authenticated');
        return;
      }

      // Generate PDF with enhanced data
      const pdfBlob = await generateHealthReportPDF(enhancedReport);
      const filename = `lifeguard_health_report_${enhancedReport.userInfo?.reportId || Date.now()}.pdf`;

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

  // Show loading state while generating report
  if (isOpen && !report && isGenerating) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        maxWidth="max-w-md"
        isDarkMode={isDarkMode}
        showCloseButton={true}
        zIndex="z-[1100]"
      >
        <div className="flex flex-col items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <h3
            className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
          >
            Generating Health Report
          </h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Please wait while we compile your health data...
          </p>
        </div>
      </Modal>
    );
  }

  // Show error state if no report could be generated
  if (isOpen && !report && !isGenerating) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        maxWidth="max-w-md"
        isDarkMode={isDarkMode}
        showCloseButton={true}
        zIndex="z-[1100]"
      >
        <div className="flex flex-col items-center justify-center p-8">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              isDarkMode ? 'bg-red-500/20' : 'bg-red-100'
            }`}
          >
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3
            className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
          >
            Unable to Generate Report
          </h3>
          <p
            className={`text-sm text-center mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
          >
            We couldn&apos;t load your health data at this time. Please try again later.
          </p>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg ${
              isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
            } transition-colors`}
          >
            Close
          </button>
        </div>
      </Modal>
    );
  }

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
        {/* Modern Header with enhanced user info */}
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
                      <span className="font-mono text-sm">
                        {report.userInfo?.reportId || 'N/A'}
                      </span>
                    </span>
                    <span className="text-sm">
                      {report.userInfo?.date || new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handlePdfDownload}
                  disabled={!report}
                  className={`flex items-center space-x-2 px-4 py-2 ${
                    isDarkMode
                      ? 'bg-gray-800/60 hover:bg-gray-700/60'
                      : 'bg-white/20 hover:bg-white/30'
                  } text-white rounded-lg transition-all duration-200 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                  type="button"
                  aria-label="Download PDF"
                >
                  <FaDownload className="text-sm" />
                  <span className="text-sm font-medium">Download PDF</span>
                </button>

                <button
                  onClick={handleGenerateAndUploadToRAG}
                  disabled={isUploading || !enhancedReport}
                  className={`flex items-center space-x-2 px-4 py-2 ${
                    isDarkMode
                      ? 'bg-blue-600/60 hover:bg-blue-700/60'
                      : 'bg-blue-500/80 hover:bg-blue-600/80'
                  } text-white rounded-lg transition-all duration-200 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                  type="button"
                  aria-label="Upload to AI Assistant"
                  title={
                    !enhancedReport
                      ? 'Enhanced report required for AI upload'
                      : 'Upload to AI Assistant'
                  }
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
                  className={`w-12 h-12 ${isDarkMode ? 'bg-gray-800/80' : 'bg-white/20'} rounded-full flex items-center justify-center`}
                >
                  <span className="text-white font-bold text-lg">
                    {report.userInfo?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {report.userInfo?.name || 'LifeGuard User'}
                  </h2>
                  <p className="text-white/70">
                    {enhancedReport ? 'Comprehensive Health Summary' : 'Basic Health Summary'}
                    {enhancedReport?.userInfo?.age && ` • Age: ${enhancedReport.userInfo.age}`}
                    {enhancedReport?.userInfo?.gender && ` • ${enhancedReport.userInfo.gender}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading indicator for enhanced report generation */}
        {isGenerating && (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3">Generating comprehensive health report...</span>
          </div>
        )}

        {/* Scrollable Content with enhanced sections */}
        <div className="max-h-[60vh] overflow-y-auto">
          <div className={`p-6 space-y-8 ${isDarkMode ? 'bg-dark-bg' : 'bg-gray-50'}`}>
            {/* Enhanced sections based on available data */}
            {enhancedReport?.healthMetrics && (
              <section>
                <div className="flex items-center space-x-3 mb-6">
                  <div
                    className={`p-2 rounded-lg ${isDarkMode ? 'bg-green-500/20' : 'bg-green-100'}`}
                  >
                    <FaHeart
                      className={`text-lg ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}
                    />
                  </div>
                  <h2
                    className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                  >
                    Health Metrics
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {enhancedReport.healthMetrics.bmr && (
                    <div
                      className={`p-4 rounded-lg ${
                        isDarkMode ? 'bg-dark-bg border-gray-700' : 'bg-white border-gray-200'
                      } border`}
                    >
                      <h4 className="font-semibold">BMR</h4>
                      <p className="text-2xl font-bold text-blue-500">
                        {enhancedReport.healthMetrics.bmr}
                      </p>
                      <p className="text-sm text-gray-500">calories/day</p>
                    </div>
                  )}
                  {enhancedReport.healthMetrics.tdee && (
                    <div
                      className={`p-4 rounded-lg ${
                        isDarkMode ? 'bg-dark-bg border-gray-700' : 'bg-white border-gray-200'
                      } border`}
                    >
                      <h4 className="font-semibold">TDEE</h4>
                      <p className="text-2xl font-bold text-green-500">
                        {enhancedReport.healthMetrics.tdee}
                      </p>
                      <p className="text-sm text-gray-500">calories/day</p>
                    </div>
                  )}
                  {enhancedReport.healthMetrics.bmi && (
                    <div
                      className={`p-4 rounded-lg ${
                        isDarkMode ? 'bg-dark-bg border-gray-700' : 'bg-white border-gray-200'
                      } border`}
                    >
                      <h4 className="font-semibold">BMI</h4>
                      <p className="text-2xl font-bold text-purple-500">
                        {enhancedReport.healthMetrics.bmi.toFixed(1)}
                      </p>
                      <p className="text-sm text-gray-500">kg/m²</p>
                    </div>
                  )}
                  {enhancedReport.healthMetrics.activityLevel && (
                    <div
                      className={`p-4 rounded-lg ${
                        isDarkMode ? 'bg-dark-bg border-gray-700' : 'bg-white border-gray-200'
                      } border`}
                    >
                      <h4 className="font-semibold">Activity Level</h4>
                      <p className="text-lg font-bold text-orange-500">
                        {enhancedReport.healthMetrics.activityLevel}
                      </p>
                      <p className="text-sm text-gray-500">Current level</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Health Report API Data Section */}
            {healthReportData && (
              <section>
                <div className="flex items-center space-x-3 mb-6">
                  <div
                    className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}
                  >
                    <FaChartLine
                      className={`text-lg ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}
                    />
                  </div>
                  <h2
                    className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                  >
                    Real-Time Health Metrics (Last 30 Days)
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div
                    className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-105 ${
                      isDarkMode
                        ? 'bg-dark-bg border-gray-700 hover:border-gray-600'
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`p-3 rounded-xl ${isDarkMode ? 'bg-red-500/20' : 'bg-red-100'}`}
                      >
                        <FaTemperatureHigh
                          className={`text-xl ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}
                        />
                      </div>
                      <span
                        className={`text-sm font-medium ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}
                      >
                        From Arduino
                      </span>
                    </div>
                    <h3
                      className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                    >
                      Average Temperature
                    </h3>
                    <p
                      className={`text-3xl font-bold ${isDarkMode ? 'text-red-400' : 'text-red-600'} mt-2`}
                    >
                      {healthReportData.avgAmbientTemp
                        ? `${healthReportData.avgAmbientTemp.toFixed(1)}°C`
                        : 'N/A'}
                    </p>
                  </div>

                  <div
                    className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-105 ${
                      isDarkMode
                        ? 'bg-dark-bg border-gray-700 hover:border-gray-600'
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`p-3 rounded-xl ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}
                      >
                        <WiHumidity
                          className={`text-xl ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}
                        />
                      </div>
                      <span
                        className={`text-sm font-medium ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}
                      >
                        From Arduino
                      </span>
                    </div>
                    <h3
                      className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                    >
                      Average Humidity
                    </h3>
                    <p
                      className={`text-3xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} mt-2`}
                    >
                      {healthReportData.avgHumidity
                        ? `${healthReportData.avgHumidity.toFixed(1)}%`
                        : 'N/A'}
                    </p>
                  </div>

                  <div
                    className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-105 ${
                      isDarkMode
                        ? 'bg-dark-bg border-gray-700 hover:border-gray-600'
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`p-3 rounded-xl ${isDarkMode ? 'bg-green-500/20' : 'bg-green-100'}`}
                      >
                        <FaWalking
                          className={`text-xl ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}
                        />
                      </div>
                      <span
                        className={`text-sm font-medium ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}
                      >
                        From Arduino
                      </span>
                    </div>
                    <h3
                      className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                    >
                      Total Steps
                    </h3>
                    <p
                      className={`text-3xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'} mt-2`}
                    >
                      {healthReportData.totalSteps
                        ? healthReportData.totalSteps.toLocaleString()
                        : 'N/A'}
                    </p>
                  </div>

                  {healthReportData.avgAirQualityIndex && (
                    <div
                      className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-105 ${
                        isDarkMode
                          ? 'bg-dark-bg border-gray-700 hover:border-gray-600'
                          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`p-3 rounded-xl ${isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'}`}
                        >
                          <WiBarometer
                            className={`text-xl ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}
                          />
                        </div>
                        <span
                          className={`text-sm font-medium ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}
                        >
                          From Arduino
                        </span>
                      </div>
                      <h3
                        className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                      >
                        Air Quality Index
                      </h3>
                      <p
                        className={`text-3xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'} mt-2`}
                      >
                        {healthReportData.avgAirQualityIndex.toFixed(0)} AQI
                      </p>
                    </div>
                  )}

                  {healthReportData.avgDailySteps && (
                    <div
                      className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-105 ${
                        isDarkMode
                          ? 'bg-dark-bg border-gray-700 hover:border-gray-600'
                          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`p-3 rounded-xl ${isDarkMode ? 'bg-yellow-500/20' : 'bg-yellow-100'}`}
                        >
                          <FaChartLine
                            className={`text-xl ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}
                          />
                        </div>
                        <span
                          className={`text-sm font-medium ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}
                        >
                          From Arduino
                        </span>
                      </div>
                      <h3
                        className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                      >
                        Daily Average Steps
                      </h3>
                      <p
                        className={`text-3xl font-bold ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'} mt-2`}
                      >
                        {healthReportData.avgDailySteps.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )}

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
                {Object.entries(report.vitals as Record<string, VitalValue>).map(([key, value]) => (
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

            {/* Activity Metrics - Enhanced with real data */}
            {(enhancedReport?.activityMetrics || report.activityMetrics) && (
              <section>
                <div className="flex items-center space-x-3 mb-6">
                  <div
                    className={`p-2 rounded-lg ${isDarkMode ? 'bg-green-500/20' : 'bg-green-100'}`}
                  >
                    <FaWalking
                      className={`text-lg ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}
                    />
                  </div>
                  <h2
                    className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                  >
                    Activity Metrics
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(
                    (enhancedReport?.activityMetrics || report.activityMetrics) as Record<
                      string,
                      ActivityValue
                    >
                  ).map(([key, value]) => (
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
                            value.status.toLowerCase() === 'excellent' ||
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
                        {value.average || value.value}
                      </div>

                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Goal: {value.goal}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Current Medications Section */}
            {enhancedReport?.medications && enhancedReport.medications.length > 0 && (
              <section>
                <div className="flex items-center space-x-3 mb-6">
                  <div
                    className={`p-2 rounded-lg ${isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'}`}
                  >
                    <FaPills
                      className={`text-lg ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}
                    />
                  </div>
                  <h2
                    className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                  >
                    Current Medications
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {enhancedReport.medications.map((med: any, index: number) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg ${
                        isDarkMode ? 'bg-dark-bg border-gray-700' : 'bg-white border-gray-200'
                      } border transition-all duration-300 hover:scale-105`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4
                          className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                        >
                          {med.name}
                        </h4>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs ${
                            med.active
                              ? isDarkMode
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-green-100 text-green-800'
                              : isDarkMode
                                ? 'bg-gray-500/20 text-gray-400'
                                : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {med.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p
                        className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}
                      >
                        <strong>Dosage:</strong> {med.dosage}
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <strong>Frequency:</strong> {med.frequency}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Emergency Contacts Section */}
            {enhancedReport?.emergencyContacts && enhancedReport.emergencyContacts.length > 0 && (
              <section>
                <div className="flex items-center space-x-3 mb-6">
                  <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-red-500/20' : 'bg-red-100'}`}>
                    <FaPhoneAlt
                      className={`text-lg ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}
                    />
                  </div>
                  <h2
                    className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                  >
                    Emergency Contacts
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {enhancedReport.emergencyContacts.map((contact: any, index: number) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg ${
                        isDarkMode ? 'bg-dark-bg border-gray-700' : 'bg-white border-gray-200'
                      } border transition-all duration-300 hover:scale-105`}
                    >
                      <h4
                        className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}
                      >
                        {contact.name}
                      </h4>
                      <p
                        className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}
                      >
                        <strong>Relationship:</strong> {contact.relationship}
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <strong>Phone:</strong> {contact.phone}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Recent Health Notes Section */}
            {enhancedReport?.recentNotes && enhancedReport.recentNotes.length > 0 && (
              <section>
                <div className="flex items-center space-x-3 mb-6">
                  <div
                    className={`p-2 rounded-lg ${isDarkMode ? 'bg-yellow-500/20' : 'bg-yellow-100'}`}
                  >
                    <FaStickyNote
                      className={`text-lg ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}
                    />
                  </div>
                  <h2
                    className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                  >
                    Recent Health Notes
                  </h2>
                </div>

                <div className="space-y-3">
                  {enhancedReport.recentNotes.slice(0, 5).map((note: any, index: number) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg ${
                        isDarkMode ? 'bg-dark-bg border-gray-700' : 'bg-white border-gray-200'
                      } border transition-all duration-300 hover:scale-105`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <p
                          className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} flex-1`}
                        >
                          {note.content}
                        </p>
                        <span
                          className={`ml-3 inline-block px-2 py-1 rounded-full text-xs ${
                            note.isCompleted
                              ? isDarkMode
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-green-100 text-green-800'
                              : isDarkMode
                                ? 'bg-orange-500/20 text-orange-400'
                                : 'bg-orange-100 text-orange-800'
                          }`}
                        >
                          {note.isCompleted ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        {note.date}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Wellness Data Section */}
            {enhancedReport?.wellnessData &&
              enhancedReport.wellnessData.favoriteSounds.length > 0 && (
                <section>
                  <div className="flex items-center space-x-3 mb-6">
                    <div
                      className={`p-2 rounded-lg ${isDarkMode ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}
                    >
                      <FaMusic
                        className={`text-lg ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}
                      />
                    </div>
                    <h2
                      className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                    >
                      Wellness Preferences
                    </h2>
                  </div>

                  <div
                    className={`p-4 rounded-lg ${
                      isDarkMode ? 'bg-dark-bg border-gray-700' : 'bg-white border-gray-200'
                    } border`}
                  >
                    <h4
                      className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                    >
                      Favorite Wellness Sounds
                    </h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {enhancedReport.wellnessData.favoriteSounds.map(
                        (sound: any, index: number) => (
                          <span
                            key={index}
                            className={`px-3 py-1 rounded-full text-sm ${
                              isDarkMode
                                ? 'bg-indigo-500/20 text-indigo-400'
                                : 'bg-indigo-100 text-indigo-800'
                            }`}
                          >
                            {sound.name}
                          </span>
                        )
                      )}
                    </div>
                    <h5
                      className={`font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                      Preferred Categories:
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {enhancedReport.wellnessData.preferredCategories.map(
                        (category: string, index: number) => (
                          <span
                            key={index}
                            className={`px-2 py-1 rounded-full text-xs ${
                              isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {category}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </section>
              )}

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
                {Object.entries(
                  report.environmentalMetrics as Record<string, EnvironmentalValue>
                ).map(([key, value]) => (
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

                    {key === 'airQuality' && value.pollutants && (
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
                  {report.recommendations.map((rec: string, index: number) => (
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
