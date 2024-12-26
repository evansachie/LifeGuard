import React from 'react';
import { FaUtensils, FaChartBar, FaAppleAlt } from 'react-icons/fa';
import './Food.css';

export default function Food({ isDarkMode }) {
    return (
        <div className={`food-coming-soon ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className="content">
                <h1>Food Tracking</h1>
                <p className="subtitle">Your personal nutrition assistant is coming soon!</p>
                <div className="features">
                    <div className="feature-item">
                        <FaUtensils className="icon" />
                        <span className="label">Log Meals</span>
                    </div>
                    <div className="feature-item">
                        <FaChartBar className="icon" />
                        <span className="label">Track Calories</span>
                    </div>
                    <div className="feature-item">
                        <FaAppleAlt className="icon" />
                        <span className="label">Analyze Nutrients</span>
                    </div>
                </div>
                <button className="notify-btn">Notify Me When It's Ready</button>
            </div>
        </div>
    );
}