import React from 'react';
import { FaFire, FaHeartbeat, FaStopwatch } from 'react-icons/fa';
import { GiMuscleUp, GiMeditation } from 'react-icons/gi';

export interface WorkoutCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export const workoutCategories: WorkoutCategory[] = [
  { id: 'warmup', label: 'Warm-Up', icon: <FaHeartbeat /> },
  { id: 'cardio', label: 'Cardio', icon: <FaFire /> },
  { id: 'strength', label: 'Strength', icon: <GiMuscleUp /> },
  { id: 'hiit', label: 'HIIT', icon: <FaStopwatch /> },
  { id: 'cooldown', label: 'Cool Down', icon: <GiMeditation /> },
];
