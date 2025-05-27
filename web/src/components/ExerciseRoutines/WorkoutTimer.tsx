import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaPause, FaRedo, FaStopCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AccessibleDropdown from '../AccessibleDropdown/AccessibleDropdown';
import exerciseService from '../../services/exerciseService';
import { formatTime } from '../../utils/formatTime';

interface Exercise {
  id: string | number;
  title: string;
  duration: string;
  calories: number;
  targetMuscles: string[];
}

interface WorkoutTimerProps {
  activeWorkout: Exercise | null;
  workoutTimer: number;
  isTimerRunning: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onEndWorkout: () => void;
  isDarkMode: boolean;
}

const WorkoutTimer: React.FC<WorkoutTimerProps> = ({
  activeWorkout,
  workoutTimer,
  isTimerRunning,
  onToggleTimer,
  onResetTimer,
  onEndWorkout,
  isDarkMode,
}) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  useEffect(() => {
    if (activeWorkout) {
      const durationParts = activeWorkout.duration.split(' ');
      const minutes = parseInt(durationParts[0]);
      const totalSeconds = minutes * 60;
      setTimeRemaining(Math.max(0, totalSeconds - workoutTimer));
    }
  }, [activeWorkout, workoutTimer]);

  useEffect(() => {
    if (activeWorkout && timeRemaining === 0 && isTimerRunning) {
      handleWorkoutComplete(true);
      onToggleTimer();
    }
  }, [timeRemaining, activeWorkout, isTimerRunning, onToggleTimer]);

  const getTimerColor = (): string => {
    if (timeRemaining < 60) return 'text-white';
    if (timeRemaining < 180) return 'text-amber-500';
    return 'text-white';
  };

  const calculateCompletionStats = (): { completionPercentage: number; adjustedCalories: number; duration: number } => {
    if (!activeWorkout) {
      return { completionPercentage: 0, adjustedCalories: 0, duration: 0 };
    }
    
    const durationParts = activeWorkout.duration.split(' ');
    const minutes = parseInt(durationParts[0]);
    const totalSeconds = minutes * 60;
    const completionPercentage = (workoutTimer / totalSeconds) * 100;
    const adjustedCalories = Math.floor((workoutTimer / totalSeconds) * activeWorkout.calories);

    return {
      completionPercentage,
      adjustedCalories,
      duration: Math.floor(workoutTimer / 60),
    };
  };

  const handleWorkoutComplete = async (isFullyCompleted = false): Promise<boolean> => {
    if (!activeWorkout) return false;
    
    try {
      const stats = calculateCompletionStats();

      if (!isFullyCompleted && stats.completionPercentage < 80) {
        toast.warn('You need to complete at least 80% of the workout for it to count!');
        return false;
      }

      // Stop the timer first
      if (isTimerRunning) {
        onToggleTimer();
      }

      await exerciseService.completeWorkout({
        workout_id: String(activeWorkout.id),
        workout_type: activeWorkout.title,
        calories_burned: stats.adjustedCalories,
        duration_minutes: stats.duration,
      });

      if (isFullyCompleted) {
        toast.success('🎉 Workout completed successfully!');
      } else {
        toast.info(`Workout ended at ${Math.round(stats.completionPercentage)}% completion`);
      }

      onEndWorkout();
      return true;
    } catch (error) {
      console.error('Error completing workout:', error);
      toast.error('Failed to save workout progress');
      return false;
    }
  };

  const handleEndWorkout = async (): Promise<void> => {
    if (!activeWorkout) return;
    
    try {
      const stats = calculateCompletionStats();

      if (stats.completionPercentage < 80) {
        toast.warn('You need to complete at least 80% of the workout for it to count!');
        setShowConfirm(false);
        return;
      }

      await exerciseService.completeWorkout({
        workout_id: String(activeWorkout.id),
        workout_type: activeWorkout.title,
        calories_burned: stats.adjustedCalories,
        duration_minutes: stats.duration,
      });

      // Stop the timer before closing
      if (isTimerRunning) {
        onToggleTimer();
      }

      toast.info(`Workout ended at ${Math.round(stats.completionPercentage)}% completion`);
      setShowConfirm(false);
      onEndWorkout();
    } catch (error) {
      console.error('Error completing workout:', error);
      toast.error('Failed to save workout progress');
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
                  strokeDashoffset={
                    339.292 * (1 - workoutTimer / (parseInt(activeWorkout.duration) * 60))
                  }
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: 339.292 }}
                  animate={{
                    strokeDashoffset:
                      339.292 * (1 - workoutTimer / (parseInt(activeWorkout.duration) * 60)),
                  }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                className={`text-3xl font-bold font-mono ${getTimerColor()}`}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
              >
                {formatTime(workoutTimer)}
              </motion.div>
              <div className="text-xs mt-1 opacity-80">
                {timeRemaining > 0 ? `${formatTime(timeRemaining)} left` : 'Completed!'}
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <AccessibleDropdown
              isOpen={isTimerRunning}
              onToggle={onToggleTimer}
              ariaLabel={isTimerRunning ? 'Pause workout' : 'Start workout'}
              className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all"
            >
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                {isTimerRunning ? <FaPause /> : <FaPlay />}
              </motion.div>
            </AccessibleDropdown>

            <AccessibleDropdown
              isOpen={false}
              onToggle={onResetTimer}
              ariaLabel="Reset workout timer"
              className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all"
            >
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <FaRedo />
              </motion.div>
            </AccessibleDropdown>

            <AccessibleDropdown
              isOpen={false}
              onToggle={() => setShowConfirm(true)}
              ariaLabel="End workout"
              className="w-12 h-12 rounded-full bg-red-500/30 flex items-center justify-center hover:bg-red-500/50 transition-all"
            >
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <FaStopCircle />
              </motion.div>
            </AccessibleDropdown>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowConfirm(false)}
              role="presentation"
            />
            <motion.div
              className={`relative max-w-md w-full m-4 ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              } rounded-xl p-6 shadow-xl`}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <p
                className={`text-lg font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
              >
                Are you sure you want to end this workout early?
              </p>
              <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                You need to complete at least 80% of the workout for it to count towards your
                progress.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  className="flex-1 py-2 px-4 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-colors"
                  onClick={handleEndWorkout}
                >
                  Yes, End Workout
                </button>
                <button
                  className={`flex-1 py-2 px-4 ${
                    isDarkMode
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  } rounded-full font-medium transition-colors`}
                  onClick={() => setShowConfirm(false)}
                >
                  Continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default WorkoutTimer;
