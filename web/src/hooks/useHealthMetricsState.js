import { useState, useCallback } from 'react';

/**
 * Custom hook to manage health metrics state
 * @returns {Object} State and state setters for health metrics
 */
const useHealthMetricsState = () => {
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    gender: 'male',
    activityLevel: 'sedentary',
    goal: 'maintain',
  });

  const [metricsData, setMetricsData] = useState({
    bmr: 0,
    tdee: 0,
    macros: null,
    idealWeight: null,
  });

  const [showResults, setShowResults] = useState(false);
  const [unit, setUnit] = useState('imperial');
  const [isLoading, setIsLoading] = useState(true);
  const [metricsHistory, setMetricsHistory] = useState([]);

  const setFormDataMemoized = useCallback((data) => {
    setFormData((prev) => {
      const isEqual =
        JSON.stringify(prev) === JSON.stringify(typeof data === 'function' ? data(prev) : data);
      return isEqual ? prev : typeof data === 'function' ? data(prev) : data;
    });
  }, []);

  const setMetricsMemoized = useCallback((data) => {
    setMetricsData((prev) => {
      const isEqual =
        JSON.stringify(prev) === JSON.stringify(typeof data === 'function' ? data(prev) : data);
      return isEqual ? prev : typeof data === 'function' ? data(prev) : data;
    });
  }, []);

  const setShowResultsMemoized = useCallback((value) => {
    setShowResults((prev) => (prev !== value ? value : prev));
  }, []);

  const setUnitMemoized = useCallback((value) => {
    setUnit((prev) => (prev !== value ? value : prev));
  }, []);

  const setIsLoadingMemoized = useCallback((value) => {
    setIsLoading((prev) => (prev !== value ? value : prev));
  }, []);

  const setMetricsHistoryMemoized = useCallback((data) => {
    setMetricsHistory((prev) => {
      const isEqual =
        JSON.stringify(prev) === JSON.stringify(typeof data === 'function' ? data(prev) : data);
      return isEqual ? prev : typeof data === 'function' ? data(prev) : data;
    });
  }, []);

  const metrics = {
    data: metricsData,
    setMetrics: setMetricsMemoized,
  };

  return {
    formData,
    metrics,
    showResults,
    unit,
    isLoading,
    metricsHistory,
    setFormData: setFormDataMemoized,
    setUnit: setUnitMemoized,
    setShowResults: setShowResultsMemoized,
    setIsLoading: setIsLoadingMemoized,
    setMetricsHistory: setMetricsHistoryMemoized,
  };
};

export default useHealthMetricsState;
