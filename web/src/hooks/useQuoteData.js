import { useState, useEffect } from 'react';
import { fetchQuote } from '../utils/dashboardApi';

/**
 * Custom hook to fetch and manage inspirational quotes
 * @returns {Object} Quote data and loading status
 */
const useQuoteData = () => {
  const [quote, setQuote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadQuote = async () => {
      try {
        setIsLoading(true);
        const quoteData = await fetchQuote();
        setQuote(quoteData);
      } catch (error) {
        // Silent fail, quotes are not critical
        setQuote(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuote();
  }, []);

  return { quote, isLoading };
};

export default useQuoteData;
