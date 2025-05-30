import { fetchWithAuth, API_ENDPOINTS } from '../utils/api';
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
export const getFavorites = async (userId: string): Promise<FavoriteResponse[]> => {
  try {
    const response = await fetchWithAuth<FavoriteResponse[]>(
      API_ENDPOINTS.GET_USER_FAVORITES(userId)
    );
    return response || [];
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return [];
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

    return await fetchWithAuth<FavoriteResponse>(API_ENDPOINTS.FAVORITE_SOUNDS, {
      method: 'POST',
      body: JSON.stringify({
        userId,
        soundId: sound.id.toString(),
        soundName: sound.name,
        soundUrl: sound.url || '',
        previewUrl: sound.previews['preview-hq-mp3'],
        category: sound.type || 'uncategorized',
        duration: typeof sound.duration === 'string' ? parseFloat(sound.duration) : sound.duration,
      }),
    });
  } catch (error: any) {
    // Check if error is "already favorited"
    if (error?.message?.includes('already favorited')) {
      return {
        error: 'Already favorited',
        favorite: {
          sound_id: String(sound.id),
          name: sound.name,
          url: (sound.previews && sound.previews['preview-hq-mp3']) || '',
        },
      };
    }
    
    console.error('Error adding to favorites:', error);
    return { 
      error: 'Error adding to favorites',
      message: error.message || 'Unknown error'
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
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
};
