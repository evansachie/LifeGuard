import * as React from "react";
import { Link } from 'react-router-dom';
import './Exercise.css';

function Exercise({ isDarkMode }) {
    return (
        <div className={`exercise-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <h1 className="exercise-header">Activities</h1>
            <div className="exercise-types">
                <Link to="/mental-exercises" className="exercise-type">
                    <div className={`exercise-icon ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>🧠</div>
                    <span className={`exercise-label ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>MENTAL</span>
                </Link>
                <Link to="/physical-exercises" className="exercise-type">
                    <div className={`exercise-icon ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>💪</div>
                    <span className={`exercise-label ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>PHYSICAL</span>
                </Link>
                <Link to="/emotional-exercises" className="exercise-type">
                    <div className={`exercise-icon ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>🧘‍♀️</div>
                    <span className={`exercise-label ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>EMOTIONAL</span>
                </Link>
            </div>
            <div className="exercise-cta">
                <p className={`cta-text ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>WANT MORE EXERCISES?</p>
                <br/>
                <p className={`cta-text ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>WANT A PERSONALIZED PLAN?</p>
                <br/>
                <a href="https://www.progressneverstops.com/booking-calendar/call-w-josh" target="_blank" rel="noopener noreferrer" className={`connect-pro-button ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>Connect with a Pro</a>
            </div>
        </div>
    );
}

export default Exercise;
