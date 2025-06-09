import React, { useEffect, useState, useCallback } from 'react';
import { FaCalculator, FaExclamationCircle, FaRedo } from 'react-icons/fa';
import Spinner from '../../components/Spinner/Spinner';

import useHealthMetricsState from '../../hooks/useHealthMetricsState';
import useHealthMetricsData from '../../hooks/useHealthMetricsData';
import { MetricsData } from '../../types/healthMetrics.types';

import PageHeader from '../../components/HealthMetrics/PageHeader';
import MetricsForm from '../../components/HealthMetrics/MetricsForm';
import ResultsSection from '../../components/HealthMetrics/ResultsSection';
import MetricsHistory from '../../components/HealthMetrics/MetricsHistory';

import './HealthMetrics.css';

interface HealthMetricsProps {
  isDarkMode: boolean;
}

const HealthMetrics = ({ isDarkMode }: HealthMetricsProps) => {
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

  const [dataFetchFailed, setDataFetchFailed] = useState<boolean>(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState<boolean>(false);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);

  const { fetchLatestMetrics, fetchMetricsHistory, handleInputChange, calculateMetrics } =
    useHealthMetricsData({
      formData,
      setFormData,
      setMetrics: ((data: MetricsData | ((prev: MetricsData) => MetricsData)) => {
        if (typeof data === 'function') {
          metrics.setMetrics((prevState) => {
            const newState = data(prevState as unknown as MetricsData);
            return newState as unknown as typeof prevState;
          });
        } else {
          metrics.setMetrics(data as unknown as Parameters<typeof metrics.setMetrics>[0]);
        }
      }) as any,
      setShowResults: ((value: boolean | ((prev: boolean) => boolean)) => {
        setShowResults(value as any);
      }) as any,
      unit,
      setMetricsHistory: ((data: any) => {
        setMetricsHistory(data);
      }) as any,
      setIsLoading: ((value: boolean | ((prev: boolean) => boolean)) => {
        setIsLoading(value as any);
      }) as any,
    });

  const loadData = useCallback(async (): Promise<void> => {
    if (isLoading || isRetrying) return;

    setIsLoading(true);
    setIsRetrying(true);
    setDataFetchFailed(false);

    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
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
  }, [loadData, initialLoadComplete, setIsLoading]);

  const handleRetry = (): void => {
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
                      <Spinner size="small" /> <span className="ml-2">Retrying...</span>
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
              isLoading={isLoading}
            >
              <button
                className={`calculate-btn ${isLoading ? 'loading' : ''}`}
                onClick={calculateMetrics}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner size="small" /> <span className="ml-2">Calculating...</span>
                  </>
                ) : (
                  <>
                    <FaCalculator /> <span className="ml-2">Calculate Metrics</span>
                  </>
                )}
              </button>
            </MetricsForm>

            {showResults && metrics.data && (
              <ResultsSection
                metrics={{
                  bmr: metrics.data.bmr,
                  tdee: metrics.data.tdee,
                  macros: metrics.data.macros || { calories: 0, protein: 0, carbs: 0, fat: 0 },
                  idealWeight: metrics.data.idealWeight || { min: 0, max: 0 },
                }}
                formData={formData}
                unit={unit}
                isDarkMode={isDarkMode}
              />
            )}

            {metricsHistory?.length > 0 && (
              <MetricsHistory history={metricsHistory} isDarkMode={isDarkMode} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HealthMetrics;
