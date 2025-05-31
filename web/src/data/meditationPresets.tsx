import React from 'react';
import { MdTimer, MdTimerOff } from 'react-icons/md';
import { BsFillSunFill, BsFillMoonFill, BsStars } from 'react-icons/bs';
import { MeditationPreset } from '../types/wellnessHub.types';

export const meditationPresets: MeditationPreset[] = [
  {
    time: 300, // 5 minutes
    label: '5 Min',
    icon: <MdTimer />,
  },
  {
    time: 600, // 10 minutes
    label: '10 Min',
    icon: <BsFillSunFill />,
  },
  {
    time: 900, // 15 minutes
    label: '15 Min',
    icon: <BsStars />,
  },
  {
    time: 1200, // 20 minutes
    label: '20 Min',
    icon: <BsFillMoonFill />,
  },
  {
    time: 1800, // 30 minutes
    label: '30 Min',
    icon: <MdTimerOff />,
  },
];
