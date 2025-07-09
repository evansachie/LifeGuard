import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import astronautImage from '../../assets/error-img.png';

const NotFound = ({ isDarkMode }) => {
  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden ${
        isDarkMode ? 'dark-mode' : 'bg-gray-50 text-gray-900'
      }`}
    >
      {/* Floating Background Effects */}
      <motion.div
        className="absolute top-10 left-10 w-40 h-40 bg-blue-500 rounded-full filter blur-3xl opacity-50"
        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-60 h-60 bg-purple-500 rounded-full filter blur-3xl opacity-50"
        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative z-10 text-center p-8 rounded-lg shadow-2xl ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <motion.img
          src={astronautImage}
          alt="404 Astronaut"
          className="mx-auto w-48 mb-6"
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
        />
        <motion.h1
          className="text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          404
        </motion.h1>
        <h2 className="text-2xl font-semibold mb-4">
          Oops! You seem lost in space.
        </h2>
        <p className={`mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          The page you’re looking for doesn’t exist. Let’s bring you back home.
        </p>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="inline-flex"
        >
          <Link
            to="/dashboard"
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-colors shadow-lg ${
              isDarkMode
                ? 'bg-custom-blue hover:bg-custom-blue-hover'
                : 'bg-custom-blue hover:bg-custom-blue-hover'
            } text-white`}
          >
            <FaHome />
            <span>Go Home</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
