import * as React from "react";
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import 'intro.js/introjs.css';
import { AuthProvider } from './contexts/AuthContext';
import { BLEProvider } from './contexts/BLEContext';

import LandingPage from './pages/Landing/LandingPage';

import LogIn from "./components/Auth/LogIn/LogIn";
import SignUp from "./components/Auth/SignUp/SignUp";
import OTPVerification from './components/Auth/OTPVerification/OTPVerification';
import ForgotPassword from './components/Auth/ForgotPassword/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword/ResetPassword';
import VerifyEmergencyContact from './pages/VerifyEmergencyContact/VerifyEmergencyContact';
import EmergencyTracking from './pages/EmergencyTracking/EmergencyTracking';

import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard';
import Analytics from './pages/Analytics/Analytics';
import PrivateMemos from './pages/PrivateMemos/PrivateMemos';
import HealthReport from "./pages/HealthReport/HealthReport";

import PollutionTracker from './pages/PollutionTracker/PollutionTracker';
import HealthTips from "./pages/HealthTips/HealthTips";
import EmergencyContacts from "./pages/EmergencyContacts/EmergencyContacts";

import HealthMetrics from "./pages/Calories/HealthMetrics";
import ExerciseRoutines from "./pages/ExerciseRoutines/ExerciseRoutines";
import WellnessHub from "./pages/WellnessHub/WellnessHub";

import Profile from "./pages/Profile/Profile";
import Settings from "./pages/Settings/Settings";
import Help from './pages/Help/Help';
import TermsOfUse from './pages/TermsOfUse/TermsOfUse';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy';

import NotFound from './pages/NotFound/NotFound';

import './App.css';

function App() {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved === 'dark';
    });

    const toggleTheme = () => {
        const newTheme = !isDarkMode;
        setIsDarkMode(newTheme);
        localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    };

    // Effect to apply theme on mount and changes
    useEffect(() => {
        document.documentElement.classList.toggle('dark-mode', isDarkMode);
    }, [isDarkMode]);

    const isAuthenticated = () => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        return !!(token && userId);
    };

    const AppLayout = ({ children }) => (
        <div className={`app-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <Sidebar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
            <div className="content-container">
                {children}
            </div>
        </div>
    );

    return (
        <Router>
            <BLEProvider>
                <AuthProvider>
                    <div className={isDarkMode ? 'dark-mode' : ''}>
                        <ToastContainer
                            position="top-right"
                            theme={isDarkMode ? 'dark' : 'light'}
                        />
                        <Routes>
                            <Route 
                                path="/" 
                                element={
                                    <LandingPage 
                                        isDarkMode={isDarkMode} 
                                        toggleTheme={toggleTheme}
                                        isAuthenticated={isAuthenticated()}
                                    />
                                } 
                            />
                            <Route 
                                path="/sign-up" 
                                element={<SignUp isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} 
                            />
                            <Route 
                                path="/log-in" 
                                element={<LogIn isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} 
                            />
                            <Route 
                                path="/verify-otp" 
                                element={<OTPVerification isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} 
                            />
                            <Route 
                                path="/forgot-password" 
                                element={<ForgotPassword isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} 
                            />
                            <Route 
                                path="/reset-password" 
                                element={<ResetPassword isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} 
                            />
                            <Route 
                                path="/verify-emergency-contact" 
                                element={<VerifyEmergencyContact isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} 
                            />
                            <Route 
                                path="/emergency-tracking" 
                                element={<EmergencyTracking isDarkMode={isDarkMode} />} 
                            />

                            <Route
                                element={
                                    <ProtectedRoute>
                                        <AppLayout isDarkMode={isDarkMode}>
                                            <Outlet />
                                        </AppLayout>
                                    </ProtectedRoute>
                                }
                            >
                                <Route path="/dashboard" element={<Dashboard isDarkMode={isDarkMode} />} />
                                <Route path="/sticky-notes" element={<PrivateMemos isDarkMode={isDarkMode} />} />
                                <Route path="/health-report" element={<HealthReport isDarkMode={isDarkMode} />} />
                                <Route path="/health-metrics" element={<HealthMetrics isDarkMode={isDarkMode} />} />
                                <Route path="/pollution-tracker" element={<PollutionTracker isDarkMode={isDarkMode} />} />
                                <Route path="/health-tips" element={<HealthTips isDarkMode={isDarkMode} />} />
                                <Route path="/exercise-routines" element={<ExerciseRoutines isDarkMode={isDarkMode} />} />
                                <Route path="/wellness-hub" element={<WellnessHub isDarkMode={isDarkMode} />} />
                                <Route path="/emergency-contacts" element={<EmergencyContacts isDarkMode={isDarkMode} />} />
                                <Route path="/profile" element={<Profile isDarkMode={isDarkMode} />} />
                                <Route path="/settings" element={<Settings isDarkMode={isDarkMode} />} />
                                <Route path="/help" element={<Help isDarkMode={isDarkMode} />} />
                                <Route path="/terms-of-use" element={<TermsOfUse isDarkMode={isDarkMode} />} />
                                <Route path="/privacy-policy" element={<PrivacyPolicy isDarkMode={isDarkMode} />} />
                                <Route 
                                    path="/analytics" 
                                    element={
                                        <ProtectedRoute>
                                            <Analytics isDarkMode={isDarkMode} />
                                        </ProtectedRoute>
                                    } 
                                />
                            </Route>

                            <Route path="*" element={<NotFound isDarkMode={isDarkMode} />} />
                        </Routes>
                    </div>
                </AuthProvider>
            </BLEProvider>
        </Router>
    );
}

export default App;