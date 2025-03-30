import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaPause, FaRedo, FaStopCircle } from 'react-icons/fa';
import exerciseService from '../../services/exerciseService';

const WorkoutTimer = ({ activeWorkout, workoutTimer, isTimerRunning, onToggleTimer, onResetTimer, onEndWorkout }) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  
  useEffect(() => {
    if (activeWorkout) {
      const durationParts = activeWorkout.duration.split(' ');
      const minutes = parseInt(durationParts[0]);
      const totalSeconds = minutes * 60;
      setTimeRemaining(Math.max(0, totalSeconds - workoutTimer));
    }
  }, [activeWorkout, workoutTimer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeRemaining < 60) return 'text-red-500';
    if (timeRemaining < 180) return 'text-amber-500';
    return 'text-white';
  };

  const handleEndWorkout = async () => {
    try {
      await exerciseService.completeWorkout({
        workout_id: activeWorkout.id,
        workout_type: activeWorkout.title,
        calories_burned: activeWorkout.calories,
        duration_minutes: parseInt(activeWorkout.duration)
      });
      
      onEndWorkout();
      // Optionally trigger a refresh of the ProgressOverview stats
    } catch (error) {
      console.error('Error completing workout:', error);
      // Handle error (show toast notification, etc.)
    }
  };

  return (
    <motion.div 
      className="relative bg-gradient-to-r from-red-500 to-pink-500 rounded-xl p-5 text-white shadow-lg"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h3 className="text-sm font-medium opacity-90">Current Workout</h3>
          <h2 className="text-xl font-bold mt-1">{activeWorkout?.title}</h2>
          <p className="text-sm opacity-80 mt-1">
            Target: {activeWorkout?.targetMuscles.join(', ')}
          </p>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="relative w-28 h-28">
            <svg className="w-full h-full" viewBox="0 0 120 120">
              <circle 
                cx="60" 
                cy="60" 
                r="54" 
                fill="none" 
                stroke="rgba(255, 255, 255, 0.1)" 
                strokeWidth="12" 
              />
              {activeWorkout && (
                <motion.circle 
                  cx="60" 
                  cy="60" 
                  r="54" 
                  fill="none" 
                  stroke="rgba(255, 255, 255, 0.8)" 
                  strokeWidth="12" 
                  strokeDasharray="339.292"
                  strokeDashoffset={339.292 * (1 - workoutTimer / (parseInt(activeWorkout.duration) * 60))}
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: 339.292 }}
                  animate={{ strokeDashoffset: 339.292 * (1 - workoutTimer / (parseInt(activeWorkout.duration) * 60)) }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div 
                className={`text-3xl font-bold font-mono ${getTimerColor()}`}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
              >
                {formatTime(workoutTimer)}
              </motion.div>
              <div className="text-xs mt-1 opacity-80">
                {timeRemaining > 0 ? `${formatTime(timeRemaining)} left` : 'Completed!'}
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 mt-4">
            <motion.button 
              className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all"
              onClick={onToggleTimer}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isTimerRunning ? <FaPause /> : <FaPlay />}
            </motion.button>
            <motion.button 
              className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all"
              onClick={onResetTimer}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaRedo />
            </motion.button>
            <motion.button 
              className="w-12 h-12 rounded-full bg-red-500/30 flex items-center justify-center hover:bg-red-500/50 transition-all"
              onClick={() => setShowConfirm(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaStopCircle />
            </motion.button>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {showConfirm && (
          <motion.div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-xl flex items-center justify-center p-6 z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className="bg-white rounded-xl p-6 max-w-xs w-full text-center">
              <p className="text-gray-800 text-lg font-medium mb-6">Are you sure you want to end this workout?</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  className="flex-1 py-2 px-4 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-colors"
                  onClick={handleEndWorkout}
                >
                  Yes, End Workout
                </button>
                <button 
                  className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-full font-medium hover:bg-gray-300 transition-colors"
                  onClick={() => setShowConfirm(false)}
                >
                  Continue
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default WorkoutTimer;
