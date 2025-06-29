import { useState, useEffect } from 'react';
import { fetchQuote } from '../utils/dashboardApi';
import { Quote } from '../types/common.types';

interface QuoteDataReturn {
  quote: Quote | null;
  isLoading: boolean;
}

/**
 * Custom hook to fetch and manage inspirational quotes
 * @returns Quote data and loading status
 */
const useQuoteData = (): QuoteDataReturn => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
