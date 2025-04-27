import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrophy, FaCalendarAlt, FaFire, FaMedal } from 'react-icons/fa';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import AccessibleDropdown from '../AccessibleDropdown/AccessibleDropdown';
import exerciseService from '../../services/exerciseService';

const StreakModal = ({ isOpen, onClose, isDarkMode }) => {
  const [period, setPeriod] = useState('7days');
  const [streakData, setStreakData] = useState({
    workoutDays: [],
    streakMilestones: [],
    stats: {},
  });

  useEffect(() => {
    const fetchStreakHistory = async () => {
      try {
        const data = await exerciseService.getStreakHistory(period);
        setStreakData(data);
      } catch (error) {
        console.error('Error fetching streak history:', error);
      }
    };

    if (isOpen) {
      fetchStreakHistory();
    }
  }, [isOpen, period]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
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
            className={`relative w-full max-w-4xl mx-4 my-8 rounded-2xl shadow-xl ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  Workout Streak Analysis
                </h2>
                <div className="flex gap-2">
                  {['7days', '30days', '90days'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPeriod(p)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        period === p
                          ? 'bg-blue-500 text-white'
                          : isDarkMode
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {p === '7days'
                        ? 'Last 7 Days'
                        : p === '30days'
                          ? 'Last 30 Days'
                          : 'Last 90 Days'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Streak Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div
                  className={`p-4 rounded-xl ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                  } flex items-center gap-4`}
                >
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <FaTrophy className="text-2xl text-amber-500" />
                  </div>
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Current Streak
                    </p>
                    <p
                      className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
                    >
                      {streakData.stats?.CurrentStreak || 0} days
                    </p>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-xl ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                  } flex items-center gap-4`}
                >
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <FaMedal className="text-2xl text-blue-500" />
                  </div>
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Longest Streak
                    </p>
                    <p
                      className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
                    >
                      {streakData.stats?.LongestStreak || 0} days
                    </p>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-xl ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                  } flex items-center gap-4`}
                >
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <FaCalendarAlt className="text-2xl text-green-500" />
                  </div>
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Active Days
                    </p>
                    <p
                      className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
                    >
                      {streakData.workoutDays.length}
                    </p>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-xl ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                  } flex items-center gap-4`}
                >
                  <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                    <FaFire className="text-2xl text-red-500" />
                  </div>
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Last Workout
                    </p>
                    <p
                      className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
                    >
                      {streakData.stats?.LastWorkoutDate
                        ? new Date(streakData.stats.LastWorkoutDate).toLocaleDateString()
                        : 'No workouts yet'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Streak Timeline */}
              <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} mb-6`}>
                <h3
                  className={`text-lg font-semibold mb-4 ${
                    isDarkMode ? 'text-white' : 'text-gray-800'
                  }`}
                >
                  Streak Timeline
                </h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={streakData.streakMilestones}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={isDarkMode ? '#374151' : '#E5E7EB'}
                      />
                      <XAxis
                        dataKey="milestone_date"
                        stroke={isDarkMode ? '#9CA3AF' : '#4B5563'}
                        tickFormatter={(date) =>
                          new Date(date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })
                        }
                      />
                      <YAxis
                        stroke={isDarkMode ? '#9CA3AF' : '#4B5563'}
                        label={{ value: 'Streak Days', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                          border: 'none',
                          borderRadius: '0.5rem',
                        }}
                        formatter={(value) => [`${value} days`, 'Streak Length']}
                        labelFormatter={(date) => new Date(date).toLocaleDateString()}
                      />
                      <Line
                        type="monotone"
                        dataKey="streak_length"
                        stroke="#F59E0B"
                        strokeWidth={2}
                        dot={{ fill: '#F59E0B' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Workout Calendar */}
              <div
                className={`rounded-xl overflow-hidden ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}
              >
                <table className="w-full">
                  <thead>
                    <tr className={isDarkMode ? 'bg-gray-600' : 'bg-gray-100'}>
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-left">Workouts</th>
                      <th className="px-4 py-3 text-left">Types</th>
                      <th className="px-4 py-3 text-left">Streak Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {streakData.workoutDays.map((day) => (
                      <tr
                        key={day.date}
                        className={`border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}
                      >
                        <td
                          className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}
                        >
                          {new Date(day.date).toLocaleDateString()}
                        </td>
                        <td
                          className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}
                        >
                          {day.workout_count}
                        </td>
                        <td
                          className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}
                        >
                          {day.workout_types}
                        </td>
                        <td
                          className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}
                        >
                          <span className="inline-flex items-center gap-1">
                            <FaFire className="text-amber-500" />
                            Streak Day
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <AccessibleDropdown
              isOpen={false}
              onToggle={onClose}
              ariaLabel="Close streak modal"
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

export default StreakModal;
