import React from 'react';
import { motion } from 'framer-motion';
import { CiSettings } from 'react-icons/ci';

const Header = ({ isDarkMode }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center gap-4 mb-12"
  >
    <CiSettings size={42} />
    <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
      Settings
    </h1>
  </motion.div>
);

export default Header;
