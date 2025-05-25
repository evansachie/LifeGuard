import { useState, useEffect } from 'react';

interface WorkoutTimerResult {
  workoutTimer: number;
  isTimerRunning: boolean;
  toggleTimer: () => void;
  resetTimer: () => void;
  setWorkoutTimer: React.Dispatch<React.SetStateAction<number>>;
}

export const useWorkoutTimer = (): WorkoutTimerResult => {
  const [workoutTimer, setWorkoutTimer] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setWorkoutTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const toggleTimer = (): void => setIsTimerRunning(!isTimerRunning);
  const resetTimer = (): void => setWorkoutTimer(0);

  return {
    workoutTimer,
    isTimerRunning,
    toggleTimer,
    resetTimer,
    setWorkoutTimer,
  };
};
