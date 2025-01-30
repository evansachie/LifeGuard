import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './BreathingCircle.css';
import { FaTimes } from 'react-icons/fa';

const BreathingCircle = ({ phase, pattern, onComplete, onClose }) => {
    const getAnimationProps = () => {
        switch (phase) {
            case 'inhale':
                return {
                    scale: [1, 2.5],
                    duration: pattern.inhale,
                    backgroundColor: ['#4CAF50', '#81C784']
                };
            case 'hold':
                return {
                    scale: 2.5,
                    duration: pattern.hold,
                    backgroundColor: '#81C784'
                };
            case 'exhale':
                return {
                    scale: [2.5, 1],
                    duration: pattern.exhale,
                    backgroundColor: ['#81C784', '#4CAF50']
                };
            case 'holdAfterExhale':
                return {
                    scale: 1,
                    duration: pattern.holdAfterExhale || 0,
                    backgroundColor: '#4CAF50'
                };
            default:
                return {};
        }
    };

    const { scale, duration, backgroundColor } = getAnimationProps();

    return (
        <div className="breathing-circle-container">
            <button 
                className="close-button"
                onClick={onClose}
            >
                <FaTimes />
            </button>
            <div className="breathing-instruction">
                <motion.span
                    key={phase}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="instruction-text"
                >
                    {phase.charAt(0).toUpperCase() + phase.slice(1)}
                </motion.span>
            </div>
            <motion.div
                className="breathing-circle"
                animate={{
                    scale,
                    backgroundColor
                }}
                transition={{
                    duration,
                    ease: "easeInOut",
                    times: [0, 1],
                    onComplete
                }}
            >
                <motion.div className="circle-ripple" />
            </motion.div>
            <div className="timer-display">
                <motion.span
                    key={`timer-${phase}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="timer-text"
                >
                    {duration}s
                </motion.span>
            </div>
        </div>
    );
};

export default BreathingCircle; 