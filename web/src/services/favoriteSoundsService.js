import { API_ENDPOINTS, fetchWithAuth } from '../utils/api';

export const getFavorites = async (userId) => {
    try {
        return await fetchWithAuth(API_ENDPOINTS.GET_USER_FAVORITES(userId));
    } catch (error) {
        console.error('Error fetching favorites:', error);
        throw error;
    }
};

export const addToFavorites = async (userId, sound) => {
    try {
        return await fetchWithAuth(API_ENDPOINTS.FAVORITE_SOUNDS, {
            method: 'POST',
            body: JSON.stringify({
                userId,
                soundId: sound.id,
                soundName: sound.name,
                soundUrl: sound.url,
                previewUrl: sound.previews['preview-hq-mp3'],
                category: sound.type,
                duration: sound.duration
            })
        });
    } catch (error) {
        console.error('Error adding to favorites:', error);
        throw error;
    }
};

export const removeFromFavorites = async (userId, soundId) => {
    try {
        return await fetchWithAuth(API_ENDPOINTS.REMOVE_FAVORITE(userId, soundId), {
            method: 'DELETE'
        });
    } catch (error) {
        console.error('Error removing from favorites:', error);
        throw error;
    }
};
