import { fetchWithAuth, API_ENDPOINTS } from '../utils/api';

const memoService = {
  getUndoneMemoCount: async () => {
    const response = await fetchWithAuth(`${API_ENDPOINTS.MEMOS}/undone/count`);
    return response.count;
  },
};

export default memoService;
