import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { workoutData, fitnessLevels } from '../../data/exercise-data';
import { workoutCategories } from '../../data/workout-categories';
import { GiWeightLiftingUp } from 'react-icons/gi';
import { FaChevronRight, FaChevronLeft, FaInfoCircle } from 'react-icons/fa';

import { useWorkoutTimer } from '../../hooks/useWorkoutTimer';

import ProgressOverview from '../../components/ExerciseRoutines/ProgressOverview';
import ExerciseCard from '../../components/ExerciseRoutines/ExerciseCard';
import WorkoutTimer from '../../components/ExerciseRoutines/WorkoutTimer';
import ModelSection from '../../components/ExerciseRoutines/ModelSection';

function ExerciseRoutines({ isDarkMode }) {
  const [selectedLevel, setSelectedLevel] = useState('beginner');
  const [selectedCategory, setSelectedCategory] = useState('warmup');
  const [isLoading, setIsLoading] = useState(true);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [activeExercise, setActiveExercise] = useState(null);
  const [showTip, setShowTip] = useState(true);
  const [workoutProgress, setWorkoutProgress] = useState(0);

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

  useEffect(() => {
    if (activeWorkout && isTimerRunning) {
      // Update progress based on workout duration
      const duration = parseInt(activeWorkout.duration.split(' ')[0]) * 60;
      const progress = Math.min((workoutTimer / duration) * 100, 100);
      setWorkoutProgress(progress);
    }
  }, [workoutTimer, activeWorkout, isTimerRunning]);

  const handleExerciseClick = (exercise) => {
    setActiveExercise(exercise);
    setActiveWorkout(exercise);
    setWorkoutProgress(0);
    setWorkoutTimer(0);
    toggleTimer();
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    // Reset active workout when changing categories
    if (activeWorkout) {
      setActiveWorkout(null);
      setActiveExercise(null);
      resetTimer();
    }
  };

  if (isLoading) {
    return (
      <div className={`flex flex-col items-center justify-center h-screen ${isDarkMode ? 'bg-dark-bg text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
        <GiWeightLiftingUp className="text-6xl text-blue-500 animate-bounce" />
        <p className="mt-4 text-lg">Preparing your workout routine...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-dark-bg text-gray-100' : 'bg-light-bg text-gray-800'}`}>
      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
        {/* Header Section with Progress Overview */}
        <div className="mb-8">
          <ProgressOverview />
        </div>
        
        {/* Workout Tip - Conditional */}
        <AnimatePresence>
          {showTip && (
            <motion.div 
              className={`rounded-xl p-4 mb-6 ${isDarkMode ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-gradient-to-r from-blue-500 to-blue-400'} text-white shadow-lg`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FaInfoCircle className="text-xl flex-shrink-0" />
                  <p className="text-sm text-white">For best results, complete at least 3 workouts per week and maintain proper form.</p>
                </div>
                <button 
                  className="rounded-full w-6 h-6 bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all transform hover:rotate-90"
                  onClick={() => setShowTip(false)}
                >
                  ×
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Controls Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Fitness Level Selection */}
          <div className={`rounded-xl p-5 ${isDarkMode ? 'bg-dark-card' : 'bg-white'} shadow-md`}>
            <h2 className="text-xl font-semibold mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">Fitness Level</h2>
            <div className="flex flex-wrap gap-3">
              {fitnessLevels.map(level => (
                <button
                  key={level.id}
                  className={`px-4 py-2 rounded-full border-2 font-medium transition-all ${
                    selectedLevel === level.id 
                      ? `bg-[${level.color}] text-white border-[${level.color}]` 
                      : `border-[${level.color}] text-[${level.color}] hover:bg-[${level.color}]/10`
                  }`}
                  style={{ 
                    '--tw-border-opacity': 1,
                    borderColor: level.color,
                    color: selectedLevel === level.id ? 'white' : level.color,
                    backgroundColor: selectedLevel === level.id ? level.color : 'transparent'
                  }}
                  onClick={() => setSelectedLevel(level.id)}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Workout Categories */}
          <div className={`rounded-xl p-5 ${isDarkMode ? 'bg-dark-card' : 'bg-white'} shadow-md`}>
            <h2 className="text-xl font-semibold mb-3">Workout Type</h2>
            <div className="relative flex items-center">
              <button className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-2 ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} hover:bg-blue-500 hover:text-white transition-colors`}>
                <FaChevronLeft className="text-sm" />
              </button>
              <div className="flex space-x-4 overflow-x-auto py-2 scrollbar-hide">
                {workoutCategories.map(category => (
                  <button
                    key={category.id}
                    className={`flex flex-col items-center p-3 min-w-[100px] rounded-lg transition-all ${
                      selectedCategory === category.id
                        ? isDarkMode 
                          ? 'bg-gradient-to-r from-gray-800 to-gray-700 text-white'
                          : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white'
                        : `${isDarkMode ? 'bg-dark-card2 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'} shadow`
                    } shadow-lg transform hover:-translate-y-1`}
                    onClick={() => handleCategoryChange(category.id)}
                  >
                    <div className="text-2xl mb-1">{category.icon}</div>
                    <span className="text-sm font-medium">{category.label}</span>
                  </button>
                ))}
              </div>
              <button className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ml-2 ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} hover:bg-blue-500 hover:text-white transition-colors`}>
                <FaChevronRight className="text-sm" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Active Workout Timer */}
        {activeWorkout && (
          <div className="mb-6">
            <WorkoutTimer 
              activeWorkout={activeWorkout}
              workoutTimer={workoutTimer}
              isTimerRunning={isTimerRunning}
              onToggleTimer={toggleTimer}
              onResetTimer={resetTimer}
              onEndWorkout={() => {
                setActiveWorkout(null);
                setWorkoutProgress(0);
              }}
            />
            <div className="mt-3 px-1">
              <div className="flex justify-between mb-2 text-sm font-medium">
                <span>Workout Progress</span>
                <span>{Math.round(workoutProgress)}%</span>
              </div>
              <div className={`h-2 w-full rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <motion.div 
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${workoutProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Exercise Grid with Integrated 3D Model */}
        <motion.div 
          className={`rounded-xl ${isDarkMode ? 'bg-dark-card' : 'bg-white'} shadow-md overflow-hidden`}
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
          <h2 className="text-xl font-semibold p-5 border-b border-gray-200 dark:border-gray-700">Available Exercises</h2>
          
          <div className="flex flex-col lg:flex-row">
            {/* Exercise Card - Left side */}
            <div className="lg:w-1/2 p-5">
              {workoutData[selectedLevel][selectedCategory]?.length > 0 && (
                <ExerciseCard 
                  exercise={workoutData[selectedLevel][selectedCategory][0]}
                  onExerciseStart={handleExerciseClick}
                  activeWorkout={activeWorkout}
                  isDarkMode={isDarkMode}
                  showModel={false}
                />
              )}
            </div>
            
            {/* 3D Model - Right side */}
            <div className="lg:w-1/2 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700">
              <ModelSection 
                activeExercise={activeExercise} 
                selectedCategory={selectedCategory} 
                isDarkMode={isDarkMode}
              />
            </div>
          </div>
          
          {/* Additional Exercises */}
          {workoutData[selectedLevel][selectedCategory]?.length > 1 && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-5">
              <h3 className="text-lg font-medium mb-4">More Exercises</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {workoutData[selectedLevel][selectedCategory]?.slice(1).map(exercise => (
                  <ExerciseCard 
                    key={exercise.id}
                    exercise={exercise}
                    onExerciseStart={handleExerciseClick}
                    activeWorkout={activeWorkout}
                    isDarkMode={isDarkMode}
                    showModel={false}
                    compact={true}
                  />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default ExerciseRoutines;
