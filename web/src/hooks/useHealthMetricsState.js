import { useState } from 'react';

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
        goal: 'maintain'
    });

    const [metricsData, setMetricsData] = useState({
        bmr: 0,
        tdee: 0,
        macros: null,
        idealWeight: null
    });

    const [showResults, setShowResults] = useState(false);
    const [unit, setUnit] = useState('imperial');
    const [isLoading, setIsLoading] = useState(true);
    const [metricsHistory, setMetricsHistory] = useState([]);

    // Group metrics data and its setter for easier passing to components
    const metrics = {
        data: metricsData,
        setMetrics: setMetricsData
    };

    return {
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
        setMetricsHistory
    };
};

export default useHealthMetricsState;