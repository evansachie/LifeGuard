import { toast } from 'react-toastify';
import { fetchWithAuth } from '../utils/api';
import {
  calculateBMR,
  calculateTDEE,
  calculateMacros,
  calculateIdealWeight,
} from '../utils/healthMetricsUtils';
import { API_ENDPOINTS } from '../utils/api';

/**
 * Custom hook to handle health metrics data operations
 * @param {Object} params - Parameters object
 * @returns {Object} Data manipulation functions
 */
const useHealthMetricsData = ({
  formData,
  setFormData,
  setMetrics,
  setShowResults,
  unit,
  setMetricsHistory,
  setIsLoading,
}) => {
  /**
   * Fetch the latest metrics from API
   */
  const fetchLatestMetrics = async () => {
    try {
      const response = await fetchWithAuth(API_ENDPOINTS.HEALTH_METRICS.LATEST);
      if (response) {
        setFormData((prev) => ({
          ...prev,
          age: response.Age || '',
          weight: response.Weight || '',
          height: response.Height || '',
          gender: response.Gender || 'male',
          activityLevel: response.ActivityLevel || 'sedentary',
          goal: response.Goal || 'maintain',
        }));

        if (response.BMR && response.TDEE) {
          setMetrics({
            bmr: response.BMR,
            tdee: response.TDEE,
            macros: calculateMacros(response.TDEE, response.Goal),
            idealWeight: calculateIdealWeight(response.Height, response.Gender),
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
  const fetchMetricsHistory = async () => {
    try {
      const response = await fetchWithAuth(API_ENDPOINTS.HEALTH_METRICS.HISTORY);
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
  const handleInputChange = (e) => {
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
  const calculateMetrics = async () => {
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
