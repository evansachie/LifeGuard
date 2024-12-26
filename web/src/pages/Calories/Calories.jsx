import * as React from "react";
import {useState} from 'react';
import './Calories.css';
import { FaRunning, FaWeightHanging, FaBalanceScale, FaArrowDown } from 'react-icons/fa';

function Calories({ isDarkMode }) {
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [gender, setGender] = useState('male');
    const [bmr, setBMR] = useState(0);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'age':
                setAge(value);
                break;
            case 'weight':
                setWeight(value);
                break;
            case 'height':
                setHeight(value);
                break;
            case 'gender':
                setGender(value);
                break;
            default:
                break;
        }
    };

    const calculateCalories = () => {
        if (age && weight && height && gender) {
            const weightInKg = parseFloat(weight) * 0.453592; // Convert lbs to kg
            const heightInCm = parseFloat(height) * 2.54; // Convert inches to cm
            const ageValue = parseInt(age);

            let calculatedBMR;
            if (gender === 'male') {
                calculatedBMR = 88.362 + (13.397 * weightInKg) + (4.799 * heightInCm) - (5.677 * ageValue);
            } else {
                calculatedBMR = 447.593 + (9.247 * weightInKg) + (3.098 * heightInCm) - (4.330 * ageValue);
            }

            setBMR(Math.round(calculatedBMR));
        } else {
            alert('Please fill in all fields');
        }
    };

    return (
        <div className={`calories-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className="calories-content">
                <div className="calories-header">
                    <div className="calories-icon-container">
                        <div className={`calories-icon ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
                            <FaRunning />
                        </div>
                    </div>
                    <h2 className={`calories-title ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>BMR Calculator</h2>
                </div>

                <div className="calories-input">
                    <div className="input-group">
                        <div className={`input-title ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>Age</div>
                        <input
                            type="number"
                            id="age"
                            name="age"
                            value={age}
                            onChange={handleInputChange}
                            className={`input-field ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
                        />
                    </div>
                    <div className="input-group">
                        <div className={`input-title ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>Weight (lbs)</div>
                        <input
                            type="number"
                            id="weight"
                            name="weight"
                            value={weight}
                            onChange={handleInputChange}
                            className={`input-field ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
                        />
                    </div>
                    <div className="input-group">
                        <div className={`input-title ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>Height (in)</div>
                        <input
                            type="number"
                            id="height"
                            name="height"
                            value={height}
                            onChange={handleInputChange}
                            className={`input-field ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
                        />
                    </div>
                    <div className="input-group">
                        <div className={`input-title ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>Gender</div>
                        <select
                            id="gender"
                            name="gender"
                            value={gender}
                            onChange={handleInputChange}
                            className={`input-field ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                </div>
                <button className={`btn-primary ${isDarkMode ? 'dark-mode' : 'light-mode'}`} onClick={calculateCalories}>
                    Calculate BMR
                </button>

                <div className="calories-overview">
                    <div className="calories-info">
                        <div className={`calories-label ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>Basal Metabolic Rate (BMR)</div>
                        <div className={`calories-value ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>{bmr} calories/day</div>
                    </div>
                </div>

                <div>
                    <div className={`info-card ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
                        <FaBalanceScale className="info-icon" />
                        <p>These numbers are estimates, to have an exact or more precise number requires a medical examination</p>
                    </div>
                </div>
                    
                <div className="info-cards">
                    <div className={`info-card ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
                        <FaWeightHanging className="info-icon" />
                        <p>To gain weight you need a caloric surplus</p>
                    </div>
                    <div className={`info-card ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
                        <FaArrowDown className="info-icon" />
                        <p>To lose weight you need a caloric deficit</p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Calories;