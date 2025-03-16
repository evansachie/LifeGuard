const API_KEY = import.meta.env.VITE_FREESOUND_API_KEY;
const BASE_URL = 'https://freesound.org/apiv2';
const PROXY_URL = 'https://lifeguard-node.onrender.com/api/freesound';  // Production URL
// const PROXY_URL = 'http://localhost:5001/api/freesound';  // Development URL

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

export const getProxiedAudioUrl = async (originalUrl) => {
    try {
        const response = await fetch(`${PROXY_URL}/audio-proxy`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: originalUrl })
        });
        
        if (!response.ok) throw new Error('Failed to get proxied audio URL');
        
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error('Error getting proxied audio:', error);
        throw error;
    }
};
