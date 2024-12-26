import React from "react";
import { Link } from "react-router-dom";
import './HealthTracker.css';
import { FaBurn, FaWater} from 'react-icons/fa';
import { MdDirectionsRun } from "react-icons/md";

function HealthTracker({ isDarkMode }) {
    return (
        <div className={`health-tracker ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <h2 className="health-tracker-heading">Health Tracker</h2>
            <div className="health-tracker-grid">
                <Link to="/calories" className="health-tracker-card">
                    <div className="health-tracker-icon">
                        <FaBurn />
                    </div>
                    <h3>Calories</h3>
                    <p>Track your daily calorie intake</p>
                </Link>
                <Link to="/hydration" className="health-tracker-card">
                    <div className="health-tracker-icon">
                        <FaWater />
                    </div>
                    <h3>Hydration</h3>
                    <p>Monitor your water consumption</p>
                </Link>
                <Link to="/activities" className="health-tracker-card">
                    <div className="health-tracker-icon">
                        <MdDirectionsRun />
                    </div>
                    <h3>Activities</h3>
                    <p>Effective exercises for overall wellness</p>
                </Link>
            </div>
        </div>
    );
}

export default HealthTracker;