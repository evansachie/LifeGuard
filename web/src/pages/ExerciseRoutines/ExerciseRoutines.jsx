import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { workoutData, fitnessLevels } from '../../data/exercise-data';
import { workoutCategories } from '../../data/workout-categories';
import { GiWeightLiftingUp } from 'react-icons/gi';

import { useWorkoutTimer } from '../../hooks/useWorkoutTimer';

import ProgressOverview from '../../components/ExerciseRoutines/ProgressOverview';
import ExerciseCard from '../../components/ExerciseRoutines/ExerciseCard';
import WorkoutTimer from '../../components/ExerciseRoutines/WorkoutTimer';
import ModelSection from '../../components/ExerciseRoutines/ModelSection';

import './ExerciseRoutines.css';

function ExerciseRoutines({ isDarkMode }) {
  const [selectedLevel, setSelectedLevel] = useState('beginner');
  const [selectedCategory, setSelectedCategory] = useState('warmup');
  const [isLoading, setIsLoading] = useState(true);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [activeExercise, setActiveExercise] = useState(null);

  const { 
    workoutTimer, 
    isTimerRunning, 
    toggleTimer, 
    resetTimer, 
    setWorkoutTimer 
  } = useWorkoutTimer();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleExerciseClick = (exercise) => {
    setActiveExercise(exercise);
    setActiveWorkout(exercise);
    setWorkoutTimer(0);
    toggleTimer();
  };

  if (isLoading) {
    return (
      <div className={`exercise-loading ${isDarkMode ? 'dark-mode' : ''}`}>
        <GiWeightLiftingUp className="loading-icon" />
        <p>Preparing your workout routine...</p>
      </div>
    );
  }

  return (
    <div className={`exercise-routines-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="content-wrapper">
        <div className="exercises-section">
          <ProgressOverview />
          
          <section className="fitness-level-selection">
            {fitnessLevels.map(level => (
              <button
                key={level.id}
                className={`level-btn ${selectedLevel === level.id ? 'active' : ''}`}
                style={{ '--level-color': level.color }}
                onClick={() => setSelectedLevel(level.id)}
              >
                {level.label}
              </button>
            ))}
          </section>

          <section className="workout-categories">
            {workoutCategories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.icon}
                <span>{category.label}</span>
              </button>
            ))}
          </section>

          {activeWorkout && (
            <WorkoutTimer 
              activeWorkout={activeWorkout}
              workoutTimer={workoutTimer}
              isTimerRunning={isTimerRunning}
              onToggleTimer={toggleTimer}
              onResetTimer={resetTimer}
              onEndWorkout={() => setActiveWorkout(null)}
            />
          )}

          <motion.section 
            className="exercises-grid"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
            initial="hidden"
            animate="visible"
          >
            {workoutData[selectedLevel][selectedCategory]?.map(exercise => (
              <ExerciseCard 
                key={exercise.id}
                exercise={exercise}
                onExerciseStart={handleExerciseClick}
                activeWorkout={activeWorkout}
              />
            ))}
          </motion.section>
        </div>
        <ModelSection 
          activeExercise={activeExercise} 
          selectedCategory={selectedCategory} 
        />
      </div>
    </div>
  );
}

export default ExerciseRoutines;
