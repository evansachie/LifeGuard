import React, { useState } from 'react';
import { FaRunning, FaWeightHanging, FaChartLine } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { calculateBMR, calculateTDEE, calculateMacros, calculateIdealWeight } from '../../utils/healthMetricsUtils';
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
    const [unit, setUnit] = useState('imperial'); // imperial or metric

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setShowResults(false);
    };

    const calculateMetrics = () => {
        if (!formData.age || !formData.weight || !formData.height) {
            toast.info('Please fill in all fields');
            return;
        }

        const bmr = Math.round(calculateBMR(formData.weight, formData.height, formData.age, formData.gender));
        const tdee = Math.round(calculateTDEE(bmr, formData.activityLevel));
        const macros = calculateMacros(tdee, formData.goal);
        const idealWeight = calculateIdealWeight(formData.height, formData.gender);

        setMetrics({
            bmr,
            tdee,
            macros,
            idealWeight
        });
        setShowResults(true);
    };

    return (
        <div className={`health-metrics-container ${isDarkMode ? 'dark-mode' : ''}`}>
            <div className="health-metrics-content">
                <div className="header-section">
                    <h2>Health Metrics Calculator</h2>
                    <div className="unit-toggle">
                        <button 
                            className={unit === 'imperial' ? 'active' : ''}
                            onClick={() => setUnit('imperial')}
                        >
                            Imperial
                        </button>
                        <button 
                            className={unit === 'metric' ? 'active' : ''}
                            onClick={() => setUnit('metric')}
                        >
                            Metric
                        </button>
                    </div>
                </div>

                <div className="input-section">
                    {/* Basic Metrics */}
                    <div className="input-group">
                        <div className={`${isDarkMode ? 'text-white' : 'text-black'}`}>Age</div>
                        <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleInputChange}
                            placeholder="Years"
                            className={`${isDarkMode ? 'text-white' : 'text-black'}`}
                        />
                    </div>

                    <div className="input-group">
                        <div className={`${isDarkMode ? 'text-white' : 'text-black'}`}>Weight ({unit === 'imperial' ? 'lbs' : 'kg'})</div>
                        <input
                            type="number"
                            name="weight"
                            value={formData.weight}
                            onChange={handleInputChange}
                            placeholder={unit === 'imperial' ? 'Pounds' : 'Kilograms'}
                            className={`${isDarkMode ? 'text-white' : 'text-black'}`}
                        />
                    </div>

                    <div className="input-group">
                        <div className={`${isDarkMode ? 'text-white' : 'text-black'}`}>Height ({unit === 'imperial' ? 'inches' : 'cm'})</div>
                        <input
                            type="number"
                            name="height"
                            value={formData.height}
                            onChange={handleInputChange}
                            placeholder={unit === 'imperial' ? 'Inches' : 'Centimeters'}
                            className={`${isDarkMode ? 'text-white' : 'text-black'}`}
                        />
                    </div>

                    {/* Additional Options */}
                    <div className="input-group">
                        <div className={`${isDarkMode ? 'text-white' : 'text-black'}`}>Gender</div>
                        <select name="gender" value={formData.gender} onChange={handleInputChange} className={`${isDarkMode ? 'text-white' : 'text-black'}`}>
                            <option value="male" className={`${isDarkMode ? 'text-white' : 'text-black'}`}>Male</option>
                            <option value="female" className={`${isDarkMode ? 'text-white' : 'text-black'}`}>Female</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <div className={`${isDarkMode ? 'text-white' : 'text-black'}`}>Activity Level</div>
                        <select name="activityLevel" value={formData.activityLevel} onChange={handleInputChange} className={`${isDarkMode ? 'text-white' : 'text-black'}`}>
                            <option value="sedentary" className={`${isDarkMode ? 'text-white' : 'text-black'}`}>Sedentary (little or no exercise)</option>
                            <option value="light" className={`${isDarkMode ? 'text-white' : 'text-black'}`}>Light (exercise 1-3 days/week)</option>
                            <option value="moderate" className={`${isDarkMode ? 'text-white' : 'text-black'}`}>Moderate (exercise 3-5 days/week)</option>
                            <option value="active" className={`${isDarkMode ? 'text-white' : 'text-black'}`}>Active (exercise 6-7 days/week)</option>
                            <option value="veryActive" className={`${isDarkMode ? 'text-white' : 'text-black'}`}>Very Active (intense exercise daily)</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <div className={`${isDarkMode ? 'text-white' : 'text-black'}`}>Goal</div>
                        <select name="goal" value={formData.goal} onChange={handleInputChange} className={`${isDarkMode ? 'text-white' : 'text-black'}`}>
                            <option value="lose" className={`${isDarkMode ? 'text-white' : 'text-black'}`}>Weight Loss</option>
                            <option value="maintain" className={`${isDarkMode ? 'text-white' : 'text-black'}`}>Maintain Weight</option>
                            <option value="gain" className={`${isDarkMode ? 'text-white' : 'text-black'}`}>Weight Gain</option>
                        </select>
                    </div>
                </div>

                <button className="calculate-btn" onClick={calculateMetrics}>
                    Calculate Metrics
                </button>

                {showResults && (
                    <div className="results-section">
                        <div className="metrics-grid">
                            <div className="metric-card">
                                <FaRunning className="metric-icon" />
                                <h3>BMR</h3>
                                <p className="metric-value">{metrics.bmr} calories/day</p>
                                <p className="metric-description">Base Metabolic Rate</p>
                            </div>

                            <div className="metric-card">
                                <FaChartLine className="metric-icon" />
                                <h3>TDEE</h3>
                                <p className="metric-value">{metrics.tdee} calories/day</p>
                                <p className="metric-description">Total Daily Energy Expenditure</p>
                            </div>

                            <div className="metric-card">
                                <FaWeightHanging className="metric-icon" />
                                <h3>Ideal Weight Range</h3>
                                <p className="metric-value">
                                    {metrics.idealWeight.min} to {metrics.idealWeight.max} 
                                    {unit === 'imperial' ? ' lbs' : ' kg'}
                                </p>
                            </div>
                        </div>

                        {metrics.macros && (
                            <div className="macros-section">
                                <h3>Daily Macro Nutrients</h3>
                                <div className="macros-grid">
                                    <div className="macro-card">
                                        <h4>Protein</h4>
                                        <p>{metrics.macros.protein}g</p>
                                    </div>
                                    <div className="macro-card">
                                        <h4>Carbs</h4>
                                        <p>{metrics.macros.carbs}g</p>
                                    </div>
                                    <div className="macro-card">
                                        <h4>Fat</h4>
                                        <p>{metrics.macros.fat}g</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="recommendations-section">
                            <h3>Personalized Recommendations</h3>
                            <ul>
                                <li className={`${isDarkMode ? 'text-white' : 'text-black'}`}>Aim for {metrics.macros.calories} calories per day to {formData.goal} weight</li>
                                <li className={`${isDarkMode ? 'text-white' : 'text-black'}`}>Try to get {metrics.macros.protein}g of protein to maintain muscle mass</li>
                                <li className={`${isDarkMode ? 'text-white' : 'text-black'}`}>Stay hydrated with {Math.round(formData.weight * 0.5)} oz of water daily</li>
                                <li className={`${isDarkMode ? 'text-white' : 'text-black'}`}>Consider tracking your meals to meet your macro goals</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default HealthMetrics; 