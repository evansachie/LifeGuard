import React from 'react';
import { FaLeaf, FaMountain, FaWind, FaSquare } from 'react-icons/fa';

export interface BreathingPattern {
  id: string;
  name: string;
  description: string;
  pattern: {
    inhale: number;
    hold: number;
    exhale: number;
    holdAfterExhale?: number;
  };
  icon: React.ReactNode;
  color: string;
}

export const breathingPatterns: BreathingPattern[] = [
  {
    id: '1',
    name: '4-7-8 Technique',
    description: 'Breathe in for 4 seconds, hold for 7, exhale for 8.',
    pattern: {
      inhale: 4,
      hold: 7,
      exhale: 8,
    },
    icon: <FaLeaf />,
    color: '#4CAF50',
  },
  {
    id: '2',
    name: 'Box Breathing',
    description: 'Equal duration for inhale, hold, exhale, and hold after exhale.',
    pattern: {
      inhale: 4,
      hold: 4,
      exhale: 4,
      holdAfterExhale: 4,
    },
    icon: <FaSquare />,
    color: '#2196F3',
  },
  {
    id: '3',
    name: 'Deep Breathing',
    description: 'Long, deep inhales and exhales to calm the nervous system.',
    pattern: {
      inhale: 5,
      hold: 2,
      exhale: 5,
    },
    icon: <FaMountain />,
    color: '#9C27B0',
  },
  {
    id: '4',
    name: 'Relaxing Breath',
    description: 'Short inhale, long exhale to promote relaxation.',
    pattern: {
      inhale: 3,
      hold: 0,
      exhale: 6,
    },
    icon: <FaWind />,
    color: '#FF9800',
  },
];