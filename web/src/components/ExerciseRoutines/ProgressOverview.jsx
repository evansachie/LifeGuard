import React, { useEffect, useState } from 'react';
import { MdOutlineFitnessCenter } from "react-icons/md";
import { FaFire, FaDumbbell, FaTrophy } from 'react-icons/fa';
import { BiTargetLock } from 'react-icons/bi';
import StatsCard from './StatsCard';
import exerciseService from '../../services/exerciseService';

const ProgressOverview = () => {
  const [stats, setStats] = useState({
    caloriesBurned: 0,
    workoutsCompleted: 0,
    currentStreak: 0,
    currentGoal: 'Not set'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await exerciseService.getStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching exercise stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MdOutlineFitnessCenter className="text-3xl" />
          <h1 className="text-3xl font-semibold">Exercuse Routines</h1>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          icon={FaFire}
          title="Calories Burned"
          value={`${stats.caloriesBurned} kcal`}
          color="from-red-500 to-red-400"
        />
        <StatsCard 
          icon={FaDumbbell}
          title="Workouts Completed"
          value={`${stats.workoutsCompleted} this week`}
          color="from-blue-500 to-blue-400"
        />
        <StatsCard 
          icon={BiTargetLock}
          title="Current Goal"
          value={stats.currentGoal}
          color="from-cyan-500 to-cyan-400"
        />
        <StatsCard 
          icon={FaTrophy}
          title="Streak"
          value={`${stats.currentStreak} days`}
          color="from-amber-500 to-amber-400"
        />
      </div>
    </section>
  );
};

export default ProgressOverview;
