import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import HealthTracker from '../../components/HealthTracker/HealthTracker';
import { FaStickyNote, FaChartLine, FaTemperatureHigh, FaWind } from 'react-icons/fa';
import { IoFootstepsOutline } from "react-icons/io5";
import { WiHumidity } from "react-icons/wi";

function Dashboard({ isDarkMode }) {
    const [hydrationLevel, setHydrationLevel] = useState(1);
    const [isAthletic, setIsAthletic] = useState(false);
    const [savedMemos, setSavedMemos] = useState([]);
    const [quote, setQuote] = useState(null);
    const [username, setUsername] = useState('');

    useEffect(() => {
        fetchHydrationData();
        fetchQuoteData();
        fetchSavedMemos();
        fetchUserDetails();
    }, []);

    const fetchHydrationData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://lighthouse-portal.onrender.com/api/hydration', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setHydrationLevel(response.data.hydrationLevel);
            setIsAthletic(response.data.isAthletic);
        } catch (error) {
            console.error('Error fetching hydration data:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
            }
        }
    };

    const fetchSavedMemos = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://lighthouse-portal.onrender.com/api/memos', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSavedMemos(response.data);
        } catch (error) {
            console.error('Error fetching saved memos:', error);
        }
    };

    const fetchQuoteData = async () => {
        try {
            const response = await axios.get('https://api.quotable.io/random');
            const quoteData = response.data;
            const cleanedQuote = {
                text: quoteData.content,
                author: quoteData.author,
            };
            setQuote(cleanedQuote);
        } catch (error) {
            console.error('Error fetching quote data:', error);
        }
    };

    const fetchUserDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://lighthouse-portal.onrender.com/api/users/details', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsername(response.data.username);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const hydrationLevelToOunces = (level) => {
        const maxOunces = isAthletic ? 140 : 120; // 140 oz for athletic, 120 oz for non-athletic
        return Math.round((level / 5) * maxOunces);
    };

    return (
        <div className={`dashboard ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <header className="dashboard-header">
                <h1>Welcome to your Health Dashboard, {username}!</h1>
                <p className="date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </header>

            <div className="dashboard-grid">
                <div className="dashboard-card hydration-card">
                    <h2><FaTemperatureHigh /> Temperature</h2>
                    <Link to="/temperature" className="card-link">Track Temperature</Link>
                </div>

                <div className="dashboard-card reminders-card">
                    <h2><FaStickyNote /> Reminders</h2>
                    <ul className="reminders-list">
                        {savedMemos.length === 0 ? (
                            <li>No reminders at the moment</li>
                        ) : (
                            savedMemos.slice(0, 3).map((memo, index) => (
                                <li key={index} className={memo.done ? 'done' : ''}>{memo.memo}</li>
                            ))
                        )}
                    </ul>
                    <Link to="/sticky-notes" className="card-link">View All</Link>
                </div>

                <div className="dashboard-card quote-card">
                    <h2><FaChartLine /> Daily Inspiration</h2>
                    {quote ? `"${quote.text}"` : 'Loading quote...'}
                    <br/>
                    {quote && quote.author ? `– ${quote.author}` : ''}
                </div>
            </div>

            <div className='dashboard-grid'>
                <div className="dashboard-card hydration-card">
                        <h2><IoFootstepsOutline /> Activities / Step Counter</h2>
                        <Link to="/steps" className="card-link">Track Steps</Link>
                </div>

                <div className="dashboard-card hydration-card">
                        <h2><WiHumidity /> Humidity</h2>
                        <Link to="/temperature" className="card-link">Track Humidity</Link>
                </div>

                <div className="dashboard-card hydration-card">
                        <h2><FaWind /> Atmospheric Pressure</h2>
                        <Link to="/temperature" className="card-link">Track Atmospheric Pressure</Link>
                </div>
                
            </div>

            <HealthTracker isDarkMode={isDarkMode} />
        </div>
    );
}

export default Dashboard;