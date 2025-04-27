import { fetchWithAuth, API_ENDPOINTS } from '../utils/api';

const exerciseService = {
  /**
   * Retrieves the user's exercise statistics including calories burned,
   * workouts completed, current streak, and longest streak
   * @returns {Promise<Object>} Exercise statistics
   */
  getStats: async () => {
    return await fetchWithAuth(API_ENDPOINTS.EXERCISE_STATS);
  },

  /**
   * Records a completed workout session
   * @param {Object} workoutData - The workout details
   * @param {string} workoutData.workout_id - Unique identifier for the workout
   * @param {string} workoutData.workout_type - Type of workout (e.g., "running", "strength")
   * @param {number} workoutData.calories_burned - Estimated calories burned
   * @param {number} workoutData.duration_minutes - Duration of the workout in minutes
   * @returns {Promise<Object>} Confirmation of the recorded workout
   */
  completeWorkout: async (workoutData) => {
    return await fetchWithAuth(API_ENDPOINTS.EXERCISE_COMPLETE, {
      method: 'POST',
      body: JSON.stringify(workoutData),
    });
  },

  /**
   * Sets a new workout goal for the user
   * @param {string} goalType - Type of goal (e.g., "streak", "calories", "workouts")
   * @returns {Promise<Object>} The created goal object
   */
  setGoal: async (goalType) => {
    return await fetchWithAuth(API_ENDPOINTS.EXERCISE_GOALS, {
      method: 'POST',
      body: JSON.stringify({ goalType }),
    });
  },

  /**
   * Gets detailed calories history and trends
   * @param {string} period - Time period ('7days', '30days', or '90days')
   * @returns {Promise<Object>} Calories history and trends
   */
  getCaloriesHistory: async (period = '7days') => {
    return await fetchWithAuth(`${API_ENDPOINTS.EXERCISE_STATS}/calories-history?period=${period}`);
  },

  getWorkoutHistory: async (period = '7days') => {
    return await fetchWithAuth(`${API_ENDPOINTS.EXERCISE_STATS}/workout-history?period=${period}`);
  },

  getStreakHistory: async (period = '7days') => {
    return await fetchWithAuth(`${API_ENDPOINTS.EXERCISE_STATS}/streak-history?period=${period}`);
  },
};

export default exerciseService;
