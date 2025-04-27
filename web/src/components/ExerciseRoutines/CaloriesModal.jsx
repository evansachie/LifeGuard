import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaFire,
  FaDumbbell,
  FaCalendarAlt,
  FaChartLine,
  FaExclamationCircle,
} from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AccessibleDropdown from '../AccessibleDropdown/AccessibleDropdown';
import exerciseService from '../../services/exerciseService';

const CaloriesModal = ({ isOpen, onClose, isDarkMode }) => {
  const [period, setPeriod] = useState('7days');
  const [caloriesData, setCaloriesData] = useState({
    history: [],
    trends: {},
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCaloriesHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await exerciseService.getCaloriesHistory(period);
      setCaloriesData(data);
    } catch (error) {
      console.error('Error fetching calories history:', error);
      setError('Failed to load calories data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [period]);

  useEffect(() => {
    if (isOpen) {
      fetchCaloriesHistory();
    }
  }, [isOpen, period, fetchCaloriesHistory]);

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
                  Calories Analysis
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

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 rounded-full border-4 border-t-blue-500 animate-spin" />
                  <p className={`mt-4 text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Loading calories data...
                  </p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                    <FaExclamationCircle className="text-2xl text-red-500" />
                  </div>
                  <p className={`mt-4 text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {error}
                  </p>
                  <button
                    onClick={() => {
                      setError(null);
                      fetchCaloriesHistory();
                    }}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : caloriesData.history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <FaFire className="text-3xl text-gray-400" />
                  </div>
                  <p
                    className={`mt-4 text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                  >
                    No calories data found for this period.
                  </p>
                </div>
              ) : (
                <>
                  {/* Stats Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
                          Total Calories
                        </p>
                        <p
                          className={`text-2xl font-bold ${
                            isDarkMode ? 'text-white' : 'text-gray-800'
                          }`}
                        >
                          {caloriesData.trends?.total_calories || 0}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`p-4 rounded-xl ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                      } flex items-center gap-4`}
                    >
                      <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <FaChartLine className="text-2xl text-blue-500" />
                      </div>
                      <div>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Avg. per Workout
                        </p>
                        <p
                          className={`text-2xl font-bold ${
                            isDarkMode ? 'text-white' : 'text-gray-800'
                          }`}
                        >
                          {Math.round(caloriesData.trends?.avg_calories_per_workout || 0)}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`p-4 rounded-xl ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                      } flex items-center gap-4`}
                    >
                      <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                        <FaDumbbell className="text-2xl text-green-500" />
                      </div>
                      <div>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Total Workouts
                        </p>
                        <p
                          className={`text-2xl font-bold ${
                            isDarkMode ? 'text-white' : 'text-gray-800'
                          }`}
                        >
                          {caloriesData.trends?.total_workouts || 0}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`p-4 rounded-xl ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                      } flex items-center gap-4`}
                    >
                      <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <FaCalendarAlt className="text-2xl text-purple-500" />
                      </div>
                      <div>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Active Days
                        </p>
                        <p
                          className={`text-2xl font-bold ${
                            isDarkMode ? 'text-white' : 'text-gray-800'
                          }`}
                        >
                          {caloriesData.trends?.active_days || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Calories History Chart */}
                  <div
                    className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} mb-6`}
                  >
                    <h3
                      className={`text-lg font-semibold mb-4 ${
                        isDarkMode ? 'text-white' : 'text-gray-800'
                      }`}
                    >
                      Daily Calories Burned
                    </h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={caloriesData.history}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={isDarkMode ? '#374151' : '#E5E7EB'}
                          />
                          <XAxis
                            dataKey="date"
                            stroke={isDarkMode ? '#9CA3AF' : '#4B5563'}
                            tickFormatter={(date) =>
                              new Date(date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })
                            }
                          />
                          <YAxis stroke={isDarkMode ? '#9CA3AF' : '#4B5563'} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                              border: 'none',
                              borderRadius: '0.5rem',
                            }}
                            formatter={(value) => [`${value} calories`, 'Calories Burned']}
                          />
                          <Bar dataKey="calories" fill="#EF4444" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* History Table */}
                  <div
                    className={`rounded-xl overflow-hidden ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}
                  >
                    <table className="w-full">
                      <thead>
                        <tr className={isDarkMode ? 'bg-gray-600' : 'bg-gray-100'}>
                          <th className="px-4 py-3 text-left">Date</th>
                          <th className="px-4 py-3 text-left">Calories</th>
                          <th className="px-4 py-3 text-left">Workouts</th>
                          <th className="px-4 py-3 text-left">Types</th>
                        </tr>
                      </thead>
                      <tbody>
                        {caloriesData.history.map((day) => (
                          <tr
                            key={day.date}
                            className={`border-t ${
                              isDarkMode ? 'border-gray-600' : 'border-gray-200'
                            }`}
                          >
                            <td
                              className={`px-4 py-3 ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-800'
                              }`}
                            >
                              {new Date(day.date).toLocaleDateString()}
                            </td>
                            <td
                              className={`px-4 py-3 ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-800'
                              }`}
                            >
                              {day.calories}
                            </td>
                            <td
                              className={`px-4 py-3 ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-800'
                              }`}
                            >
                              {day.workout_count}
                            </td>
                            <td
                              className={`px-4 py-3 ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-800'
                              }`}
                            >
                              {day.workout_types}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
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
