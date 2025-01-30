import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaDumbbell, FaFire, FaHeartbeat, FaStopwatch, FaPlay, FaPause, FaRedo } from 'react-icons/fa';
import { GiMuscleUp, GiWeightLiftingUp, GiMeditation } from 'react-icons/gi';
import { BiTargetLock } from 'react-icons/bi';
import './ExerciseRoutines.css';
import { workoutData } from '../../data/exercise-data';

// 3D Model Component
const MODEL_URL = import.meta.env.VITE_MODEL_URL;

const fitnessLevels = [
  { id: 'beginner', label: 'Beginner', color: '#4CAF50' },
  { id: 'intermediate', label: 'Intermediate', color: '#FF9800' },
  { id: 'advanced', label: 'Advanced', color: '#f44336' }
];

const workoutCategories = [
  { id: 'warmup', label: 'Warm-Up', icon: <FaHeartbeat /> },
  { id: 'cardio', label: 'Cardio', icon: <FaFire /> },
  { id: 'strength', label: 'Strength', icon: <GiMuscleUp /> },
  { id: 'hiit', label: 'HIIT', icon: <FaStopwatch /> },
  { id: 'cooldown', label: 'Cool Down', icon: <GiMeditation /> }
];

const categoryAnnotationMap = {
  warmup: 7,
  cardio: 4,
  strength: 9,
  hiit: 1, 
  cooldown: 7
};

const ModelSection = ({ activeExercise, selectedCategory }) => {
  useEffect(() => {
    const iframe = document.querySelector('.model-container iframe');
    if (!iframe || !selectedCategory) return;

    const annotation = categoryAnnotationMap[selectedCategory];
    console.log('Selected annotation:', annotation);
    
    // Update iframe src with single annotation
    iframe.src = `${MODEL_URL}&annotation=${annotation}`;

    const highlightMuscles = () => {
      iframe.contentWindow.postMessage({
        type: 'callMethod',
        data: {
          method: 'clearAnnotations'
        }
      }, '*');

      // Then highlight target muscles
      targetMuscles.forEach(muscle => {
        iframe.contentWindow.postMessage({
          type: 'callMethod',
          data: {
            method: 'showAnnotation',
            args: [muscle]
          }
        }, '*');
      });
    };

    const attempts = [0, 1000, 2000, 3000]; 
    attempts.forEach(delay => {
      setTimeout(highlightMuscles, delay);
    });

    const handleMessage = (event) => {
      if (event.data === 'viewerready') {
        highlightMuscles();
      }
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [activeExercise, selectedCategory]);

  return (
    <div className="model-section">
      <div className="model-container">
        <iframe
          title="3D Muscle Model"
          src={MODEL_URL}
          allowFullScreen
          mozallowfullscreen="true"
          webkitallowfullscreen="true"
        />
      </div>
    </div>
  );
};

function ExerciseRoutines({ isDarkMode }) {
  const [selectedLevel, setSelectedLevel] = useState('beginner');
  const [selectedCategory, setSelectedCategory] = useState('warmup');
  const [isLoading, setIsLoading] = useState(true);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [activeExercise, setActiveExercise] = useState(null);

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setWorkoutTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const handleExerciseClick = (exercise) => {
    setActiveExercise(exercise);
    setActiveWorkout(exercise);
    setWorkoutTimer(0);
    setIsTimerRunning(true);
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
          {/* Progress Overview */}
          <section className="progress-overview">
            <motion.div 
              className="stats-card"
              whileHover={{ scale: 1.05 }}
            >
              <div className="stats-icon">
                <FaFire />
              </div>
              <div className="stats-info">
                <h3>Calories Burned</h3>
                <p>324 kcal</p>
              </div>
            </motion.div>

            <motion.div 
              className="stats-card"
              whileHover={{ scale: 1.05 }}
            >
              <div className="stats-icon">
                <FaDumbbell />
              </div>
              <div className="stats-info">
                <h3>Workouts Completed</h3>
                <p>12 this week</p>
              </div>
            </motion.div>

            <motion.div 
              className="stats-card"
              whileHover={{ scale: 1.05 }}
            >
              <div className="stats-icon">
                <BiTargetLock />
              </div>
              <div className="stats-info">
                <h3>Current Goal</h3>
                <p>Build Strength</p>
              </div>
            </motion.div>
          </section>
          
          {/* Fitness Level Selection */}
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

          {/* Workout Categories */}
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

          {/* Active Workout Timer */}
          {activeWorkout && (
            <motion.section 
              className="active-workout"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <div className="workout-timer">
                <h3>Current Workout</h3>
                <div className="timer-display">{formatTime(workoutTimer)}</div>
                <div className="timer-controls">
                  <button onClick={() => setIsTimerRunning(!isTimerRunning)}>
                    {isTimerRunning ? <FaPause /> : <FaPlay />}
                  </button>
                  <button onClick={() => setWorkoutTimer(0)}><FaRedo /></button>
                </div>
              </div>
              <button className="end-workout" onClick={() => setActiveWorkout(null)}>
                End Workout
              </button>
            </motion.section>
          )}

          {/* Exercises Grid */}
          <motion.section 
            className="exercises-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {workoutData[selectedLevel][selectedCategory]?.map(exercise => (
              <motion.div
                key={exercise.id}
                className="exercise-card"
                variants={itemVariants}
              >
                <div className="exercise-video">
                  {exercise.videoUrl ? (
                    <iframe
                      src={exercise.videoUrl}
                      title={exercise.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="video-placeholder">
                      <FaPlay />
                      <p>Video Coming Soon</p>
                    </div>
                  )}
                  <span className="exercise-duration">{exercise.duration}</span>
                </div>
                <div className="exercise-content">
                  <h3>{exercise.title}</h3>
                  <p>{exercise.description}</p>
                  <div className="exercise-meta">
                    <span className="calories">
                      <FaFire /> {exercise.calories} cal
                    </span>
                    <div className="target-muscles">
                      {exercise.targetMuscles.map(muscle => (
                        <span key={muscle} className="muscle-tag">{muscle}</span>
                      ))}
                    </div>
                  </div>
                  <div className="exercise-actions">
                    {!activeWorkout && (
                      <button 
                        className="start-exercise"
                        onClick={() => handleExerciseClick(exercise)}
                      >
                        Start Exercise
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
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
