import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaTemperatureHigh, FaExclamationTriangle, FaChartLine, FaStickyNote } from 'react-icons/fa';
import { IoFootstepsOutline } from "react-icons/io5";
import { MdCo2 } from "react-icons/md";
import { WiBarometer, WiHumidity, WiDust } from "react-icons/wi";
import { MdAir } from "react-icons/md";
import { toast } from 'react-toastify';
import { fetchWithAuth, API_ENDPOINTS } from '../../utils/api';
import './Dashboard.css';
import QuickAccess from '../../components/QuickAccess/QuickAccess';
import Spinner from '../../components/Spinner/Spinner';

function Dashboard({ isDarkMode }) {
    const [quote, setQuote] = useState(null);
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [savedMemos, setSavedMemos] = useState([]);
    const [memosLoading, setMemosLoading] = useState(true);
    const [quotesLoading, setQuotesLoading] = useState(true);
    const [dataLoading, setDataLoading] = useState(true);

    const [pollutionData, setPollutionData] = useState({
        temperature: 28.5,
        humidity: 65,
        pressure: 1013.25,
        steps: 1.2,
        aqi: 75,
        pm25: 15.2,
        pm10: 45.8,
        no2: 25.4
    });

    const [alerts, setAlerts] = useState([
        {
            id: 1,
            type: 'warning',
            message: 'High PM2.5 levels detected in your area',
            time: '2 hours ago'
        },
        {
            id: 2,
            type: 'info',
            message: 'Air quality has improved since yesterday',
            time: '5 hours ago'
        }
    ]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setDataLoading(true);
                setMemosLoading(true);
                setQuotesLoading(true);

                // Fetch user data and memos
                const [userData, memosData] = await Promise.all([
                    fetchWithAuth(`${API_ENDPOINTS.GET_USER}?id=${localStorage.getItem('userId')}`),
                    fetch(API_ENDPOINTS.MEMOS, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json'
                        }
                    }).then(res => res.json())
                ]);

                if (userData) {
                    setUserData({
                        userName: userData.userName,
                        email: userData.email
                    });
                    // Also store in localStorage for other components
                    localStorage.setItem('userName', userData.userName);
                }
                setSavedMemos(memosData);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to fetch user data');
            } finally {
                setDataLoading(false);
                setMemosLoading(false);
            }
        };

        const fetchQuoteData = async () => {
            try {
                setQuotesLoading(true);
                const response = await axios.get('https://api.allorigins.win/raw?url=https://zenquotes.io/api/random');
                const quoteData = response.data[0];
                setQuote({
                    quote: quoteData.q,
                    author: quoteData.a
                });
            } catch (error) {
                console.error('Error fetching quote:', error);
                toast.error('Failed to fetch quote');
            } finally {
                setQuotesLoading(false);
            }
        };

        fetchData();
        fetchQuoteData();
        
        // Mock data updates every 5 minutes
        const interval = setInterval(() => {
            updateMockData();
        }, 300000);
        
        return () => clearInterval(interval);
    }, []);

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

    const updateMockData = () => {
        // Simulate real-time data changes
        setPollutionData(prev => ({
            ...prev,
            temperature: prev.temperature + (Math.random() - 0.5),
            humidity: Math.max(0, Math.min(100, prev.humidity + (Math.random() - 0.5) * 5)),
            pressure: prev.pressure + (Math.random() - 0.5) * 2,
            steps: Math.max(0, prev.steps + (Math.random() - 0.5)),
            aqi: Math.max(0, Math.min(500, prev.aqi + (Math.random() - 0.5) * 10)),
            pm25: Math.max(0, prev.pm25 + (Math.random() - 0.5) * 2),
            pm10: Math.max(0, prev.pm10 + (Math.random() - 0.5) * 3),
            no2: Math.max(0, prev.no2 + (Math.random() - 0.5) * 2)
        }));
    };

    const getAQIColor = (aqi) => {
        if (aqi <= 50) return '#00e400';
        if (aqi <= 100) return '#ffff00';
        if (aqi <= 150) return '#ff7e00';
        if (aqi <= 200) return '#ff0000';
        if (aqi <= 300) return '#8f3f97';
        return '#7e0023';
    };

    const getFirstName = (fullName) => {
        if (!fullName) return 'User';
        // If it's an email, show just the first part
        if (fullName.includes('@')) {
            return fullName.split('@')[0].charAt(0).toUpperCase() + 
                   fullName.split('@')[0].slice(1).toLowerCase();
        }
        // If it's a full name, show just the first name
        return fullName.split(' ')[0].charAt(0).toUpperCase() + 
               fullName.split(' ')[0].slice(1).toLowerCase();
    };

    return (
        <div className={`dashboard ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <header className="dashboard-header">
                <h1>Welcome {dataLoading ? '...' : getFirstName(userData?.userName)}!</h1>
                <p className="date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </header>

            <div className="dashboard-grid">
                <div className="dashboard-card temperature-card">
                    <h2><FaTemperatureHigh />Atmospheric Temperature</h2>
                    <div className="card-value">{pollutionData.temperature.toFixed(1)}°C</div>
                </div>

                <div className="dashboard-card humidity-card">
                    <h2><WiHumidity /> Humidity</h2>
                    <div className="card-value">{Math.round(pollutionData.humidity)}%</div>
                </div>

                <div className="dashboard-card pressure-card">
                    <h2><WiBarometer /> Atmospheric Pressure</h2>
                    <div className="card-value">{Math.round(pollutionData.pressure)} hPa</div>
                </div>

                <div className="dashboard-card wind-card">
                    <h2><IoFootstepsOutline /> Activities</h2>
                    <div className="card-value">{pollutionData.steps.toFixed(1)} K steps</div>
                </div>

                <div className="dashboard-card quote-card">
                    <h2><FaChartLine /> Daily Inspiration</h2>
                    {quotesLoading ? (
                        <Spinner size="medium" color={isDarkMode ? '#4285F4' : '#4285F4'} />
                    ) : (
                        <>
                            {quote ? `"${quote.quote}"` : 'Loading quote...'}
                            <br/>
                            {quote && `– ${quote.author}`}
                        </>
                    )}
                </div>

                <div className="dashboard-card reminders-card">
                    <h2><FaStickyNote /> Reminders</h2>
                    <div className="reminders-content">
                        {memosLoading ? (
                            <Spinner size="medium" color={isDarkMode ? '#4285F4' : '#4285F4'} />
                        ) : (
                            <ul className="reminders-list">
                                {savedMemos.length === 0 ? (
                                    <li>No reminders at the moment</li>
                                ) : (
                                    savedMemos.slice(0, 3).map((memo, index) => (
                                        <li 
                                            key={index} 
                                            className={memo.done ? 'done' : ''}
                                        >
                                            {memo.memo}
                                        </li>
                                    ))
                                )}
                            </ul>
                        )}
                    </div>
                    <Link to="/sticky-notes" className="card-link">View All</Link>
                </div>

                <div className="dashboard-card aqi-card">
                    <h2><MdAir /> Air Quality Index</h2>
                    {dataLoading ? (
                        <Spinner size="medium" color={isDarkMode ? '#4285F4' : '#4285F4'} />
                    ) : (
                        <div className="card-value" style={{ color: getAQIColor(pollutionData.aqi) }}>
                            {Math.round(pollutionData.aqi)} ppm
                        </div>
                    )}
                </div>

                <div className="dashboard-card pressure-card">
                    <h2><MdCo2 /> Carbon Dioxide (CO2)</h2>
                    <div className="card-value">{Math.round(pollutionData.pressure)} ppm</div>
                </div>

                <div className="dashboard-card pollutants-card">
                    <h2><WiDust /> Pollutants</h2>
                    <div className="pollutants-grid">
                        <div className="pollutant">
                            <span>PM2.5</span>
                            <span>{pollutionData.pm25.toFixed(1)} µg/m³</span>
                        </div>
                        <div className="pollutant">
                            <span>PM10</span>
                            <span>{pollutionData.pm10.toFixed(1)} µg/m³</span>
                        </div>
                        <div className="pollutant">
                            <span>NO₂</span>
                            <span>{pollutionData.no2.toFixed(1)} ppb</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="dashboard-card alerts-section">
                <h2><FaExclamationTriangle /> Recent Alerts</h2>
                <div className="alerts-list">
                    {alerts.map(alert => (
                        <div key={alert.id} className={`alert-item ${alert.type}`}>
                            <div className="alert-message">{alert.message}</div>
                            <div className="alert-time">{alert.time}</div>
                        </div>
                    ))}
                </div>
            </div>

            <QuickAccess isDarkMode={isDarkMode} />
        </div>
    );
}

export default Dashboard;