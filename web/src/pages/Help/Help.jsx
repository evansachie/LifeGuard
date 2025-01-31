import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaHeart, FaRunning, FaDumbbell, FaBell, FaQuestion, FaBook, FaUserMd } from 'react-icons/fa';
import { IoMdFitness } from 'react-icons/io';
import './Help.css';

const helpCategories = [
  {
    id: 'getting-started',
    icon: <FaBook />,
    title: 'Getting Started',
    color: 'text-blue-500',
    sections: [
      {
        title: 'Welcome to LifeGuard',
        content: 'LifeGuard is your personal health and fitness companion, designed to help you maintain a healthy lifestyle and respond to emergencies.',
      },
      {
        title: 'Setting Up Your Profile',
        content: 'Complete your profile with health information, emergency contacts, and fitness goals to get personalized recommendations.',
      },
      {
        title: 'Navigation Guide',
        content: 'Learn how to navigate through different sections: Exercise Routines, Health Tips, Emergency Contacts, and Settings.',
      }
    ]
  },
  {
    id: 'exercise-routines',
    icon: <FaDumbbell />,
    title: 'Exercise Routines',
    color: 'text-green-500',
    sections: [
      {
        title: 'Understanding Workout Categories',
        content: 'Explore different workout categories tailored to your fitness level: Beginner, Intermediate, and Advanced.',
      },
      {
        title: 'Using the 3D Model',
        content: 'Learn how to use the interactive 3D muscle model to understand which muscles are targeted in each exercise.',
      },
      {
        title: 'Creating Custom Workouts',
        content: 'Create and save your own workout routines by combining exercises from our extensive library.',
      }
    ]
  },
  {
    id: 'health-monitoring',
    icon: <FaHeart />,
    title: 'Health Monitoring',
    color: 'text-red-500',
    sections: [
      {
        title: 'Vital Signs Tracking',
        content: 'Monitor your heart rate, blood pressure, and other vital signs to maintain optimal health.',
      },
      {
        title: 'Health Alerts',
        content: 'Understand how our health alert system works to notify you and your emergency contacts during health anomalies.',
      },
      {
        title: 'Progress Tracking',
        content: 'Track your fitness progress, including workout completion, calories burned, and health improvements.',
      }
    ]
  },
  {
    id: 'emergency-features',
    icon: <FaUserMd />,
    title: 'Emergency Features',
    color: 'text-yellow-500',
    sections: [
      {
        title: 'Emergency Contact Management',
        content: 'Learn how to add and manage emergency contacts who will be notified in case of health emergencies.',
      },
      {
        title: 'Quick Response System',
        content: 'Understand how to use the one-tap emergency alert feature to notify your contacts immediately.',
      },
      {
        title: 'Location Services',
        content: 'Enable location services to help emergency responders locate you quickly during emergencies.',
      }
    ]
  }
];

const HelpPage = ({ isDarkMode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(false);

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
                isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
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
          <h2 className="text-xl font-semibold mb-4">Need More Help?</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                isDarkMode
                  ? 'bg-custom-blue hover:bg-custom-blue-hover'
                  : 'bg-custom-blue hover:bg-custom-blue-hover'
              } text-white transition-colors`}
            >
              <FaQuestion />
              <span>Contact Support</span>
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                isDarkMode
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-green-500 hover:bg-green-600'
              } text-white transition-colors`}
            >
              <FaBook />
              <span>View Tutorials</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HelpPage;