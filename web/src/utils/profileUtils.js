import { fetchWithAuth, API_ENDPOINTS } from './api';

/**
 * Fetches a user's profile photo URL
 * @param {string} userId - The user ID
 * @returns {Promise<string|null>} - The photo URL or null if not found
 */
export const fetchProfilePhoto = async (userId) => {
    if (!userId) return null;
    
    try {
        const response = await fetchWithAuth(API_ENDPOINTS.GET_PHOTO(userId), {
            method: 'GET'
        });
        
        // Handle different response formats
        if (response) {
            if (typeof response === 'object') {
                return response.url || response.imageUrl || response.profileImage || null;
            } else if (typeof response === 'string' && response.startsWith('http')) {
                return response;
            }
        }
        
        return null;
    } catch (error) {
        console.error('Error fetching profile photo:', error);
        return null;
    }
};

/**
 * Generate avatar URL from user's name
 * @param {string} name - User's name
 * @returns {string} - URL for the avatar image
 */
export const generateAvatarUrl = (name) => {
    const formattedName = name || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(formattedName)}&background=random`;
};
