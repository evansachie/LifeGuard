import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaTemperatureHigh, FaExclamationTriangle, FaChartLine, FaStickyNote, FaBluetooth, FaBluetoothB } from 'react-icons/fa';
import { IoFootstepsOutline } from "react-icons/io5";
import { MdCo2 } from "react-icons/md";
import { WiBarometer, WiHumidity, WiDust } from "react-icons/wi";
import { MdAir } from "react-icons/md";
import { toast } from 'react-toastify';
import { fetchWithAuth, API_ENDPOINTS, QUOTE_API_URL } from '../../utils/api';
import './Dashboard.css';
import QuickAccess from '../../components/QuickAccess/QuickAccess';
import Spinner from '../../components/Spinner/Spinner';
import { Steps } from 'intro.js-react';
import { dashboardSteps } from '../../utils/tourSteps';

function Dashboard({ isDarkMode }) {
    const [quote, setQuote] = useState(null);
    const [userData, setUserData] = useState(null);
    const [savedMemos, setSavedMemos] = useState([]);
    const [memosLoading, setMemosLoading] = useState(true);
    const [quotesLoading, setQuotesLoading] = useState(true);
    const [dataLoading, setDataLoading] = useState(true);
    const [showDashboardTour, setShowDashboardTour] = useState(false);
    const dashboardRef = useRef(null);
    const [bleDevice, setBleDevice] = useState(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [sensorData, setSensorData] = useState(null);

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

    // BLE UUIDs from the Arduino code
    const BLE_UUID = {
        SERVICE: import.meta.env.VITE_SERVICE,
        TEMPERATURE: import.meta.env.VITE_TEMPERATURE,
        HUMIDITY: import.meta.env.VITE_HUMIDITY,
        PRESSURE: import.meta.env.VITE_PRESSURE,
        CO2: import.meta.env.VITE_CO2,
        GAS: import.meta.env.VITE_GAS
    };

    // Fetch data function
    const fetchData = async () => {
        try {
            setDataLoading(true);
            setMemosLoading(true);

            // Fetch user data and memos
            const [userData, memosData] = await Promise.all([
                fetchWithAuth(`${API_ENDPOINTS.GET_USER}?id=${localStorage.getItem('userId')}`),
                fetchWithAuth(API_ENDPOINTS.MEMOS)
            ]);

            if (userData) {
                setUserData({
                    userName: userData.userName,
                    email: userData.email
                });
                localStorage.setItem('userName', userData.userName);
            }

            // Ensure memosData is an array
            setSavedMemos(Array.isArray(memosData) ? memosData : []);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to fetch user data');
            setSavedMemos([]);
        } finally {
            setDataLoading(false);
            setMemosLoading(false);
        }
    };

    // Fetch quote function
    const fetchQuoteData = async () => {
        try {
            setQuotesLoading(true);
            const response = await axios.get(QUOTE_API_URL);
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

    // Initial data fetch
    useEffect(() => {
        fetchData();
        fetchQuoteData();
    }, []);

    // Tour initialization - only when coming from Help page
    useEffect(() => {
        const shouldShowTour = localStorage.getItem('showTour') === 'true';
        // Only show tour if explicitly set from Help page
        if (shouldShowTour && window.location.pathname === '/dashboard') {
            console.log('Starting tour from Help page redirect');
            setTimeout(() => {
                setShowDashboardTour(true);
            }, 1000);
        }
    }, []);

    const handleTourExit = () => {
        console.log('Tour exited');
        setShowDashboardTour(false);
        localStorage.removeItem('showTour');
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

    const connectToDevice = async () => {
        try {
            setIsConnecting(true);
            
            // Request device with specified service
            const device = await navigator.bluetooth.requestDevice({
                filters: [{ namePrefix: 'NiclaSenseME-' }],
                optionalServices: [BLE_UUID.SERVICE]
            });

            // Connect to device
            const server = await device.gatt.connect();
            const service = await server.getPrimaryService(BLE_UUID.SERVICE);

            // Get characteristics
            const characteristics = await Promise.all([
                service.getCharacteristic(BLE_UUID.TEMPERATURE),
                service.getCharacteristic(BLE_UUID.HUMIDITY),
                service.getCharacteristic(BLE_UUID.PRESSURE),
                service.getCharacteristic(BLE_UUID.CO2),
                service.getCharacteristic(BLE_UUID.GAS)
            ]);

            setBleDevice(device);
            startDataReading(characteristics);
            toast.success('Connected to Nicla Sense ME');

        } catch (error) {
            console.error('Bluetooth Error:', error);
            toast.error('Failed to connect to device');
        } finally {
            setIsConnecting(false);
        }
    };

    const startDataReading = async (characteristics) => {
        const [tempChar, humChar, pressChar, co2Char, gasChar] = characteristics;

        // Read initial values
        const readData = async () => {
            try {
                const temp = await tempChar.readValue();
                const hum = await humChar.readValue();
                const press = await pressChar.readValue();
                const co2 = await co2Char.readValue();
                const gas = await gasChar.readValue();

                setSensorData({
                    temperature: temp.getFloat32(0, true),
                    humidity: hum.getUint8(0),
                    pressure: press.getFloat32(0, true),
                    co2: co2.getInt32(0, true),
                    gas: gas.getUint32(0, true)
                });

                // Update pollution data with real values
                setPollutionData(prev => ({
                    ...prev,
                    temperature: temp.getFloat32(0, true),
                    humidity: hum.getUint8(0),
                    pressure: press.getFloat32(0, true),
                    co2: co2.getInt32(0, true)
                }));

            } catch (error) {
                console.error('Error reading sensor data:', error);
            }
        };

        // Read values every second
        const interval = setInterval(readData, 1000);
        return () => clearInterval(interval);
    };

    // Add disconnect handler
    const disconnectDevice = async () => {
        if (bleDevice) {
            await bleDevice.gatt.disconnect();
            setBleDevice(null);
            setSensorData(null);
            toast.info('Device disconnected');
        }
    };

    // Add cleanup on unmount
    useEffect(() => {
        return () => {
            disconnectDevice();
        };
    }, []);

    return (
        <div ref={dashboardRef} className={`dashboard ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
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
                                {savedMemos?.length === 0 ? (
                                    <li>No reminders at the moment</li>
                                ) : (
                                    savedMemos.slice(0, 3).map((memo) => (
                                        <li 
                                            key={memo.Id} 
                                            className={memo.Done ? 'done' : ''}
                                        >
                                            {memo.Text}
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

            <Steps
                enabled={showDashboardTour}
                steps={dashboardSteps}
                initialStep={0}
                onExit={handleTourExit}
                options={{
                    dontShowAgain: false,
                    tooltipClass: isDarkMode ? 'dark-mode' : '',
                    nextLabel: 'Next →',
                    prevLabel: '← Back',
                    doneLabel: 'Got it!',
                    showProgress: true,
                    showBullets: true,
                    overlayOpacity: isDarkMode ? 0.5 : 0.3,
                    exitOnOverlayClick: false,
                    exitOnEsc: false,
                    scrollToElement: true,
                    disableInteraction: false,
                    scrollPadding: 100,
                    positionPrecedence: ['bottom', 'top', 'right', 'left'],
                    highlightClass: isDarkMode ? 'introjs-highlight-dark' : 'introjs-highlight',
                    tooltipPosition: 'auto',
                    showStepNumbers: false
                }}
            />

            <div className="ble-connect-button">
                {isConnecting ? (
                    <button className="connect-btn loading" disabled>
                        <Spinner size="small" color="#fff" />
                        Connecting...
                    </button>
                ) : bleDevice ? (
                    <button 
                        className="connect-btn connected" 
                        onClick={disconnectDevice}
                    >
                        <FaBluetoothB />
                        Disconnect
                    </button>
                ) : (
                    <button 
                        className="connect-btn" 
                        onClick={connectToDevice}
                    >
                        <FaBluetooth />
                        Connect Device
                    </button>
                )}
            </div>
        </div>
    );
}

export default Dashboard;