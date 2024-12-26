import React, { useState, useEffect, useCallback } from 'react';
import './Hydration.css';
import axios from 'axios';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { motion, AnimatePresence } from 'framer-motion';

const images = [
    '/images/Hyd1.png',
    '/images/Hyd2.png',
    '/images/Hyd3.png',
    '/images/Hyd4.png',
    '/images/Hyd5.png',
];

const facts = [
    "Drinking water can boost your metabolism.",
    "Water helps regulate body temperature.",
    "Staying hydrated improves skin health.",
    "Proper hydration enhances cognitive function.",
    "Water aids in digestion and nutrient absorption.",
];

function Hydration({ isDarkMode }) {
    const [hydrationLevel, setHydrationLevel] = useState(1);
    const [isAnimating, setIsAnimating] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showFact, setShowFact] = useState(false);
    const [currentFact, setCurrentFact] = useState('');
    const [isAthletic, setIsAthletic] = useState(false);
    const [dailyGoal, setDailyGoal] = useState(0);
    const { width, height } = useWindowSize();

    useEffect(() => {
        fetchHydrationData();
    }, []);

    useEffect(() => {
        calculateDailyGoal();
    }, [isAthletic]);

    const fetchHydrationData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://lighthouse-portal.onrender.com/api/hydration', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setHydrationLevel(response.data.hydrationLevel);
            setIsAthletic(response.data.isAthletic);
            if (response.data.hydrationLevel === 5) setShowConfetti(true);
        } catch (error) {
            console.error('Error fetching hydration data:', error);
        }
    };

    const updateServerHydrationLevel = useCallback(async (newHydrationLevel, newIsAthletic) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                'https://lighthouse-portal.onrender.com/api/hydration',
                { hydrationLevel: newHydrationLevel, isAthletic: newIsAthletic },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (error) {
            console.error('Error updating hydration data:', error);
        }
    }, []);

    const calculateDailyGoal = () => {
        const goal = isAthletic ? 3.5 : 3.78541; // 3.5L for athletic, 1 gallon (3.78541L) for non-athletic
        setDailyGoal(goal);
    };

    const handleClick = () => {
        if (!isAnimating) {
            setIsAnimating(true);
            setHydrationLevel(prev => {
                let newLevel;
                if (prev === 5) {
                    newLevel = 1;
                    setShowConfetti(false);
                } else {
                    newLevel = prev + 1;
                    if (newLevel === 5) setShowConfetti(true);
                }
                updateServerHydrationLevel(newLevel, isAthletic);
                return newLevel;
            });
            showRandomFact();
            setTimeout(() => setIsAnimating(false), 300);
        }
    };

    const showRandomFact = () => {
        const randomFact = facts[Math.floor(Math.random() * facts.length)];
        setCurrentFact(randomFact);
        setShowFact(true);
        setTimeout(() => setShowFact(false), 5000);
    };

    const getHeadingText = () => {
        if (hydrationLevel === 5) {
            return 'Fully Hydrated! 😊💧';
        } else {
            return `Hydration Level: ${hydrationLevel}`;
        }
    };

    const handleUserTypeChange = (athletic) => {
        setIsAthletic(athletic);
        updateServerHydrationLevel(hydrationLevel, athletic);
    };

    return (
        <div className={`hydration-tracker ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            {showConfetti && (
                <Confetti
                    width={width}
                    height={height}
                    recycle={false}
                    numberOfPieces={200}
                    gravity={0.1}
                    colors={isDarkMode ? ['#ffffff', '#e0e0e0', '#bdbdbd', '#9e9e9e', '#757575'] : ['#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50']}
                />
            )}
            <h2 className="hydration-heading">{getHeadingText()}</h2>
            <div className="user-type-selector">
                <button 
                    className={`user-type-btn ${!isAthletic ? 'active' : ''}`} 
                    onClick={() => handleUserTypeChange(false)}
                >
                    Non-Athletic
                </button>
                <button 
                    className={`user-type-btn ${isAthletic ? 'active' : ''}`} 
                    onClick={() => handleUserTypeChange(true)}
                >
                    Athletic
                </button>
            </div>
            <p className="daily-goal">Daily Goal: {dailyGoal.toFixed(2)} L</p>
            <div className="image-container">
                <motion.img
                    src={images[hydrationLevel - 1]}
                    alt="Hydration level"
                    onClick={handleClick}
                    className="hydration-image"
                    animate={{ scale: isAnimating ? 1.1 : 1 }}
                    transition={{ duration: 0.3 }}
                />
            </div>
            <div className="progress-container">
                <div className="progress-bar" style={{ width: `${(hydrationLevel / 5) * 100}%` }}></div>
            </div>
            <p className="progress-text">{hydrationLevel} / 5 levels</p>
            <p className="progress-text">({((hydrationLevel / 5) * dailyGoal).toFixed(2)} L / {dailyGoal.toFixed(2)} L)</p>
            <AnimatePresence>
                {showFact && (
                    <motion.div
                        className="fact-box"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                    >
                        <p>{currentFact}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Hydration;