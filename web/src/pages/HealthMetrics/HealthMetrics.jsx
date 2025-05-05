import { useEffect, useState, useCallback } from 'react';
import { FaCalculator, FaExclamationCircle, FaRedo } from 'react-icons/fa';
import Spinner from '../../components/Spinner/Spinner';

import useHealthMetricsState from '../../hooks/useHealthMetricsState';
import useHealthMetricsData from '../../hooks/useHealthMetricsData';

import PageHeader from '../../components/HealthMetrics/PageHeader';
import MetricsForm from '../../components/HealthMetrics/MetricsForm';
import ResultsSection from '../../components/HealthMetrics/ResultsSection';
import MetricsHistory from '../../components/HealthMetrics/MetricsHistory';

import './HealthMetrics.css';

function HealthMetrics({ isDarkMode }) {
  const {
    formData,
    metrics,
    showResults,
    unit,
    isLoading,
    metricsHistory,
    setFormData,
    setUnit,
    setShowResults,
    setIsLoading,
    setMetricsHistory,
  } = useHealthMetricsState();

  const [dataFetchFailed, setDataFetchFailed] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const { fetchLatestMetrics, fetchMetricsHistory, handleInputChange, calculateMetrics } =
    useHealthMetricsData({
      formData,
      setFormData,
      setMetrics: metrics.setMetrics,
      setShowResults,
      unit,
      setMetricsHistory,
      setIsLoading,
    });

  const loadData = useCallback(async () => {
    if (isLoading || isRetrying) return;

    setIsLoading(true);
    setIsRetrying(true);
    setDataFetchFailed(false);

    try {
      const timeoutPromise = new Promise((_, reject) => {
        const timeoutId = setTimeout(() => {
          clearTimeout(timeoutId);
          reject(new Error('Request timeout'));
        }, 10000);
      });

      await Promise.race([
        Promise.all([fetchLatestMetrics(), fetchMetricsHistory()]),
        timeoutPromise,
      ]);

      setDataFetchFailed(false);
    } catch (error) {
      console.error('Error loading health metrics data:', error);
      setDataFetchFailed(true);
      setFormData({
        age: '',
        weight: '',
        height: '',
        gender: 'male',
        activityLevel: 'sedentary',
        goal: 'maintain',
      });
    } finally {
      setIsLoading(false);
      setIsRetrying(false);
      setInitialLoadComplete(true);
    }
  }, [fetchLatestMetrics, fetchMetricsHistory, isLoading, isRetrying, setFormData, setIsLoading]);

  useEffect(() => {
    if (!initialLoadComplete) {
      loadData();
    }

    return () => {
      setIsLoading(false);
    };
  }, [loadData, initialLoadComplete]);

  const handleRetry = () => {
    loadData();
  };

  return (
    <div className={`health-metrics-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="health-metrics-content">
        <PageHeader unit={unit} setUnit={setUnit} />

        {isLoading && !initialLoadComplete ? (
          <div className="metrics-loading">
            <Spinner size="large" />
            <p>Loading your health metrics...</p>
          </div>
        ) : (
          <>
            {dataFetchFailed && (
              <div
                className={`p-4 mb-4 rounded-lg ${
                  isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700'
                }`}
              >
                <div className="flex items-center mb-2">
                  <FaExclamationCircle className="mr-2" />
                  <p>There was an issue loading your health metrics data.</p>
                </div>
                <button
                  onClick={handleRetry}
                  disabled={isRetrying}
                  className={`px-4 py-2 rounded-md ${
                    isDarkMode ? 'bg-red-700 hover:bg-red-600' : 'bg-red-500 hover:bg-red-600'
                  } text-white flex items-center`}
                >
                  {isRetrying ? (
                    <>
                      <Spinner size="small" className="mr-2" /> Retrying...
                    </>
                  ) : (
                    <>
                      <FaRedo className="mr-2" /> Try Again
                    </>
                  )}
                </button>
              </div>
            )}

            <MetricsForm
              formData={formData}
              handleInputChange={handleInputChange}
              unit={unit}
              isDarkMode={isDarkMode}
              calculateMetrics={calculateMetrics}
              isLoading={isLoading}
            >
              <button
                className={`calculate-btn ${isLoading ? 'loading' : ''}`}
                onClick={calculateMetrics}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner size="small" />
                    <span>Calculating...</span>
                  </>
                ) : (
                  <>
                    <FaCalculator />
                    <span>Calculate Metrics</span>
                  </>
                )}
              </button>
            </MetricsForm>

            {showResults && (
              <ResultsSection
                metrics={metrics.data}
                formData={formData}
                unit={unit}
                isDarkMode={isDarkMode}
              />
            )}

            {metricsHistory?.length > 0 && (
              <MetricsHistory history={metricsHistory} isDarkMode={isDarkMode} unit={unit} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default HealthMetrics;
