import React from 'react';
import { FaCalculator } from 'react-icons/fa';
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

  React.useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchLatestMetrics(), fetchMetricsHistory()]);
      setIsLoading(false);
    };

    loadData();
  }, []);

  return (
    <div className={`health-metrics-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="health-metrics-content">
        <PageHeader unit={unit} setUnit={setUnit} />

        {isLoading ? (
          <div className="metrics-loading">
            <Spinner size="large" />
            <p>Loading your health metrics...</p>
          </div>
        ) : (
          <>
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

            <MetricsHistory history={metricsHistory} isDarkMode={isDarkMode} unit={unit} />
          </>
        )}
      </div>
    </div>
  );
}

export default HealthMetrics;
