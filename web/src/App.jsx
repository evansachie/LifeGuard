import * as React from "react";
import { useState, } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import LogIn from "./components/Auth/LogIn/LogIn";
import SignUp from "./components/Auth/SignUp/SignUp";
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard'
import PrivateMemos from './pages/PivateMemos/PrivateMemos';
import HealthReport from "./pages/HealthReport/HealthReport";
import PollutionTracker from './pages/PollutionTracker/PollutionTracker';

import Calories from "./pages/Calories/Calories";
import Profile from "./pages/Profile/Profile";
import Settings from "./pages/Settings/Settings";
import Help from './pages/Help/Help';
import TermsOfUse from './pages/TermsOfUse/TermsOfUse';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy';
import Analytics from './pages/Analytics/Analytics';

import './App.css';

function App() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const handleAuthSuccess = () => {
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<SignUp isDarkMode={isDarkMode} toggleTheme={toggleTheme} onAuthSuccess={handleAuthSuccess} />} />
                <Route path="/log-in" element={<LogIn isDarkMode={isDarkMode} toggleTheme={toggleTheme} onAuthSuccess={handleAuthSuccess} />} />
                <Route
                    path="/*"
                    element={
                        <div className={`app-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
                            <Sidebar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
                            <div className="content-container">
                                <Routes>
                                    <Route path="/dashboard" element={<Dashboard isDarkMode={isDarkMode} />} />
                                    <Route path="/sticky-notes" element={<PrivateMemos isDarkMode={isDarkMode} />} />
                                    <Route path="/health-report" element={<HealthReport isDarkMode={isDarkMode} />} />
                                    <Route path="/bmr-calculator" element={<Calories isDarkMode={isDarkMode} />} />

                                    <Route path="/pollution-tracker" element={<PollutionTracker isDarkMode={isDarkMode} />} />

                                    <Route path="/profile" element={<Profile isDarkMode={isDarkMode} />} />
                                    <Route path="/settings" element={<Settings isDarkMode={isDarkMode} />} />
                                    
                                    <Route path="/help" element={<Help isDarkMode={isDarkMode} />} />
                                    <Route path="/terms-of-use" element={<TermsOfUse isDarkMode={isDarkMode} />} />
                                    <Route path="/privacy-policy" element={<PrivacyPolicy isDarkMode={isDarkMode} />} />
                                    <Route path="/analytics" element={<Analytics isDarkMode={isDarkMode} />} />
                                </Routes>
                            </div>
                        </div>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;