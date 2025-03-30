import { fetchWithAuth, NODE_API_URL } from '../utils/api';

const exerciseService = {
    getStats: async () => {
        return await fetchWithAuth(`${NODE_API_URL}/api/exercise/stats`);
    },

    completeWorkout: async (workoutData) => {
        return await fetchWithAuth(`${NODE_API_URL}/api/exercise/complete`, {
            method: 'POST',
            body: JSON.stringify(workoutData)
        });
    }
};

export default exerciseService;
