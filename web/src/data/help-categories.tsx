import React from 'react';
import { FaHeart, FaDumbbell, FaBook, FaUserMd } from 'react-icons/fa';

interface HelpSection {
  title: string;
  content: string;
}

export interface HelpCategory {
  id: string;
  icon: React.ReactNode;
  title: string;
  color: string;
  sections: HelpSection[];
}

export const helpCategories: HelpCategory[] = [
  {
    id: 'getting-started',
    icon: <FaBook />,
    title: 'Getting Started',
    color: 'text-blue-500',
    sections: [
      {
        title: 'Welcome to LifeGuard',
        content:
          'LifeGuard is your personal health and fitness companion, designed to help you maintain a healthy lifestyle and respond to emergencies.',
      },
      {
        title: 'Setting Up Your Profile',
        content:
          'Complete your profile with health information, emergency contacts, and fitness goals to get personalized recommendations.',
      },
      {
        title: 'Navigation Guide',
        content:
          'Learn how to navigate through different sections: Exercise Routines, Health Tips, Emergency Contacts, and Settings.',
      },
    ],
  },
  {
    id: 'exercise-routines',
    icon: <FaDumbbell />,
    title: 'Exercise Routines',
    color: 'text-green-500',
    sections: [
      {
        title: 'Understanding Workout Categories',
        content:
          'Explore different workout categories tailored to your fitness level: Beginner, Intermediate, and Advanced.',
      },
      {
        title: 'Using the 3D Model',
        content:
          'Learn how to use the interactive 3D muscle model to understand which muscles are targeted in each exercise.',
      },
      {
        title: 'Creating Custom Workouts',
        content:
          'Create and save your own workout routines by combining exercises from our extensive library.',
      },
    ],
  },
  {
    id: 'health-monitoring',
    icon: <FaHeart />,
    title: 'Health Monitoring',
    color: 'text-red-500',
    sections: [
      {
        title: 'Vital Signs Tracking',
        content:
          'Monitor your heart rate, blood pressure, and other vital signs to maintain optimal health.',
      },
      {
        title: 'Health Alerts',
        content:
          'Understand how our health alert system works to notify you and your emergency contacts during health anomalies.',
      },
      {
        title: 'Progress Tracking',
        content:
          'Track your fitness progress, including workout completion, calories burned, and health improvements.',
      },
    ],
  },
  {
    id: 'emergency-features',
    icon: <FaUserMd />,
    title: 'Emergency Features',
    color: 'text-yellow-500',
    sections: [
      {
        title: 'Emergency Contact Management',
        content:
          'Learn how to add and manage emergency contacts who will be notified in case of health emergencies.',
      },
      {
        title: 'Quick Response System',
        content:
          'Understand how to use the one-tap emergency alert feature to notify your contacts immediately.',
      },
      {
        title: 'Location Services',
        content:
          'Enable location services to help emergency responders locate you quickly during emergencies.',
      },
    ],
  },
];
