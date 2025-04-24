import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { presetGoals } from '../../data/presetGoals';

const GoalsModal = ({ isOpen, onClose, onSelectGoal, isDarkMode }) => {
  const handleBackdropKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/70"
            onClick={onClose}
            onKeyDown={handleBackdropKeyDown}
            role="button"
            tabIndex={0}
            aria-label="Close modal"
          />

          <motion.div
            className={`relative w-full max-w-md m-4 rounded-2xl shadow-xl ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            <div className="p-6">
              <h2
                className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
              >
                Set Workout Goal
              </h2>

              <div className="grid grid-cols-1 gap-4">
                {presetGoals.map((goal) => (
                  <motion.button
                    key={goal.id}
                    className={`flex items-center p-4 rounded-xl ${
                      isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                    } transition-all`}
                    onClick={() => {
                      onSelectGoal(goal.label);
                      onClose();
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <goal.icon className={`text-2xl ${goal.color.replace('bg-', 'text-')}`} />
                    <span
                      className={`ml-3 font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
                    >
                      {goal.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Made this a proper button with aria-label */}
            <button
              className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center ${
                isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GoalsModal;
