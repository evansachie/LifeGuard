import * as React from "react";
import { useState, useEffect } from 'react';
import { Sun, Moon, RefreshCcw, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon } from 'lucide-react';
import "./Settings.css"
import axios from 'axios';

const SettingsPage = () => {
    const [theme, setTheme] = useState('dark');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [campaignName, setCampaignName] = useState('');
    const [endOfDay, setEndOfDay] = useState('');
    const [notification, setNotification] = useState(false);
    const [unit, setUnit] = useState('Metric');
    const navigate = useNavigate();
    
    // useEffect(() => {
    //     fetchUserUsername();
    //     fetchUserEmail();
    //     fetchUserSettings();
    // }, []);

    const fetchUserSettings = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://lighthouse-portal.onrender.com/api/settings', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const { campaign_name, day_end_time, notification_enabled, measurement_unit } = response.data;
            setCampaignName(campaign_name);
            setEndOfDay(day_end_time);
            setNotification(notification_enabled);
            setUnit(measurement_unit);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.log('User settings not found');
            } else {
                console.error('Error fetching user settings:', error);
            }
        }
    };

    const updateSettings = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put('https://lighthouse-portal.onrender.com/api/settings', {
                campaign_name: campaignName,
                day_end_time: endOfDay,
                notification_enabled: notification,
                measurement_unit: unit,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('User settings updated successfully');
        } catch (error) {
            console.error('Error updating user settings:', error);
        }
    };

    const fetchUserUsername = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://lighthouse-portal.onrender.com/api/users/details', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const userUsername = response.data.username;
            setUsername(userUsername);
            console.log('Fetched username:', userUsername);
        } catch (error) {
            console.error('Error fetching user username:', error);
        }
    };

    const fetchUserEmail = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://lighthouse-portal.onrender.com/api/users/details', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const userEmail = response.data.email;
            setEmail(userEmail);
            console.log('Fetched email:', userEmail);
        } catch (error) {
            console.error('Error fetching user email:', error);
        }
    };

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleDeleteAccount = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete('https://lighthouse-portal.onrender.com/api/users/delete-account', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            localStorage.removeItem('token');
            navigate('/');
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    };

    return (
        <div className={`flex flex-col items-center min-h-screen p-4 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
            <SettingsIcon className='w-12 h-12 text-indigo-500 mb-8' />
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <Link to="/dashboard"
                          className="flex items-center text-indigo-500 hover:text-indigo-600 transition duration-300">
                        <ArrowLeft size={20}/>
                        <span className="ml-2">Back to Dashboard</span>
                    </Link>
                    <div className="flex items-center cursor-pointer" onClick={toggleTheme}>
                        <span className="mr-2">Theme</span>
                        {theme === 'light' ? <Sun size={20} className="text-yellow-500"/> :
                            <Moon size={20} className="text-gray-300"/>}
                    </div>
                </div>
                <div className="mb-6">
                    <div
                        className="flex items-center bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded leading-tight">
                        <p className="flex-1">{username}</p>
                        <button onClick={fetchUserUsername}>
                            <RefreshCcw className="ml-2 text-indigo-500 transition duration-300 hover:text-indigo-600"/>
                        </button>
                    </div>
                </div>
                <div className="mb-6">
                    <div
                        className="flex items-center bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded leading-tight">
                        <p className="flex-1">{email}</p>
                        <button onClick={fetchUserEmail}>
                            <RefreshCcw className="ml-2 text-indigo-500 transition duration-300 hover:text-indigo-600"/>
                        </button>
                    </div>
                </div>
                <div className="mb-6">
                    <div className="relative">
                        <select
                            className="block appearance-none w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-indigo-500 transition duration-300"
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                        >
                            <option>Metric</option>
                            <option>Imperial</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="flex mb-6">
                    <div className="mr-4">
                        <Link to="/analytics" className="text-indigo-500 hover:text-indigo-600 transition duration-300">
                            My Analytics
                        </Link>
                    </div>
                    <div className="mr-4">
                        <Link to="/help" className="text-indigo-500 hover:text-indigo-600 transition duration-300">
                            Help
                        </Link>
                    </div>
                    <div className="mr-4">
                        <Link to="/terms-of-use"
                              className="text-indigo-500 hover:text-indigo-600 transition duration-300">
                            Terms of Use
                        </Link>
                    </div>
                    <div>
                        <Link to="/privacy-policy"
                              className="text-indigo-500 hover:text-indigo-600 transition duration-300">
                            Privacy Policy
                        </Link>
                    </div>
                </div>
                <div className="mb-6 flex items-center">
                    <span className="mr-2 text-gray-700 dark:text-gray-300">Contact Support:</span>
                    <a href="evansachie01@gmail.com"
                       className="text-indigo-500 hover:text-indigo-600 transition duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                    </a>
                    <button className="btn ml-4" onClick={updateSettings}>Save Settings</button>
                </div>
                <div className="mb-4">
                    <button
                        onClick={handleDeleteAccount}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
                    >
                        Delete Account
                    </button>
                </div>
                <div className="mb-4">
                    <button
                        onClick={handleLogout}
                        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;