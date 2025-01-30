import React from "react";
import { Link } from "react-router-dom";
import './QuickAccess.css';
import { GiMeditation } from 'react-icons/gi';
import { IoMdFitness } from "react-icons/io";
import { FaBurn } from 'react-icons/fa';

function HealthTracker({ isDarkMode }) {
    return (
        <div className={`health-tracker ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <h2 className="health-tracker-heading">Quick Access Tabs</h2>
            <div className="health-tracker-grid">
                <Link to="/bmr-calculator" className="health-tracker-card">
                    <div className="health-tracker-icon">
                        <FaBurn />
                    </div>
                    <h3>BMR Calculator</h3>
                    <p>Discover your daily calorie needs and optimize your health goals.</p>
                </Link>
                
                <Link to="/exercise-routines" className="health-tracker-card">
                    <div className="health-tracker-icon">
                        <IoMdFitness />
                    </div>
                    <h3>Exercise Routines</h3>
                    <p>Find personalized workout plans tailored to your fitness level.</p>
                </Link>

                <Link to="/wellness-hub" className="health-tracker-card">
                    <div className="health-tracker-icon">
                        <GiMeditation />
                    </div>
                    <h3>Wellness Hub</h3>
                    <p>Explore mindfulness practices and mental well-being resources.</p>
                </Link>
            </div>
        </div>
    );
}

export default HealthTracker;