import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AccessibleDropdown from '../AccessibleDropdown/AccessibleDropdown';

const CaloriesModal = ({ isOpen, onClose, isDarkMode }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <AccessibleDropdown
            isOpen={false}
            onToggle={onClose}
            ariaLabel="Close modal"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            className={`relative max-w-4xl w-full mx-4 rounded-2xl shadow-xl ${
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
                Calories Analysis
              </h2>
            </div>

            <AccessibleDropdown
              isOpen={false}
              onToggle={onClose}
              ariaLabel="Close calories modal"
              className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center ${
                isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              ×
            </AccessibleDropdown>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CaloriesModal;
