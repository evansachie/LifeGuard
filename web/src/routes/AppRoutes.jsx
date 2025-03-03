import React, { useContext } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext';
import { isAuthenticated } from '../utils/authUtils';
import { AppLayout, AuthLayout } from '../layouts';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';

// Public pages
import LandingPage from '../pages/Landing/LandingPage';
import LogIn from "../components/Auth/LogIn/LogIn";
import SignUp from "../components/Auth/SignUp/SignUp";
import OTPVerification from '../components/Auth/OTPVerification/OTPVerification';
import ForgotPassword from '../components/Auth/ForgotPassword/ForgotPassword';
import ResetPassword from '../components/Auth/ResetPassword/ResetPassword';
import VerifyEmergencyContact from '../pages/VerifyEmergencyContact/VerifyEmergencyContact';
import EmergencyTracking from '../pages/EmergencyTracking/EmergencyTracking';
import NotFound from '../pages/NotFound/NotFound';

// Protected pages
import Dashboard from '../pages/Dashboard/Dashboard';
import Analytics from '../pages/Analytics/Analytics';
import PrivateMemos from '../pages/PrivateMemos/PrivateMemos';
import HealthReport from "../pages/HealthReport/HealthReport";
import PollutionTracker from '../pages/PollutionTracker/PollutionTracker';
import HealthTips from "../pages/HealthTips/HealthTips";
import EmergencyContacts from "../pages/EmergencyContacts/EmergencyContacts";
import HealthMetrics from "../pages/Calories/HealthMetrics";
import ExerciseRoutines from "../pages/ExerciseRoutines/ExerciseRoutines";
import WellnessHub from "../pages/WellnessHub/WellnessHub";
import Profile from "../pages/Profile/Profile";
import Settings from "../pages/Settings/Settings";
import Help from '../pages/Help/Help';
import TermsOfUse from '../pages/TermsOfUse/TermsOfUse';
import PrivacyPolicy from '../pages/PrivacyPolicy/PrivacyPolicy';

const AppRoutes = () => {
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    
    return (
        <Routes>
            {/* Public Routes */}
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
            
            {/* Auth Routes */}
            <Route element={<AuthLayout><><Outlet /></></AuthLayout>}>
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/log-in" element={<LogIn />} />
                <Route path="/verify-otp" element={<OTPVerification />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
            </Route>
            
            {/* Special Public Routes */}
            <Route path="/verify-emergency-contact" element={<VerifyEmergencyContact isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} />
            <Route path="/emergency-tracking" element={<EmergencyTracking isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} />

            {/* Protected Routes with App Layout */}
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/sticky-notes" element={<PrivateMemos />} />
                <Route path="/health-report" element={<HealthReport />} />
                <Route path="/health-metrics" element={<HealthMetrics />} />
                <Route path="/pollution-tracker" element={<PollutionTracker />} />
                <Route path="/health-tips" element={<HealthTips />} />
                <Route path="/exercise-routines" element={<ExerciseRoutines />} />
                <Route path="/wellness-hub" element={<WellnessHub />} />
                <Route path="/emergency-contacts" element={<EmergencyContacts />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/help" element={<Help />} />
                <Route path="/terms-of-use" element={<TermsOfUse />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/analytics" element={<Analytics />} />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFound isDarkMode={isDarkMode} />} />
        </Routes>
    );
};

export default AppRoutes;