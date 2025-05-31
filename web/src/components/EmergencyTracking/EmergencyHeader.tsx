import React from 'react';
import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaSun, FaMoon } from 'react-icons/fa';

interface EmergencyHeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  userName: string;
}

const EmergencyHeader: React.FC<EmergencyHeaderProps> = ({ isDarkMode, toggleTheme, userName }) => {
  return (
    <div
      className={`sticky top-0 z-20 p-3 ${isDarkMode ? 'bg-gray-900/90' : 'bg-white/90'} backdrop-blur-sm`}
    >
      <button
        className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all ${
          isDarkMode ? 'bg-white/20 hover:bg-white/30' : 'bg-black/10 hover:bg-black/20'
        }`}
        onClick={toggleTheme}
        type="button"
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDarkMode ? <FaSun className="text-yellow-300" /> : <FaMoon className="text-gray-700" />}
      </button>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl mx-auto"
      >
        <div className="flex items-center justify-center mb-1">
          <FaExclamationTriangle className="text-red-500 text-3xl mr-2 animate-pulse" />
          <h1 className="text-2xl font-bold">Emergency Alert</h1>
        </div>
        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {userName} has triggered an emergency alert and needs assistance
        </p>
      </motion.div>
    </div>
  );
};

export default EmergencyHeader;
