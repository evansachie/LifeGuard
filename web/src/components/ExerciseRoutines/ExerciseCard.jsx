import React from 'react';
import { motion } from 'framer-motion';
import { FaFire, FaPlay, FaInfoCircle } from 'react-icons/fa';

const ExerciseCard = ({ 
  exercise, 
  onExerciseStart, 
  activeWorkout, 
  isDarkMode, 
  compact = false 
}) => {

  return (
    <>
      <motion.div
        className={`rounded-xl overflow-hidden shadow-lg transition-all ${isDarkMode ? 'bg-dark-card2' : 'bg-white'} h-full flex flex-col`}
        variants={{
          hidden: { y: 20, opacity: 0 },
          visible: { y: 0, opacity: 1 }
        }}
        whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
      >
        <div className="relative w-full h-full">
          {exercise.videoUrl ? (
            <iframe
              src={exercise.videoUrl}
              title={exercise.title}
              className="absolute inset-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-white">
              <FaPlay className="text-4xl mb-3 opacity-80" />
              <p>Video Coming Soon</p>
            </div>
          )}
          <span className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
            {exercise.duration}
          </span>
        </div>
        
        <div className={`${compact ? 'p-3' : 'p-4'} flex-grow flex flex-col`}>
          <div className="flex justify-between items-start mb-2">
            <h3 className={`${compact ? 'text-base' : 'text-lg'} font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {exercise.title}
            </h3>
            <div className="flex gap-2">
              <button 
                className={`p-1.5 rounded-full ${isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'} transition-colors`}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <FaInfoCircle className={compact ? 'text-base' : 'text-lg'} />
              </button>
            </div>
          </div>
          
          {!compact && (
            <p className={`text-sm mb-4 flex-grow ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {exercise.description.length > 120 
                ? `${exercise.description.substring(0, 120)}...` 
                : exercise.description}
            </p>
          )}
          
          <div className="flex justify-between items-center mb-3">
            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
              <FaFire className="text-red-500" /> {exercise.calories} cal
            </span>
            <div className="flex gap-1.5">
              {exercise.targetMuscles.slice(0, compact ? 1 : 2).map(muscle => (
                <span 
                  key={muscle} 
                  className={`px-2 py-1 rounded-full text-xs ${
                    isDarkMode 
                      ? 'bg-gray-700 text-gray-300' 
                      : 'bg-gray-100 text-gray-700'
                  } transition-colors hover:bg-gray-600 hover:text-white`}
                >
                  {muscle}
                </span>
              ))}
              {exercise.targetMuscles.length > (compact ? 1 : 2) && (
                <span className={`px-2 py-1 rounded-full text-xs ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-300' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  +{exercise.targetMuscles.length - (compact ? 1 : 2)}
                </span>
              )}
            </div>
          </div>
          
          {!activeWorkout && (
            <motion.button 
              className={`w-full py-${compact ? '2' : '2.5'} px-4 ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-gray-900 hover:bg-gray-800'
              } text-white rounded-full font-semibold shadow-md hover:shadow-lg transition-all`}
              onClick={() => onExerciseStart(exercise)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Exercise
            </motion.button>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default ExerciseCard;
