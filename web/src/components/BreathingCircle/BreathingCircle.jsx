import React from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { getAnimationProps } from '../../utils/getAnimationProps';
import './BreathingCircle.css';

const BreathingCircle = ({ phase, onComplete, onClose }) => {
  const { scale, duration, backgroundColor } = getAnimationProps();

  return (
    <div className="breathing-circle-container">
      <button className="close-button" onClick={onClose}>
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
          backgroundColor,
        }}
        transition={{
          duration,
          ease: 'easeInOut',
          times: [0, 1],
          onComplete,
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
