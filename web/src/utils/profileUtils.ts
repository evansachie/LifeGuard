import { fetchWithAuth, API_ENDPOINTS, extractPhotoUrl } from './api';

/**
 * Fetches a user's profile photo URL
 * @param userId - The user ID
 * @returns The photo URL or null if not found
 */
export const fetchProfilePhoto = async (userId: string): Promise<string | null> => {
  try {
    const response = await fetchWithAuth(API_ENDPOINTS.GET_PHOTO(userId));
    return extractPhotoUrl(response);
  } catch (error) {
    console.error('Error fetching profile photo:', error);
    return null;
  }
};

/**
 * Generate avatar URL from user's name
 * @param name - User's name
 * @returns URL for the avatar image
 */
export const generateAvatarUrl = (name?: string): string => {
  const formattedName = name || 'User';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(formattedName)}&background=random`;
};
