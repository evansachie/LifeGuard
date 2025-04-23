import React from 'react';
import { motion } from 'framer-motion';

const SettingSection = ({ title, children, isDarkMode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.01 }}
    transition={{ duration: 0.2 }}
    className={`p-8 rounded-xl shadow-lg mb-6 backdrop-blur-sm ${
      isDarkMode ? 'bg-[#2D2D2D]/90 hover:bg-[#2D2D2D]/95' : 'bg-white/90 hover:bg-white/95'
    } transition-all duration-300`}
  >
    <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
      {title}
    </h2>
    {children}
  </motion.div>
);

export default SettingSection;
