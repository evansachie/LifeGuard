import { fetchWithAuth, API_ENDPOINTS } from '../utils/api';

interface ExerciseStatsResponse {
  totalCaloriesBurned: number;
  totalWorkouts: number;
  currentStreak: number;
  longestStreak: number;
  goalType: string;
}

interface SetGoalRequest {
  goalType: string;
}

interface CompleteWorkoutRequest {
  workout_id: string;
  workout_type: string;
  calories_burned: number;
  duration_minutes: number;
}

const exerciseService = {
  /**
   * Retrieves the user's exercise statistics including calories burned,
   * workouts completed, current streak, and longest streak
   * @returns Exercise statistics
   */
  getStats: async (): Promise<ExerciseStatsResponse> => {
    try {
      const response = await fetchWithAuth<ExerciseStatsResponse>(API_ENDPOINTS.EXERCISE_STATS);
      return response;
    } catch (error) {
      console.error('Error fetching exercise stats:', error);
      throw error;
    }
  },

  /**
   * Sets a new workout goal for the user
   * @param goalType - Type of goal (e.g., "streak", "calories", "workouts")
   * @returns The created goal object
   */
  setGoal: async (goalType: string): Promise<void> => {
    try {
      await fetchWithAuth(API_ENDPOINTS.EXERCISE_GOALS, {
        method: 'POST',
        body: JSON.stringify({ goalType } as SetGoalRequest),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error setting exercise goal:', error);
      throw error;
    }
  },

  /**
   * Records a completed workout session
   * @param workoutData - The workout details
   * @returns Confirmation of the recorded workout
   */
  completeWorkout: async (workoutData: CompleteWorkoutRequest): Promise<void> => {
    try {
      await fetchWithAuth(API_ENDPOINTS.EXERCISE_COMPLETE, {
        method: 'POST',
        body: JSON.stringify(workoutData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error completing workout:', error);
      throw error;
    }
  },

  getWorkoutHistory: async (period: string = '7days'): Promise<any> => {
    try {
      const response = await fetchWithAuth(
        `${API_ENDPOINTS.EXERCISE_WORKOUT_HISTORY}?period=${period}`
      );
      return response;
    } catch (error) {
      console.error('Error fetching workout history:', error);
      throw error;
    }
  },

  getCaloriesHistory: async (period: string = '7days'): Promise<any> => {
    try {
      const response = await fetchWithAuth(
        `${API_ENDPOINTS.EXERCISE_CALORIES_HISTORY}?period=${period}`
      );
      return response;
    } catch (error) {
      console.error('Error fetching calories history:', error);
      throw error;
    }
  },

  getStreakHistory: async (period: string = '7days'): Promise<any> => {
    try {
      const response = await fetchWithAuth(
        `${API_ENDPOINTS.EXERCISE_STREAK_HISTORY}?period=${period}`
      );
      return response;
    } catch (error) {
      console.error('Error fetching streak history:', error);
      throw error;
    }
  },
};

export default exerciseService;
