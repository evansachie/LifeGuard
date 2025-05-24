import { API_ENDPOINTS, fetchWithAuth } from '../utils/api';

interface FavoriteSound {
  id: string;
  name: string;
  url?: string;
  previews: {
    'preview-hq-mp3': string;
    [key: string]: string;
  };
  type?: string;
  duration: string | number;
}

interface FavoriteResponse {
  id: string;
  userId: string;
  soundId: string;
  soundName: string;
  soundUrl: string;
  previewUrl: string;
  category: string;
  duration: number;
  createdAt: string;
}

export const getFavorites = async (userId: string): Promise<FavoriteResponse[]> => {
  try {
    return await fetchWithAuth(API_ENDPOINTS.GET_USER_FAVORITES(userId));
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }
};

export const addToFavorites = async (userId: string, sound: FavoriteSound): Promise<FavoriteResponse> => {
  try {
    return await fetchWithAuth(API_ENDPOINTS.FAVORITE_SOUNDS, {
      method: 'POST',
      body: JSON.stringify({
        userId,
        soundId: sound.id,
        soundName: sound.name,
        soundUrl: sound.url || '', // Add fallback for missing url
        previewUrl: sound.previews['preview-hq-mp3'],
        category: sound.type || 'uncategorized', // Add fallback for missing category
        duration: parseFloat(sound.duration.toString()), // Ensure duration is a number
      }),
    });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
};

export const removeFromFavorites = async (userId: string, soundId: string): Promise<void> => {
  try {
    return await fetchWithAuth(API_ENDPOINTS.REMOVE_FAVORITE(userId, soundId), {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
};
