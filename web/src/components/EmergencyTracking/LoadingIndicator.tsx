import React from 'react';
import { motion } from 'framer-motion';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-[70vh]">
      <motion.div
        className="animate-pulse flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="h-12 w-12 bg-red-500 rounded-full mb-4 animate-ping"></div>
        <div className="h-4 bg-gray-400 rounded w-48 mb-2"></div>
        <div className="h-4 bg-gray-400 rounded w-64"></div>
      </motion.div>
    </div>
  );
};

export default LoadingIndicator;
