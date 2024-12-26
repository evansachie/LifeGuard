import * as React from "react";
import { Link } from 'react-router-dom';
import './Analytics.css';
import {ArrowLeft} from "lucide-react";

const ComingSoon = ({ isDarkMode }) => {
    return (
        <div className={`coming-soon-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className="coming-soon-content">
                <h1>My Analytics</h1>
                <p>This feature is coming soon!</p>
                <div className="countdown">
                    <div className="countdown-item">
                        <span className="countdown-value">00</span>
                        <span className="countdown-label">Days</span>
                    </div>
                    <div className="countdown-item">
                        <span className="countdown-value">00</span>
                        <span className="countdown-label">Hours</span>
                    </div>
                    <div className="countdown-item">
                        <span className="countdown-value">00</span>
                        <span className="countdown-label">Minutes</span>
                    </div>
                    <div className="countdown-item">
                        <span className="countdown-value">00</span>
                        <span className="countdown-label">Seconds</span>
                    </div>
                </div>
                <Link to="/settings" className="back-link">
                    <ArrowLeft size={20} className="back-icon" />
                    <i className="fas fa-arrow-left"></i> Back to Settings
                </Link>
            </div>
        </div>
    );
};

export default ComingSoon;