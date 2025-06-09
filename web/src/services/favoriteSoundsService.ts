import { fetchWithAuth, API_ENDPOINTS } from '../utils/api';
import { handleError, getErrorMessage } from '../utils/errorHandler';
import { Sound, FavoriteResponse, FavoriteSound } from '../types/wellnessHub.types';

export interface FavoriteSoundResult {
  error?: string;
  favorite?: FavoriteSound;
  id?: string;
  name?: string;
  url?: string;
  message?: string;
}

/**
 * Gets all favorite sounds for a user
 * @param userId - The user's ID
 * @returns List of favorite sounds
 */
export const getFavorites = async (userId: string): Promise<FavoriteSound[]> => {
  try {
    const response = await fetchWithAuth<FavoriteSound[]>(API_ENDPOINTS.GET_USER_FAVORITES(userId));

    const favorites = Array.isArray(response) ? response : (response as any)?.data || [];

    return favorites.map((fav: any) => ({
      sound_id: fav.sound_id || String(fav.id),
      name: fav.sound_name || fav.name,
      url: fav.sound_url || fav.url || fav.previewUrl || fav.preview_url,
    }));
  } catch (error: unknown) {
    console.error('Error fetching favorites:', error);

    // If it's a 404 or similar, just return empty array (user has no favorites yet)
    if (
      error &&
      typeof error === 'object' &&
      'status' in error &&
      (error.status === 404 || error.status === 400)
    ) {
      return [];
    }

    throw error;
  }
};

/**
 * Add a sound to favorites
 * @param userId - User ID
 * @param sound - Sound to add to favorites
 * @returns Result indicating success or failure
 */
export const addToFavorites = async (
  userId: string,
  sound: Sound
): Promise<FavoriteResponse | FavoriteSoundResult> => {
  try {
    // Make sure we have valid data before proceeding
    if (!sound.previews || !sound.previews['preview-hq-mp3']) {
      return {
        error: 'Missing preview URL',
        message: 'Sound is missing preview URL',
      };
    }

    const requestBody = {
      userId,
      soundId: sound.id.toString(),
      soundName: sound.name,
      soundUrl: sound.url || '',
      previewUrl: sound.previews['preview-hq-mp3'],
      category: sound.type || 'uncategorized',
      duration: typeof sound.duration === 'string' ? parseFloat(sound.duration) : sound.duration,
    };

    return await fetchWithAuth<FavoriteResponse>(API_ENDPOINTS.FAVORITE_SOUNDS, {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
  } catch (error: unknown) {
    console.error('Error adding to favorites:', error);

    // Handle 409 Conflict (already favorited)
    if (error && typeof error === 'object' && 'status' in error && error.status === 409) {
      return {
        error: 'Already favorited',
        message: 'This sound is already in your favorites',
        favorite: {
          sound_id: String(sound.id),
          name: sound.name,
          url: (sound.previews && sound.previews['preview-hq-mp3']) || '',
        },
      };
    }

    // Handle other specific status codes
    if (error && typeof error === 'object' && 'status' in error) {
      if (error.status === 400) {
        const errorMessage = getErrorMessage(error, 'Invalid sound data');
        return {
          error: 'Invalid request',
          message: errorMessage,
        };
      }

      if (error.status === 401) {
        return {
          error: 'Unauthorized',
          message: 'Please log in to favorite sounds',
        };
      }
    }

    // Handle network errors
    const errorMessage = getErrorMessage(error, 'An unexpected error occurred');
    if (errorMessage.includes('Failed to fetch') || errorMessage.includes('Fetch failed')) {
      return {
        error: 'Network error',
        message: 'Please check your internet connection and try again',
      };
    }

    // Generic error handling - wrap as error response instead of throwing
    return {
      error: 'Error adding to favorites',
      message: errorMessage,
    };
  }
};

/**
 * Remove a sound from favorites
 * @param userId - User ID
 * @param soundId - ID of the sound to remove
 */
export const removeFromFavorites = async (userId: string, soundId: string): Promise<void> => {
  try {
    await fetchWithAuth(API_ENDPOINTS.REMOVE_FAVORITE(userId, soundId), {
      method: 'DELETE',
    });
  } catch (error: unknown) {
    handleError(error, 'Remove from favorites', true, 'Error removing from favorites');
    throw error;
  }
};
