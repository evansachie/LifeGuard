import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaPause, FaRedo } from 'react-icons/fa';
import { meditationPresets } from '../../utils/meditationPresets';
import { formatTime } from '../../utils/formatTime';

const MeditationSection = ({ isDarkMode }) => {
    const [meditationTime, setMeditationTime] = useState(600);
    const [currentTime, setCurrentTime] = useState(600);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const timerRef = useRef(null);

    const toggleTimer = () => {
        if (isTimerRunning) {
            clearInterval(timerRef.current);
        } else {
            timerRef.current = setInterval(() => {
                setCurrentTime((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        setIsTimerRunning(!isTimerRunning);
    };

    return (
        <motion.div
            className="meditation-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <h2>Meditation Timer</h2>
            <div className="timer-display">
                <div className="time">{formatTime(currentTime)}</div>
                <div className="timer-controls">
                    <button onClick={toggleTimer}>
                        {isTimerRunning ? <FaPause /> : <FaPlay />}
                    </button>
                    <button onClick={() => setCurrentTime(meditationTime)}>
                        <FaRedo />
                    </button>
                </div>
            </div>
            <div className="meditation-presets">
                {meditationPresets.map((preset) => (
                    <button
                        key={preset.time}
                        className={`preset-button ${meditationTime === preset.time ? 'active' : ''}`}
                        onClick={() => {
                            setMeditationTime(preset.time);
                            setCurrentTime(preset.time);
                        }}
                    >
                        {preset.icon}
                        <span>{preset.label}</span>
                    </button>
                ))}
            </div>
        </motion.div>
    );
};

export default MeditationSection;
