import React from 'react';
import { FaFire, FaDumbbell } from 'react-icons/fa';
import { BiTargetLock } from 'react-icons/bi';
import StatsCard from './StatsCard';

const ProgressOverview = () => {
  return (
    <section className="progress-overview">
      <StatsCard 
        icon={FaFire}
        title="Calories Burned"
        value="324 kcal"
      />
      <StatsCard 
        icon={FaDumbbell}
        title="Workouts Completed"
        value="12 this week"
      />
      <StatsCard 
        icon={BiTargetLock}
        title="Current Goal"
        value="Build Strength"
      />
    </section>
  );
};

export default ProgressOverview;
