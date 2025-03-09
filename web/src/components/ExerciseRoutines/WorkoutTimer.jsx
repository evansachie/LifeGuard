import React from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaPause, FaRedo } from 'react-icons/fa';

const WorkoutTimer = ({ activeWorkout, workoutTimer, isTimerRunning, onToggleTimer, onResetTimer, onEndWorkout }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.section 
      className="active-workout"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="workout-timer">
        <h3>Current Workout</h3>
        <div className="timer-display">{formatTime(workoutTimer)}</div>
        <div className="timer-controls">
          <button onClick={onToggleTimer}>
            {isTimerRunning ? <FaPause /> : <FaPlay />}
          </button>
          <button onClick={onResetTimer}><FaRedo /></button>
        </div>
      </div>
      <button className="end-workout" onClick={onEndWorkout}>
        End Workout
      </button>
    </motion.section>
  );
};

export default WorkoutTimer;
