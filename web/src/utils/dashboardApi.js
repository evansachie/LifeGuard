import axios from 'axios';
import { fetchWithAuth, API_ENDPOINTS, QUOTE_API_URL } from './api';

/**
 * Fetch user data by userId
 * @returns {Promise<Object>} User data
 */
export const fetchUserData = async (userId) => {
  try {
    const userData = await fetchWithAuth(`${API_ENDPOINTS.GET_USER(userId)}`);
    return userData;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

/**
 * Fetch user memos/reminders
 * @returns {Promise<Array>} Array of memo objects
 */
export const fetchUserMemos = async () => {
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
 * @returns {Promise<Object>} Quote object with quote and author
 */
export const fetchQuote = async () => {
  try {
    const response = await axios.get(QUOTE_API_URL);
    const quoteData = response.data[0];
    return {
      quote: quoteData.q,
      author: quoteData.a
    };
  } catch (error) {
    console.error('Error fetching quote:', error);
    throw error;
  }
};
