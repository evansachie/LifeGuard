import React from 'react';
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
        setMetricsHistory
    } = useHealthMetricsState();

    const {
        fetchLatestMetrics,
        fetchMetricsHistory,
        handleInputChange,
        calculateMetrics
    } = useHealthMetricsData({
        formData,
        setFormData,
        setMetrics: metrics.setMetrics,
        setShowResults,
        unit,
        setMetricsHistory
    });

    React.useEffect(() => {
        fetchLatestMetrics();
        fetchMetricsHistory();
    }, []);

    return (
        <div className={`health-metrics-container ${isDarkMode ? 'dark-mode' : ''}`}>
            <div className="health-metrics-content">
                <PageHeader unit={unit} setUnit={setUnit} />

                <MetricsForm 
                    formData={formData} 
                    handleInputChange={handleInputChange} 
                    unit={unit} 
                    isDarkMode={isDarkMode} 
                    calculateMetrics={calculateMetrics} 
                />

                {showResults && (
                    <ResultsSection 
                        metrics={metrics.data} 
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