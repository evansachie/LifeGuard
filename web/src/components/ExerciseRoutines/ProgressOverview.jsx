import React from 'react';
import { MdOutlineFitnessCenter } from "react-icons/md";
import { FaFire, FaDumbbell, FaTrophy } from 'react-icons/fa';
import { BiTargetLock } from 'react-icons/bi';
import StatsCard from './StatsCard';

const ProgressOverview = () => {
  
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
          value="324 kcal"
          color="from-red-500 to-red-400"
        />
        <StatsCard 
          icon={FaDumbbell}
          title="Workouts Completed"
          value="12 this week"
          color="from-blue-500 to-blue-400"
        />
        <StatsCard 
          icon={BiTargetLock}
          title="Current Goal"
          value="Build Strength"
          color="from-cyan-500 to-cyan-400"
        />
        <StatsCard 
          icon={FaTrophy}
          title="Streak"
          value="5 days"
          color="from-amber-500 to-amber-400"
        />
      </div>
    </section>
  );
};

export default ProgressOverview;
