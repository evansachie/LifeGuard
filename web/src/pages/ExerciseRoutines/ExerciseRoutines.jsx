import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaDumbbell, FaFire, FaHeartbeat, FaStopwatch, FaPlay, FaPause, FaRedo } from 'react-icons/fa';
import { GiMuscleUp, GiWeightLiftingUp, GiMeditation } from 'react-icons/gi';
import { BiTargetLock } from 'react-icons/bi';
import './ExerciseRoutines.css';

// 3D Model Component
const MODEL_URL = "https://sketchfab.com/models/8a99795ae6e8440b8a87e59ca6821b55/embed";

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

// Complete workout data for all levels
const workoutData = {
  beginner: {
    warmup: [
      {
        id: 'w1',
        title: 'Dynamic Stretching',
        description: 'Full body dynamic stretches to prepare for workout',
        duration: '5 mins',
        videoUrl: 'https://example.com/video1',
        thumbnail: 'https://source.unsplash.com/random/800x600/?stretching',
        calories: 25,
        targetMuscles: ['Full Body']
      }
    ],
    cardio: [
      {
        id: 'c1',
        title: 'Light Jogging',
        description: 'Easy-paced jogging to build endurance',
        duration: '10 mins',
        videoUrl: 'https://example.com/video2',
        thumbnail: 'https://source.unsplash.com/random/800x600/?jogging',
        calories: 100,
        targetMuscles: ['Legs', 'Core']
      }
    ],
    strength: [
      {
        id: 's1',
        title: 'Bodyweight Squats',
        description: 'Basic squats focusing on form and technique',
        duration: '3 sets x 10 reps',
        videoUrl: 'https://example.com/video3',
        thumbnail: 'https://source.unsplash.com/random/800x600/?squats',
        calories: 50,
        targetMuscles: ['Quadriceps', 'Glutes']
      }
    ],
    hiit: [
      {
        id: 'h1',
        title: 'Basic HIIT Circuit',
        description: 'Simple high-intensity interval training for beginners',
        duration: '15 mins',
        videoUrl: 'https://example.com/video4',
        thumbnail: 'https://source.unsplash.com/random/800x600/?hiit',
        calories: 150,
        targetMuscles: ['Full Body']
      }
    ],
    cooldown: [
      {
        id: 'cd1',
        title: 'Static Stretching',
        description: 'Gentle stretches to cool down and improve flexibility',
        duration: '5 mins',
        videoUrl: 'https://example.com/video5',
        thumbnail: 'https://source.unsplash.com/random/800x600/?stretching',
        calories: 20,
        targetMuscles: ['Full Body']
      }
    ]
  },
  intermediate: {
    warmup: [
      {
        id: 'w2',
        title: 'Advanced Dynamic Warmup',
        description: 'Comprehensive dynamic warmup routine',
        duration: '8 mins',
        videoUrl: 'https://example.com/video6',
        thumbnail: 'https://source.unsplash.com/random/800x600/?workout',
        calories: 40,
        targetMuscles: ['Full Body']
      }
    ],
    cardio: [
      {
        id: 'c2',
        title: 'Interval Running',
        description: 'Alternating between high and low intensity running',
        duration: '20 mins',
        videoUrl: 'https://example.com/video7',
        thumbnail: 'https://source.unsplash.com/random/800x600/?running',
        calories: 200,
        targetMuscles: ['Legs', 'Core']
      }
    ],
    strength: [
      {
        id: 's2',
        title: 'Dumbbell Circuit',
        description: 'Full body strength training with dumbbells',
        duration: '4 sets x 12 reps',
        videoUrl: 'https://example.com/video8',
        thumbnail: 'https://source.unsplash.com/random/800x600/?dumbbell',
        calories: 180,
        targetMuscles: ['Upper Body', 'Core']
      }
    ],
    hiit: [
      {
        id: 'h2',
        title: 'Intermediate HIIT',
        description: 'Challenging HIIT workout with compound movements',
        duration: '25 mins',
        videoUrl: 'https://example.com/video9',
        thumbnail: 'https://source.unsplash.com/random/800x600/?fitness',
        calories: 300,
        targetMuscles: ['Full Body']
      }
    ],
    cooldown: [
      {
        id: 'cd2',
        title: 'Yoga-Based Cooldown',
        description: 'Yoga-inspired stretching and breathing exercises',
        duration: '10 mins',
        videoUrl: 'https://example.com/video10',
        thumbnail: 'https://source.unsplash.com/random/800x600/?yoga',
        calories: 30,
        targetMuscles: ['Full Body']
      }
    ]
  },
  advanced: {
    warmup: [
      {
        id: 'w3',
        title: 'Elite Warmup Protocol',
        description: 'High-intensity dynamic warmup with plyometrics',
        duration: '12 mins',
        videoUrl: 'https://example.com/video11',
        thumbnail: 'https://source.unsplash.com/random/800x600/?fitness',
        calories: 60,
        targetMuscles: ['Full Body']
      }
    ],
    cardio: [
      {
        id: 'c3',
        title: 'Advanced HIIT Sprint',
        description: 'High-intensity sprint intervals',
        duration: '30 mins',
        videoUrl: 'https://example.com/video12',
        thumbnail: 'https://source.unsplash.com/random/800x600/?sprint',
        calories: 400,
        targetMuscles: ['Legs', 'Core']
      }
    ],
    strength: [
      {
        id: 's3',
        title: 'Power Lifting Circuit',
        description: 'Heavy compound movements for strength',
        duration: '5 sets x 5 reps',
        videoUrl: 'https://example.com/video13',
        thumbnail: 'https://source.unsplash.com/random/800x600/?weightlifting',
        calories: 250,
        targetMuscles: ['Full Body']
      }
    ],
    hiit: [
      {
        id: 'h3',
        title: 'Elite HIIT Complex',
        description: 'Advanced HIIT with olympic lifting movements',
        duration: '35 mins',
        videoUrl: 'https://example.com/video14',
        thumbnail: 'https://source.unsplash.com/random/800x600/?crossfit',
        calories: 450,
        targetMuscles: ['Full Body']
      }
    ],
    cooldown: [
      {
        id: 'cd3',
        title: 'Recovery Protocol',
        description: 'Advanced recovery techniques and mobility work',
        duration: '15 mins',
        videoUrl: 'https://example.com/video15',
        thumbnail: 'https://source.unsplash.com/random/800x600/?mobility',
        calories: 40,
        targetMuscles: ['Full Body']
      }
    ]
  }
};

function ExerciseRoutines({ isDarkMode }) {
  const [selectedLevel, setSelectedLevel] = useState('beginner');
  const [selectedCategory, setSelectedCategory] = useState('warmup');
  const [isLoading, setIsLoading] = useState(true);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

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
                <div 
                  className="exercise-thumbnail"
                  style={{ backgroundImage: `url(${exercise.thumbnail})` }}
                >
                  <span className="exercise-duration">{exercise.duration}</span>
                  <button className="play-video">
                    <FaPlay />
                  </button>
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
                        onClick={() => {
                          setActiveWorkout(exercise);
                          setWorkoutTimer(0);
                          setIsTimerRunning(true);
                        }}
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

        {/* 3D Model Section */}
        <div className="model-section">
          <div className="model-container">
            <iframe
              title="3D Muscle Model"
              src={MODEL_URL}
              frameBorder="0"
              allowFullScreen
              mozallowfullscreen="true"
              webkitallowfullscreen="true"
              allow="autoplay; fullscreen; xr-spatial-tracking"
              xr-spatial-tracking
              execution-while-out-of-viewport
              execution-while-not-rendered
              web-share
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExerciseRoutines;
