import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaDumbbell, FaCalendar, FaClock, FaFire } from 'react-icons/fa';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import AccessibleDropdown from '../AccessibleDropdown/AccessibleDropdown';
import exerciseService from '../../services/exerciseService';

const WorkoutsModal = ({ isOpen, onClose, isDarkMode }) => {
  const [period, setPeriod] = useState('7days');
  const [workoutData, setWorkoutData] = useState({ history: [], typeDistribution: [], stats: {} });

  useEffect(() => {
    const fetchWorkoutHistory = async () => {
      try {
        const data = await exerciseService.getWorkoutHistory(period);
        setWorkoutData(data);
      } catch (error) {
        console.error('Error fetching workout history:', error);
      }
    };

    if (isOpen) {
      fetchWorkoutHistory();
    }
  }, [isOpen, period]);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

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
                  Workout Analysis
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

              {/* Stats Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div
                  className={`p-4 rounded-xl ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                  } flex items-center gap-4`}
                >
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <FaDumbbell className="text-2xl text-blue-500" />
                  </div>
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Total Workouts
                    </p>
                    <p
                      className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
                    >
                      {workoutData.stats?.total_workouts || 0}
                    </p>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-xl ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                  } flex items-center gap-4`}
                >
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <FaCalendar className="text-2xl text-green-500" />
                  </div>
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Active Days
                    </p>
                    <p
                      className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
                    >
                      {workoutData.stats?.active_days || 0}
                    </p>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-xl ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                  } flex items-center gap-4`}
                >
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <FaClock className="text-2xl text-amber-500" />
                  </div>
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Avg. Duration
                    </p>
                    <p
                      className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
                    >
                      {Math.round(workoutData.stats?.avg_duration || 0)} min
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
                      Total Duration
                    </p>
                    <p
                      className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
                    >
                      {Math.round(workoutData.stats?.total_duration || 0)} min
                    </p>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Workout Distribution Chart */}
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h3
                    className={`text-lg font-semibold mb-4 ${
                      isDarkMode ? 'text-white' : 'text-gray-800'
                    }`}
                  >
                    Workout Type Distribution
                  </h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={workoutData.typeDistribution}
                          dataKey="count"
                          nameKey="WorkoutType"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label
                        >
                          {workoutData.typeDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {workoutData.typeDistribution.map((type, index) => (
                      <div key={type.WorkoutType} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span
                          className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                        >
                          {type.WorkoutType}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Daily Activity Chart */}
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h3
                    className={`text-lg font-semibold mb-4 ${
                      isDarkMode ? 'text-white' : 'text-gray-800'
                    }`}
                  >
                    Daily Activity
                  </h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={workoutData.history}>
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
                        />
                        <Bar dataKey="workout_count" fill="#3B82F6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Workout History Table */}
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
                      <th className="px-4 py-3 text-left">Duration</th>
                      <th className="px-4 py-3 text-left">Calories</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workoutData.history.map((day) => (
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
                          {day.total_duration} min
                        </td>
                        <td
                          className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}
                        >
                          {day.total_calories} cal
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
              ariaLabel="Close workouts modal"
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

export default WorkoutsModal;
