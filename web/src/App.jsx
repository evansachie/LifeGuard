import * as React from "react";
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

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
import Calories from "./pages/Calories/Calories";
import Profile from "./pages/Profile/Profile";
import HealthTips from "./pages/HealthTips/HealthTips";
import ExerciseRoutines from "./pages/ExerciseRoutines/ExerciseRoutines";
import WellnessHub from "./pages/WellnessHub/WellnessHub";
import EmergencyContacts from "./pages/EmergencyContacts/EmergencyContacts";

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
        return savedTheme ? savedTheme === 'dark' : false;
    });

    const toggleTheme = () => {
        const newTheme = !isDarkMode;
        setIsDarkMode(newTheme);
        localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    };

    const handleAuthSuccess = () => {
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
        <>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<SignUp isDarkMode={isDarkMode} toggleTheme={toggleTheme} onAuthSuccess={handleAuthSuccess} />} />
                    <Route path="/log-in" element={<LogIn isDarkMode={isDarkMode} toggleTheme={toggleTheme} onAuthSuccess={handleAuthSuccess} />} />
                    <Route path="/verify-otp" element={<OTPVerification isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} />
                    <Route path="/forgot-password" element={<ForgotPassword isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} />
                    <Route path="/reset-password" element={<ResetPassword isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} />

                    {/* Protected Routes */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <AppLayout>
                                <Dashboard isDarkMode={isDarkMode} />
                            </AppLayout>
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/sticky-notes" element={
                        <ProtectedRoute>
                            <AppLayout><PrivateMemos isDarkMode={isDarkMode} /></AppLayout>
                        </ProtectedRoute>
                    } />

                    <Route path="/health-report" element={
                        <ProtectedRoute>
                            <AppLayout><HealthReport isDarkMode={isDarkMode} /></AppLayout>
                        </ProtectedRoute>
                    } />

                    <Route path="/bmr-calculator" element={
                            <AppLayout><Calories isDarkMode={isDarkMode} /></AppLayout>
                    } />

                    <Route path="/pollution-tracker" element={
                        <ProtectedRoute>
                            <AppLayout><PollutionTracker isDarkMode={isDarkMode} /></AppLayout>
                        </ProtectedRoute>
                    } />

                    <Route path="/health-tips" element={
                            <AppLayout><HealthTips isDarkMode={isDarkMode} /></AppLayout>
                    } />

                    <Route path="/exercise-routines" element={
                            <AppLayout><ExerciseRoutines isDarkMode={isDarkMode} /></AppLayout>
                    } />

                    <Route path="/wellness-hub" element={
                            <AppLayout><WellnessHub isDarkMode={isDarkMode} /></AppLayout>
                    } />

                    <Route path="/emergency-contacts" element={
                        <ProtectedRoute>
                            <AppLayout><EmergencyContacts isDarkMode={isDarkMode} /></AppLayout>
                        </ProtectedRoute>
                    } />

                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <AppLayout><Profile isDarkMode={isDarkMode} /></AppLayout>
                        </ProtectedRoute>
                    } />

                    <Route path="/settings" element={
                        <ProtectedRoute>
                            <AppLayout><Settings isDarkMode={isDarkMode} /></AppLayout>
                        </ProtectedRoute>
                    } />

                    <Route path="/help" element={
                            <AppLayout><Help isDarkMode={isDarkMode} /></AppLayout>
                    } />

                    <Route path="/terms-of-use" element={
                            <AppLayout><TermsOfUse isDarkMode={isDarkMode} /></AppLayout>
                    } />

                    <Route path="/privacy-policy" element={
                            <AppLayout><PrivacyPolicy isDarkMode={isDarkMode} /></AppLayout>
                    } />
                    
                    <Route path="/analytics" element={
                        <ProtectedRoute>
                            <AppLayout><Analytics isDarkMode={isDarkMode} /></AppLayout>
                        </ProtectedRoute>
                    } />

                    {/* 404 Route*/}
                    <Route path="*" element={<NotFound isDarkMode={isDarkMode} />} />
                </Routes>
            </Router>
            <ToastContainer position="top-right" theme={isDarkMode ? 'dark' : 'light'} />
        </>
    );
}

export default App;