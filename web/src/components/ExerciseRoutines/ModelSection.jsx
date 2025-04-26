import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSyncAlt, FaExpand, FaInfoCircle } from 'react-icons/fa';

const MODEL_URL = import.meta.env.VITE_MODEL_URL;

const ModelSection = ({ activeExercise, selectedCategory, isDarkMode }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [highlightedMuscles, setHighlightedMuscles] = useState([]);

  useEffect(() => {
    const iframe = document.querySelector('.model-container iframe');
    if (!iframe || !selectedCategory) return;

    const highlightMuscles = () => {
      if (!activeExercise?.targetMuscles) {
        setHighlightedMuscles([]);
        return;
      }

      setHighlightedMuscles(activeExercise.targetMuscles);

      iframe.contentWindow.postMessage(
        {
          type: 'callMethod',
          data: {
            method: 'clearAnnotations',
          },
        },
        '*'
      );

      activeExercise.targetMuscles.forEach((muscle) => {
        iframe.contentWindow.postMessage(
          {
            type: 'callMethod',
            data: {
              method: 'showAnnotation',
              args: [muscle],
            },
          },
          '*'
        );
      });
    };

    const handleMessage = (event) => {
      if (event.data === 'viewerready') {
        highlightMuscles();
      }
    };

    window.addEventListener('message', handleMessage);

    // Try to highlight muscles after a short delay
    const timer = setTimeout(highlightMuscles, 1000);

    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(timer);
    };
  }, [activeExercise, selectedCategory]);

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleResetView = () => {
    const iframe = document.querySelector('.model-container iframe');
    if (!iframe) return;

    iframe.contentWindow.postMessage(
      {
        type: 'callMethod',
        data: {
          method: 'resetCamera',
        },
      },
      '*'
    );
  };

  return (
    <>
      <div className="h-full flex flex-col">
        <div
          className={`${isDarkMode ? 'bg-dark-card2' : 'bg-gray-100'} text-${isDarkMode ? 'white' : 'gray-800'} p-3 flex justify-between items-center`}
        >
          <div className="flex items-center gap-2">
            <FaInfoCircle className={`${isDarkMode ? 'text-white/80' : 'text-gray-600'}`} />
            <h3 className="font-semibold">
              {activeExercise ? `Muscles: ${activeExercise.title}` : '3D Muscle Visualization'}
            </h3>
          </div>
          <div className="flex gap-2">
            <button
              className={`w-8 h-8 rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-200'} flex items-center justify-center transition-colors`}
              onClick={handleResetView}
              title="Reset View"
            >
              <FaSyncAlt />
            </button>
            <button
              className={`w-8 h-8 rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-200'} flex items-center justify-center transition-colors`}
              onClick={handleFullscreen}
              title="Fullscreen"
            >
              <FaExpand />
            </button>
          </div>
        </div>

        <div className="relative flex-grow">
          <div className="model-container h-[400px] lg:h-[500px]">
            <iframe
              title="3D Muscle Model"
              src={MODEL_URL}
              className="w-full h-full border-0"
              allowFullScreen
              mozallowfullscreen="true"
              webkitallowfullscreen="true"
            />
          </div>
        </div>

        {highlightedMuscles.length > 0 && (
          <div
            className={`p-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}
          >
            <h4
              className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}
            >
              Targeted Muscles:
            </h4>
            <div className="flex flex-wrap gap-2">
              {highlightedMuscles.map((muscle) => (
                <span
                  key={muscle}
                  className={`px-2 py-1 text-xs rounded-full ${
                    isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {muscle}
                </span>
              ))}
            </div>
          </div>
        )}

        {activeExercise && (
          <div className={`p-4 ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
            <h4
              className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}
            >
              Exercise Tips
            </h4>
            <ul
              className={`list-disc pl-5 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} space-y-1`}
            >
              <li>Keep your form correct throughout the exercise</li>
              <li>Breathe steadily and don&apos;t hold your breath</li>
              <li>Focus on the targeted muscles shown in the model</li>
              <li>If you feel pain (not muscle fatigue), stop immediately</li>
            </ul>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isFullscreen && (
          <div className="fixed inset-0 z-50">
            <motion.div
              className={`fixed inset-0 ${isDarkMode ? 'bg-black/90' : 'bg-gray-900/80'} backdrop-blur-sm`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleFullscreen}
            />
            <motion.div
              className="fixed inset-4 md:inset-10 z-50"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div
                className={`w-full h-full flex flex-col overflow-hidden rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl`}
              >
                <div
                  className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} text-${isDarkMode ? 'white' : 'gray-800'} p-4 flex justify-between items-center border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                >
                  <h3 className="font-semibold text-lg">
                    {activeExercise ? activeExercise.title : '3D Muscle Model'}
                  </h3>
                  <button
                    className={`w-9 h-9 rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-200'} flex items-center justify-center transition-colors text-xl`}
                    onClick={handleFullscreen}
                  >
                    ×
                  </button>
                </div>
                <div className="flex-grow relative">
                  <iframe
                    title="3D Muscle Model Fullscreen"
                    src={MODEL_URL}
                    className="w-full h-full border-0"
                    allowFullScreen
                    mozallowfullscreen="true"
                    webkitallowfullscreen="true"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModelSection;
