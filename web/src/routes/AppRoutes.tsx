import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';

import LandingPage from '../pages/Landing/LandingPage';

import LogIn from '../pages/Auth/LogIn/LogIn';
import SignUp from '../pages/Auth/SignUp/SignUp';
import OTPVerification from '../pages/Auth/OTPVerification/OTPVerification';
import ForgotPassword from '../pages/Auth/ForgotPassword/ForgotPassword';
import ResetPassword from '../pages/Auth/ResetPassword/ResetPassword';

import VerifyEmergencyContact from '../pages/VerifyEmergencyContact/VerifyEmergencyContact';
import EmergencyTracking from '../pages/EmergencyTracking/EmergencyTracking';

import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
import AppLayout from '../layout/AppLayout';

import Dashboard from '../pages/Dashboard/Dashboard';
import Analytics from '../pages/Analytics/Analytics';
import PrivateMemos from '../pages/PrivateMemos/PrivateMemos';
import HealthReport from '../pages/HealthReport/HealthReport';
import PollutionTracker from '../pages/PollutionTracker/PollutionTracker';
import HealthTips from '../pages/HealthTips/HealthTips';

import ExerciseRoutines from '../pages/ExerciseRoutines/ExerciseRoutines';
import WellnessHub from '../pages/WellnessHub/WellnessHub';
import EmergencyContacts from '../pages/EmergencyContacts/EmergencyContacts';
import HealthMetrics from '../pages/HealthMetrics/HealthMetrics';
import MedicationTracker from '../pages/MedicationTracker/MedicationTracker';

import Profile from '../pages/Profile/Profile';
import Settings from '../pages/Settings/Settings';
import Help from '../pages/Help/Help';

import TermsOfUse from '../pages/Terms/TermsOfUse';
import PrivacyPolicy from '../pages/PrivacyPolicy/PrivacyPolicy';
import NotFound from '../pages/NotFound/NotFound';

import { isAuthenticated } from '../utils/auth';
import GoogleCallback from '../components/Auth/GoogleCallback';

interface AppRoutesProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const AppRoutes: React.FC<AppRoutesProps> = ({ isDarkMode, toggleTheme }) => {
  return (
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
      <Route path="/log-in" element={<LogIn isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} />
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
        element={<EmergencyTracking isDarkMode={isDarkMode} toggleTheme={toggleTheme} />}
      />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
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
        <Route path="/settings" element={<Settings isDarkMode={isDarkMode} toggleDarkMode={undefined} />} />
        <Route path="/help" element={<Help isDarkMode={isDarkMode} />} />
        <Route path="/terms-of-use" element={<TermsOfUse isDarkMode={isDarkMode} />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy isDarkMode={isDarkMode} />} />
        <Route path="/medication-tracker" element={<MedicationTracker isDarkMode={isDarkMode} />} />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics isDarkMode={isDarkMode} />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="/signin-google" element={<GoogleCallback />} />
      <Route path="*" element={<NotFound isDarkMode={isDarkMode} />} />
    </Routes>
  );
};

export default AppRoutes;