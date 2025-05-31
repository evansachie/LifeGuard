import { fetchWithAuth, API_ENDPOINTS } from '../utils/api';

interface ExerciseStats {
  totalWorkouts: number;
  totalCaloriesBurned: number;
  currentStreak: number;
  longestStreak: number;
  weeklyGoalProgress: number;
  [key: string]: unknown;
}

interface WorkoutData {
  workout_id: string;
  workout_type: string;
  calories_burned: number;
  duration_minutes: number;
}

interface WorkoutHistoryResponse {
  data: Array<{
    date: string;
    count: number;
  }>;
}

interface CaloriesHistoryResponse {
  data: Array<{
    date: string;
    calories: number;
  }>;
}

interface StreakHistoryResponse {
  data: Array<{
    date: string;
    streak: number;
  }>;
}

type Period = '7days' | '30days' | '90days' | 'year';

const exerciseService = {
  /**
   * Retrieves the user's exercise statistics including calories burned,
   * workouts completed, current streak, and longest streak
   * @returns Exercise statistics
   */
  getStats: async (): Promise<ExerciseStats> => {
    return await fetchWithAuth(API_ENDPOINTS.EXERCISE_STATS);
  },

  /**
   * Records a completed workout session
   * @param workoutData - The workout details
   * @returns Confirmation of the recorded workout
   */
  completeWorkout: async (workoutData: WorkoutData): Promise<unknown> => {
    return await fetchWithAuth(API_ENDPOINTS.EXERCISE_COMPLETE, {
      method: 'POST',
      body: JSON.stringify(workoutData),
    });
  },

  /**
   * Sets a new workout goal for the user
   * @param goalType - Type of goal (e.g., "streak", "calories", "workouts")
   * @returns The created goal object
   */
  setGoal: async (goalType: string): Promise<unknown> => {
    return await fetchWithAuth(API_ENDPOINTS.EXERCISE_GOALS, {
      method: 'POST',
      body: JSON.stringify({ goalType }),
    });
  },

  getWorkoutHistory: async (period: Period = '7days'): Promise<WorkoutHistoryResponse> => {
    return await fetchWithAuth(`${API_ENDPOINTS.EXERCISE_WORKOUT_HISTORY}?period=${period}`);
  },

  getCaloriesHistory: async (period: Period = '7days'): Promise<CaloriesHistoryResponse> => {
    return await fetchWithAuth(`${API_ENDPOINTS.EXERCISE_CALORIES_HISTORY}?period=${period}`);
  },

  getStreakHistory: async (period: Period = '7days'): Promise<StreakHistoryResponse> => {
    return await fetchWithAuth(`${API_ENDPOINTS.EXERCISE_STREAK_HISTORY}?period=${period}`);
  },
};

export default exerciseService;
