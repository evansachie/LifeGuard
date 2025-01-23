import * as React from "react";
import { useState, } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import LogIn from "./components/Auth/LogIn/LogIn";
import SignUp from "./components/Auth/SignUp/SignUp";
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard'
import PrivateMemos from './pages/PivateMemos/PrivateMemos';
import Calories from './pages/Calories/Calories';
import Food from './pages/Food/Food';
import Hydration from './pages/Hydration/Hydration';
import Exercise from './pages/Exercise/Exercise';
import MentalExercise from "./components/MentalExercise/MentalExercise";
import PhysicalExercise from "./components/PhysicalExercise/PhysicalExercise";
import EmotionalExercise from "./components/EmotionalExercise/EmotionalExercise"
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
                                    <Route path="/calories" element={<Calories isDarkMode={isDarkMode} />} />
                                    <Route path="/food" element={<Food isDarkMode={isDarkMode} />} />
                                    <Route path="/hydration" element={<Hydration isDarkMode={isDarkMode} />} />
                                    <Route path="/activities" element={<Exercise isDarkMode={isDarkMode} />} />
                                    <Route path="/mental-exercises" element={<MentalExercise isDarkMode={isDarkMode} />} />
                                    <Route path="/physical-exercises" element={<PhysicalExercise isDarkMode={isDarkMode} />} />
                                    <Route path="/emotional-exercises" element={<EmotionalExercise isDarkMode={isDarkMode} />} />
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