import { useState, useEffect } from 'react';
import { fetchUserMemos } from '../utils/dashboardApi';

/**
 * Custom hook to fetch and manage user memos/reminders
 * @returns {Object} Memos data and loading status
 */
const useMemoData = () => {
  const [memos, setMemos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMemos = async () => {
      try {
        setIsLoading(true);
        const memosData = await fetchUserMemos();
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
