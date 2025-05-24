import { useState, useEffect } from 'react';
import { fetchUserMemos } from '../utils/dashboardApi';
import type { Memo } from '../types/common.types';

interface UseMemoDataReturn {
  memos: Memo[];
  isLoading: boolean;
}

/**
 * Custom hook to fetch and manage user memos/reminders
 * @returns Memos data and loading status
 */
const useMemoData = (): UseMemoDataReturn => {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadMemos = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const memosData = await fetchUserMemos();
        // The API returns memos with PascalCase field names, which matches our Memo interface
        setMemos(memosData);
      } catch (error) {
        // If error fetching memos, set to empty array
        setMemos([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadMemos();
  }, []);

  return { memos, isLoading };
};

export default useMemoData;
