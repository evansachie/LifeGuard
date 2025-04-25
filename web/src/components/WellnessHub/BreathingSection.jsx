import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { breathingPatterns } from '../../data/breathing-data';
import BreathingCircle from '../BreathingCircle/BreathingCircle';

const BreathingSection = ({ isDarkMode }) => {
  const [isBreathing, setIsBreathing] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [breathingPhase, setBreathingPhase] = useState('inhale');

  const startBreathing = (pattern) => {
    setSelectedPattern(pattern);
    setIsBreathing(true);
    setBreathingPhase('inhale');
  };

  const handlePhaseComplete = () => {
    setBreathingPhase((current) => {
      const phases = selectedPattern.pattern.holdAfterExhale
        ? ['inhale', 'hold', 'exhale', 'holdAfterExhale']
        : ['inhale', 'hold', 'exhale'];

      const currentIndex = phases.indexOf(current);
      return phases[(currentIndex + 1) % phases.length];
    });
  };

  return (
    <motion.div
      className="breathing-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2>Breathing Exercises</h2>
      <div className="breathing-patterns">
        {breathingPatterns.map((pattern) => (
          <motion.div
            key={pattern.id}
            className={`pattern-card ${selectedPattern?.id === pattern.id ? 'active' : ''}`}
            style={{ '--pattern-color': pattern.color }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="pattern-icon">{pattern.icon}</div>
            <h3>{pattern.name}</h3>
            <p>{pattern.description}</p>
            <button className="start-button" onClick={() => startBreathing(pattern)}>
              Start
            </button>
          </motion.div>
        ))}
      </div>
      {isBreathing && (
        <AnimatePresence>
          <BreathingCircle
            phase={breathingPhase}
            pattern={selectedPattern.pattern}
            onComplete={handlePhaseComplete}
            onClose={() => setIsBreathing(false)}
          />
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default BreathingSection;
