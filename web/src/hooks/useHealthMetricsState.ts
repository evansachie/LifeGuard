import { useState, useCallback } from 'react';

interface FormData {
  age: string | number;
  weight: string | number;
  height: string | number;
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
  goal: 'lose' | 'maintain' | 'gain';
}

interface Macros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface IdealWeight {
  min: number;
  max: number;
}

interface MetricsData {
  bmr: number;
  tdee: number;
  macros: Macros | null;
  idealWeight: IdealWeight | null;
}

interface MetricHistory {
  id: string;
  Age: number;
  Weight: number;
  Height: number;
  Gender: string;
  ActivityLevel: string;
  Goal: string;
  BMR: number;
  TDEE: number;
  CreatedAt: string;
  [key: string]: any;
}

interface HealthMetricsState {
  formData: FormData;
  metrics: {
    data: MetricsData;
    setMetrics: (data: MetricsData | ((prev: MetricsData) => MetricsData)) => void;
  };
  showResults: boolean;
  unit: 'imperial' | 'metric';
  isLoading: boolean;
  metricsHistory: MetricHistory[];
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void;
  setUnit: (value: 'imperial' | 'metric') => void;
  setShowResults: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setMetricsHistory: (data: MetricHistory[] | ((prev: MetricHistory[]) => MetricHistory[])) => void;
}

/**
 * Custom hook to manage health metrics state
 * @returns State and state setters for health metrics
 */
const useHealthMetricsState = (): HealthMetricsState => {
  const [formData, setFormData] = useState<FormData>({
    age: '',
    weight: '',
    height: '',
    gender: 'male',
    activityLevel: 'sedentary',
    goal: 'maintain',
  });

  const [metricsData, setMetricsData] = useState<MetricsData>({
    bmr: 0,
    tdee: 0,
    macros: null,
    idealWeight: null,
  });

  const [showResults, setShowResults] = useState<boolean>(false);
  const [unit, setUnit] = useState<'imperial' | 'metric'>('imperial');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [metricsHistory, setMetricsHistory] = useState<MetricHistory[]>([]);

  const setFormDataMemoized = useCallback((data: FormData | ((prev: FormData) => FormData)) => {
    setFormData((prev) => {
      const isEqual =
        JSON.stringify(prev) === JSON.stringify(typeof data === 'function' ? data(prev) : data);
      return isEqual ? prev : typeof data === 'function' ? data(prev) : data;
    });
  }, []);

  const setMetricsMemoized = useCallback((data: MetricsData | ((prev: MetricsData) => MetricsData)) => {
    setMetricsData((prev) => {
      const isEqual =
        JSON.stringify(prev) === JSON.stringify(typeof data === 'function' ? data(prev) : data);
      return isEqual ? prev : typeof data === 'function' ? data(prev) : data;
    });
  }, []);

  const setShowResultsMemoized = useCallback((value: boolean) => {
    setShowResults((prev) => (prev !== value ? value : prev));
  }, []);

  const setUnitMemoized = useCallback((value: 'imperial' | 'metric') => {
    setUnit((prev) => (prev !== value ? value : prev));
  }, []);

  const setIsLoadingMemoized = useCallback((value: boolean) => {
    setIsLoading((prev) => (prev !== value ? value : prev));
  }, []);

  const setMetricsHistoryMemoized = useCallback((data: MetricHistory[] | ((prev: MetricHistory[]) => MetricHistory[])) => {
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
