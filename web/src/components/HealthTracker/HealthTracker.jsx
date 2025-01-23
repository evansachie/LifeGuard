import React from "react";
import { Link } from "react-router-dom";
import './HealthTracker.css';
import { WiDust } from "react-icons/wi";
import { FaLungs, FaHeartbeat } from 'react-icons/fa';
import { MdAir } from "react-icons/md";

function HealthTracker({ isDarkMode }) {
    return (
        <div className={`health-tracker ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <h2 className="health-tracker-heading">Health Impact Monitor</h2>
            <div className="health-tracker-grid">
                <Link to="/respiratory" className="health-tracker-card">
                    <div className="health-tracker-icon">
                        <FaLungs />
                    </div>
                    <h3>Respiratory Health</h3>
                    <p>Monitor impact on breathing</p>
                </Link>
                <Link to="/air-quality-history" className="health-tracker-card">
                    <div className="health-tracker-icon">
                        <MdAir />
                    </div>
                    <h3>Air Quality History</h3>
                    <p>Track air quality patterns</p>
                </Link>
                <Link to="/pollutant-exposure" className="health-tracker-card">
                    <div className="health-tracker-icon">
                        <WiDust />
                    </div>
                    <h3>Pollutant Exposure</h3>
                    <p>Daily exposure levels</p>
                </Link>
                <Link to="/health-recommendations" className="health-tracker-card">
                    <div className="health-tracker-icon">
                        <FaHeartbeat />
                    </div>
                    <h3>Health Tips</h3>
                    <p>Personalized health recommendations</p>
                </Link>
            </div>
        </div>
    );
}

export default HealthTracker;