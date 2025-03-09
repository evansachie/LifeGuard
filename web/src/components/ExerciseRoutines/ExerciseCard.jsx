import React from 'react';
import { motion } from 'framer-motion';
import { FaFire, FaPlay } from 'react-icons/fa';

const ExerciseCard = ({ exercise, onExerciseStart, activeWorkout }) => {
  return (
    <motion.div
      className="exercise-card"
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
      }}
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
              onClick={() => onExerciseStart(exercise)}
            >
              Start Exercise
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ExerciseCard;
