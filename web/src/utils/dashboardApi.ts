import axios from 'axios';
import { fetchWithAuth, API_ENDPOINTS, QUOTE_API_URL } from './api';
import { UserData, Memo, Quote } from '../types/common.types';

interface QuoteApiResponse {
  q: string;
  a: string;
  [key: string]: any;
}

/**
 * Fetch user data by userId
 * @returns User data object
 */
export const fetchUserData = async (userId: string): Promise<UserData> => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    const response = await fetchWithAuth(`${API_ENDPOINTS.GET_USER(userId)}`);
    return {
      userName: response.userName,
      email: response.email,
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

/**
 * Fetch user memos/reminders
 * @returns Array of memo objects
 */
export const fetchUserMemos = async (): Promise<Memo[]> => {
  try {
    const memosData = await fetchWithAuth(API_ENDPOINTS.MEMOS);
    // Ensure memosData is an array
    return Array.isArray(memosData) ? memosData : [];
  } catch (error) {
    console.error('Error fetching memos:', error);
    throw error;
  }
};

/**
 * Fetch inspirational quote
 * @returns Quote object with quote and author
 */
export const fetchQuote = async (): Promise<Quote> => {
  try {
    const response = await axios.get<QuoteApiResponse[]>(QUOTE_API_URL);
    const quoteData = response.data[0];
    return {
      author: quoteData.a,
      text: quoteData.q, // Changed from 'quote' to 'text' to match the Quote interface
    };
  } catch (error) {
    console.error('Error fetching quote:', error);
    throw error;
  }
};
