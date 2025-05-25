import React from 'react';
import { BsClock } from 'react-icons/bs';

interface MeditationPreset {
  time: number;
  label: string;
  icon: React.ReactNode;
}

export const meditationPresets: MeditationPreset[] = [
  { time: 300, label: '5 minutes', icon: <BsClock /> },
  { time: 600, label: '10 minutes', icon: <BsClock /> },
  { time: 900, label: '15 minutes', icon: <BsClock /> },
  { time: 1200, label: '20 minutes', icon: <BsClock /> },
];
