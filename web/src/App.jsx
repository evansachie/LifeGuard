import * as React from "react";
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import 'intro.js/introjs.css';
import { AuthProvider } from './contexts/AuthContext';

import LogIn from "./components/Auth/LogIn/LogIn";
import SignUp from "./components/Auth/SignUp/SignUp";
import OTPVerification from './components/Auth/OTPVerification/OTPVerification';
import ForgotPassword from './components/Auth/ForgotPassword/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword/ResetPassword';

import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard'
import PrivateMemos from './pages/PrivateMemos/PrivateMemos';
import HealthReport from "./pages/HealthReport/HealthReport";

import PollutionTracker from './pages/PollutionTracker/PollutionTracker';
import HealthTips from "./pages/HealthTips/HealthTips";
import EmergencyContacts from "./pages/EmergencyContacts/EmergencyContacts";

import Calories from "./pages/Calories/Calories";
import ExerciseRoutines from "./pages/ExerciseRoutines/ExerciseRoutines";
import WellnessHub from "./pages/WellnessHub/WellnessHub";

import Profile from "./pages/Profile/Profile";
import Settings from "./pages/Settings/Settings";
import Help from './pages/Help/Help';
import TermsOfUse from './pages/TermsOfUse/TermsOfUse';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy';
import Analytics from './pages/Analytics/Analytics';

import NotFound from './pages/NotFound/NotFound';

import './App.css';

function App() {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark';
    });

    useEffect(() => {
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        document.body.classList.toggle('dark-mode', isDarkMode);
    }, [isDarkMode]);

    const isAuthenticated = () => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        return !!(token && userId);
    };

    const toggleTheme = () => {
        setIsDarkMode(prevMode => !prevMode);
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
            <AuthProvider>
                <div className={isDarkMode ? 'dark' : 'light'}>
                    <ToastContainer
                        position="top-right"
                        theme={isDarkMode ? 'dark' : 'light'}
                    />
                    <Routes>
                        {/* Public routes */}
                        <Route 
                            path="/" 
                            element={
                                isAuthenticated() ? (
                                    <Navigate to="/dashboard" replace />
                                ) : (
                                    <SignUp isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                                )
                            } 
                        />
                        <Route path="/log-in" element={<LogIn isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} />
                        <Route path="/verify-otp" element={<OTPVerification isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} />
                        <Route path="/forgot-password" element={<ForgotPassword isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} />
                        <Route path="/reset-password" element={<ResetPassword isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} />

                        {/* Protected routes */}
                        <Route
                            element={
                                <ProtectedRoute>
                                    <AppLayout isDarkMode={isDarkMode}>
                                        <Outlet /> {/* This will render the child routes */}
                                    </AppLayout>
                                </ProtectedRoute>
                            }
                        >
                            <Route path="/dashboard" element={<Dashboard isDarkMode={isDarkMode} />} />
                            <Route path="/sticky-notes" element={<PrivateMemos isDarkMode={isDarkMode} />} />
                            <Route path="/health-report" element={<HealthReport isDarkMode={isDarkMode} />} />
                            <Route path="/bmr-calculator" element={<Calories isDarkMode={isDarkMode} />} />
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
                            <Route path="/analytics" element={<Analytics isDarkMode={isDarkMode} />} />
                        </Route>

                        <Route path="*" element={<NotFound isDarkMode={isDarkMode} />} />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;