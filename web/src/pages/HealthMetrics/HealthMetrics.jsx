import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { fetchWithAuth } from '../../utils/api';
import { calculateBMR, calculateTDEE, calculateMacros, calculateIdealWeight } from '../../utils/healthMetricsUtils';
import { API_ENDPOINTS } from '../../utils/api';
import UnitToggle from '../../components/HealthMetrics/UnitToggle';
import MetricsForm from '../../components/HealthMetrics/MetricsForm';
import ResultsSection from '../../components/HealthMetrics/ResultsSection';
import MetricsHistory from '../../components/HealthMetrics/MetricsHistory';
import './HealthMetrics.css';

function HealthMetrics({ isDarkMode }) {
    const [formData, setFormData] = useState({
        age: '',
        weight: '',
        height: '',
        gender: 'male',
        activityLevel: 'sedentary',
        goal: 'maintain'
    });

    const [metrics, setMetrics] = useState({
        bmr: 0,
        tdee: 0,
        macros: null,
        idealWeight: null
    });

    const [showResults, setShowResults] = useState(false);
    const [unit, setUnit] = useState('imperial');
    const [isLoading, setIsLoading] = useState(true);
    const [metricsHistory, setMetricsHistory] = useState([]);

    useEffect(() => {
        fetchLatestMetrics();
        fetchMetricsHistory();
    }, []);

    const fetchLatestMetrics = async () => {
        try {
            const response = await fetchWithAuth(API_ENDPOINTS.HEALTH_METRICS.LATEST);
            if (response) {
                setFormData(prev => ({
                    ...prev,
                    age: response.Age || '',
                    weight: response.Weight || '',
                    height: response.Height || '',
                    gender: response.Gender || 'male',
                    activityLevel: response.ActivityLevel || 'sedentary',
                    goal: response.Goal || 'maintain'
                }));

                if (response.BMR && response.TDEE) {
                    setMetrics({
                        bmr: response.BMR,
                        tdee: response.TDEE,
                        macros: calculateMacros(response.TDEE, response.Goal),
                        idealWeight: calculateIdealWeight(response.Height, response.Gender)
                    });
                    setShowResults(true);
                }
            }
        } catch (error) {
            console.error('Error fetching metrics:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMetricsHistory = async () => {
        try {
            const response = await fetchWithAuth(API_ENDPOINTS.HEALTH_METRICS.HISTORY);
            setMetricsHistory(response);
        } catch (error) {
            console.error('Error fetching metrics history:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setShowResults(false);
    };

    const calculateMetrics = async () => {
        if (!formData.age || !formData.weight || !formData.height) {
            toast.info('Please fill in all fields');
            return;
        }

        const bmr = Math.round(calculateBMR(formData.weight, formData.height, formData.age, formData.gender));
        const tdee = Math.round(calculateTDEE(bmr, formData.activityLevel));
        const macros = calculateMacros(tdee, formData.goal);
        const idealWeight = calculateIdealWeight(formData.height, formData.gender);

        const newMetrics = { bmr, tdee, macros, idealWeight };
        setMetrics(newMetrics);
        setShowResults(true);

        // Save metrics to database
        try {
            await fetchWithAuth(API_ENDPOINTS.HEALTH_METRICS.SAVE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    bmr,
                    tdee,
                    unit
                })
            });
            toast.success('Metrics saved successfully!');
            fetchMetricsHistory(); // Refresh history
        } catch (error) {
            toast.error('Failed to save metrics');
        }
    };

    return (
        <div className={`health-metrics-container ${isDarkMode ? 'dark-mode' : ''}`}>
            <div className="health-metrics-content">
                <div className="header-section">
                    <h2>Health Metrics Calculator</h2>
                    <UnitToggle unit={unit} setUnit={setUnit} />
                </div>

                <MetricsForm 
                    formData={formData} 
                    handleInputChange={handleInputChange} 
                    unit={unit} 
                    isDarkMode={isDarkMode} 
                    calculateMetrics={calculateMetrics} 
                />

                {showResults && (
                    <ResultsSection 
                        metrics={metrics} 
                        formData={formData} 
                        unit={unit} 
                        isDarkMode={isDarkMode} 
                    />
                )}

                <MetricsHistory 
                    history={metricsHistory}
                    isDarkMode={isDarkMode}
                    unit={unit}
                />
            </div>
        </div>
    );
}

export default HealthMetrics;