import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CategoryCard = ({ category, isActive, toggleActive, isDarkMode }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`p-6 rounded-lg shadow-lg cursor-pointer ${
        isDarkMode ? 'bg-[#2d2d2d] hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
      } transition-all duration-300`}
      onClick={() => toggleActive(category.id)}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`text-2xl ${category.color}`}>{category.icon}</div>
        <h2 className="text-xl font-semibold">{category.title}</h2>
      </div>
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {category.sections.map((section, index) => (
              <div key={index} className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="font-medium mb-2">{section.title}</h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {section.content}
                </p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CategoryCard;
