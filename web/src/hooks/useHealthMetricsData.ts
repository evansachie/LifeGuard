import { toast } from 'react-toastify';
import { fetchWithAuth } from '../utils/api';
import {
  calculateBMR,
  calculateTDEE,
  calculateMacros,
  calculateIdealWeight,
} from '../utils/healthMetricsUtils';
import { API_ENDPOINTS } from '../utils/api';
import { Dispatch, SetStateAction } from 'react';

interface FormData {
  age: string | number;
  weight: string | number;
  height: string | number;
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
  goal: 'lose' | 'maintain' | 'gain';
}

interface Metrics {
  bmr: number;
  tdee: number;
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  idealWeight: {
    min: number;
    max: number;
  };
}

interface MetricHistory {
  id: string;
  Age: number;
  Weight: number;
  Height: number;
  Gender: 'male' | 'female';
  ActivityLevel: string;
  Goal: string;
  BMR: number;
  TDEE: number;
  CreatedAt: string;
  [key: string]: any;
}

interface UseHealthMetricsDataParams {
  formData: FormData;
  setFormData: Dispatch<SetStateAction<FormData>>;
  setMetrics: Dispatch<SetStateAction<Metrics>>;
  setShowResults: Dispatch<SetStateAction<boolean>>;
  unit: 'imperial' | 'metric';
  setMetricsHistory: Dispatch<SetStateAction<MetricHistory[]>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

interface UseHealthMetricsDataReturn {
  fetchLatestMetrics: () => Promise<boolean>;
  fetchMetricsHistory: () => Promise<boolean>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  calculateMetrics: () => Promise<void>;
}

/**
 * Custom hook to handle health metrics data operations
 * @param params - Parameters object containing state setters and form data
 * @returns Data manipulation functions
 */
const useHealthMetricsData = ({
  formData,
  setFormData,
  setMetrics,
  setShowResults,
  unit,
  setMetricsHistory,
  setIsLoading,
}: UseHealthMetricsDataParams): UseHealthMetricsDataReturn => {
  /**
   * Fetch the latest metrics from API
   */
  const fetchLatestMetrics = async (): Promise<boolean> => {
    try {
      const response = await fetchWithAuth<MetricHistory>(API_ENDPOINTS.HEALTH_METRICS.LATEST);
      if (response) {
        setFormData((prev) => ({
          ...prev,
          age: response.Age || '',
          weight: response.Weight || '',
          height: response.Height || '',
          gender: (response.Gender as 'male' | 'female') || 'male',
          activityLevel: (response.ActivityLevel as FormData['activityLevel']) || 'sedentary',
          goal: (response.Goal as FormData['goal']) || 'maintain',
        }));

        if (response.BMR && response.TDEE) {
          setMetrics({
            bmr: response.BMR,
            tdee: response.TDEE,
            macros: calculateMacros(response.TDEE, response.Goal as FormData['goal']),
            idealWeight: calculateIdealWeight(
              response.Height,
              response.Gender as 'male' | 'female'
            ),
          });
          setShowResults(true);
        }
      }
      return true;
    } catch (error) {
      console.error('Error fetching metrics:', error);
      return false;
    }
  };

  /**
   * Fetch metrics history from API
   */
  const fetchMetricsHistory = async (): Promise<boolean> => {
    try {
      const response = await fetchWithAuth<MetricHistory[]>(API_ENDPOINTS.HEALTH_METRICS.HISTORY);
      if (Array.isArray(response)) {
        setMetricsHistory(response);
      } else {
        setMetricsHistory([]);
      }
      return true;
    } catch (error) {
      console.error('Error fetching metrics history:', error);
      setMetricsHistory([]);
      return false;
    }
  };

  /**
   * Handle form input changes
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setShowResults(false);
  };

  /**
   * Calculate and save metrics
   */
  const calculateMetrics = async (): Promise<void> => {
    if (!formData.age || !formData.weight || !formData.height) {
      toast.info('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const bmr = Math.round(
        calculateBMR(formData.weight, formData.height, formData.age, formData.gender)
      );
      const tdee = Math.round(calculateTDEE(bmr, formData.activityLevel));
      const macros = calculateMacros(tdee, formData.goal);
      const idealWeight = calculateIdealWeight(formData.height, formData.gender);

      const newMetrics = { bmr, tdee, macros, idealWeight };
      setMetrics(newMetrics);
      setShowResults(true);

      try {
        await fetchWithAuth(API_ENDPOINTS.HEALTH_METRICS.SAVE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            bmr,
            tdee,
            unit,
          }),
        });
        toast.success('Metrics saved successfully!');
        await fetchMetricsHistory();
      } catch (error) {
        toast.error('Failed to save metrics');
      }
    } catch (error) {
      toast.error('Error calculating metrics');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchLatestMetrics,
    fetchMetricsHistory,
    handleInputChange,
    calculateMetrics,
  };
};

export default useHealthMetricsData;
