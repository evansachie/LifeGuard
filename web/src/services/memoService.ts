import { fetchWithAuth, API_ENDPOINTS } from '../utils/api';

interface UndoneCountResponse {
  count: number;
}

const memoService = {
  /**
   * Gets the count of undone memos
   * @returns The number of undone memos
   */
  getUndoneMemoCount: async (): Promise<number> => {
    const response = await fetchWithAuth<UndoneCountResponse>(`${API_ENDPOINTS.MEMOS}/undone/count`);
    return response.count;
  },
};

export default memoService;
