import React, { useEffect, useState } from 'react';
import { MdOutlineFitnessCenter } from 'react-icons/md';
import { FaFire, FaDumbbell, FaTrophy } from 'react-icons/fa';
import { BiTargetLock, BiChevronRight } from 'react-icons/bi';
import StatsCard from './StatsCard';
import exerciseService from '../../services/exerciseService';
import { toast } from 'react-toastify';
import GoalsModal from './GoalsModal';
import CaloriesModal from './CaloriesModal';
import WorkoutsModal from './WorkoutsModal';
import StreakModal from './StreakModal';

interface ExerciseStats {
  caloriesBurned: number;
  workoutsCompleted: number;
  currentStreak: number;
  currentGoal: string;
  [key: string]: string | number;
}

interface ProgressOverviewProps {
  isDarkMode: boolean;
}

const ProgressOverview: React.FC<ProgressOverviewProps> = ({ isDarkMode }) => {
  const [stats, setStats] = useState<ExerciseStats>({
    caloriesBurned: 0,
    workoutsCompleted: 0,
    currentStreak: 0,
    currentGoal: 'Not set',
  });
  const [, setLoading] = useState<boolean>(true);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState<boolean>(false);
  const [isCaloriesModalOpen, setIsCaloriesModalOpen] = useState<boolean>(false);
  const [isWorkoutsModalOpen, setIsWorkoutsModalOpen] = useState<boolean>(false);
  const [isStreakModalOpen, setIsStreakModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchStats = async (): Promise<void> => {
      try {
        const data = await exerciseService.getStats();
        const transformedData: ExerciseStats = {
          caloriesBurned: data.totalCaloriesBurned || 0,
          workoutsCompleted: data.totalWorkouts || 0,
          currentStreak: data.currentStreak || 0,
          currentGoal: data.goalType || 'Not set',
        };
        setStats(transformedData);
      } catch (error) {
        console.error('Error fetching exercise stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleGoalSelect = async (goalType: string): Promise<void> => {
    try {
      await exerciseService.setGoal(goalType);
      setStats((prev) => ({ ...prev, currentGoal: goalType }));
      toast.success('Workout goal updated successfully!');
    } catch (error) {
      console.error('Error setting goal:', error);
      toast.error('Failed to update workout goal');
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MdOutlineFitnessCenter className="text-3xl" />
          <h1 className="text-3xl font-semibold">Exercise Routines</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={FaFire}
          title="Calories Burned"
          value={`${stats.caloriesBurned} kcal`}
          color="from-red-500 to-red-400"
          onClick={() => setIsCaloriesModalOpen(true)}
          clickable={true}
          suffixIcon={BiChevronRight}
          hoverText="Click for detailed stats"
        />
        <StatsCard
          icon={FaDumbbell}
          title="Workouts Completed"
          value={`${stats.workoutsCompleted} this week`}
          color="from-blue-500 to-blue-400"
          onClick={() => setIsWorkoutsModalOpen(true)}
          clickable={true}
          suffixIcon={BiChevronRight}
          hoverText="Click for workout history"
        />
        <StatsCard
          icon={BiTargetLock}
          title="Current Goal"
          value={stats.currentGoal}
          color="from-cyan-500 to-cyan-400"
          onClick={() => setIsGoalModalOpen(true)}
          clickable={true}
          suffixIcon={BiChevronRight}
          hoverText="Click to change goal"
        />
        <StatsCard
          icon={FaTrophy}
          title="Streak"
          value={`${stats.currentStreak} days`}
          color="from-amber-500 to-amber-400"
          onClick={() => setIsStreakModalOpen(true)}
          clickable={true}
          suffixIcon={BiChevronRight}
          hoverText="Click to view streak details"
        />
      </div>

      <GoalsModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onSelectGoal={handleGoalSelect}
        isDarkMode={isDarkMode}
      />

      <CaloriesModal
        isOpen={isCaloriesModalOpen}
        onClose={() => setIsCaloriesModalOpen(false)}
        isDarkMode={isDarkMode}
      />

      <WorkoutsModal
        isOpen={isWorkoutsModalOpen}
        onClose={() => setIsWorkoutsModalOpen(false)}
        isDarkMode={isDarkMode}
      />

      <StreakModal
        isOpen={isStreakModalOpen}
        onClose={() => setIsStreakModalOpen(false)}
        isDarkMode={isDarkMode}
      />
    </section>
  );
};

export default ProgressOverview;
