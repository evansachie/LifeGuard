const API_KEY = import.meta.env.VITE_FREESOUND_API_KEY;
const BASE_URL = 'https://freesound.org/apiv2';

const categories = {
    nature: 'nature',
    ambience: 'ambience',
    meditation: 'meditation bells',
    water: 'water',
    birds: 'birds'
};

export const searchSounds = async (category, page = 1) => {
    try {
        const response = await fetch(
            `${BASE_URL}/search/text/?query=${categories[category]}&filter=duration:[1 TO 180]&fields=id,name,username,previews,images,duration,description&page_size=12&page=${page}&token=${API_KEY}`
        );
        
        if (!response.ok) throw new Error('Failed to fetch sounds');
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching sounds:', error);
        throw error;
    }
};

export const getSound = async (soundId) => {
    try {
        const response = await fetch(
            `${BASE_URL}/sounds/${soundId}/?token=${API_KEY}`
        );
        
        if (!response.ok) throw new Error('Failed to fetch sound');
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching sound:', error);
        throw error;
    }
};
