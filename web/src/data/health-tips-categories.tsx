import React from 'react';
import { FaRunning, FaBrain, FaYoutube, FaBookMedical } from 'react-icons/fa';
import { MdHealthAndSafety, MdRestaurant } from 'react-icons/md';

export interface HealthCategory {
  id: string;
  icon: React.ReactNode;
  label: string;
}

export const categories: HealthCategory[] = [
  { id: 'fitness', icon: <FaRunning />, label: 'Fitness' },
  { id: 'mental', icon: <FaBrain />, label: 'Mental Health' },
  { id: 'nutrition', icon: <MdRestaurant />, label: 'Nutrition' },
  { id: 'prevention', icon: <MdHealthAndSafety />, label: 'Prevention' },
  { id: 'resources', icon: <FaBookMedical />, label: 'Resources' },
  { id: 'videos', icon: <FaYoutube />, label: 'Videos' },
];
