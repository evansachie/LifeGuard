import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaPlay } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { helpCategories } from '../../data/help-categories';

const HelpPage = ({ isDarkMode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (query) => {
    setSearchQuery(query);
    setShowSearchResults(query.length > 0);
  };

  const filteredCategories = helpCategories.filter(category =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.sections.some(section =>
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleStartTour = () => {
    localStorage.setItem('showTour', 'true');
    localStorage.setItem('tourInitialized', 'false');
    navigate('/dashboard');
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark-mode' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold mb-4">Help Center</h1>
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700 focus:border-blue-500'
                : 'bg-white border-gray-300 focus:border-blue-400'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredCategories.map((category) => (
            <motion.div
              key={category.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-6 rounded-lg shadow-lg cursor-pointer ${
                isDarkMode ? 'bg-[#2d2d2d] hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
              } transition-all duration-300`}
              onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`text-2xl ${category.color}`}>
                  {category.icon}
                </div>
                <h2 className="text-xl font-semibold">{category.title}</h2>
              </div>
              
              <AnimatePresence>
                {activeCategory === category.id && (
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
          ))}
        </div>

        {/* Quick Help Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 p-6 rounded-lg shadow-lg text-center"
        >
          <h2 className="text-xl font-semibold mb-4">Interactive Guide</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleStartTour}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg ${
                isDarkMode
                  ? 'bg-custom-blue hover:bg-custom-blue-hover'
                  : 'bg-custom-blue hover:bg-custom-blue-hover'
              } text-white transition-colors transform hover:scale-105 duration-200 shadow-lg`}
            >
              <FaPlay className="text-lg" />
              <span className="font-medium">Start Interactive Tour</span>
            </button>
          </div>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            Take a guided tour of the dashboard and its features
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default HelpPage;