import { useState, useEffect } from 'react';
import { fetchQuote } from '../utils/dashboardApi';

interface Quote {
  quote: string;
  author: string;
}

interface UseQuoteDataReturn {
  quote: Quote | null;
  isLoading: boolean;
}

/**
 * Custom hook to fetch and manage inspirational quotes
 * @returns Quote data and loading status
 */
const useQuoteData = (): UseQuoteDataReturn => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadQuote = async (): Promise<void> => {      try {
        setIsLoading(true);
        const quoteData = await fetchQuote() as Quote;
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
