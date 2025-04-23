import { useState, useEffect } from 'react';

export const useWorkoutTimer = () => {
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setWorkoutTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const toggleTimer = () => setIsTimerRunning(!isTimerRunning);
  const resetTimer = () => setWorkoutTimer(0);

  return {
    workoutTimer,
    isTimerRunning,
    toggleTimer,
    resetTimer,
    setWorkoutTimer,
  };
};
