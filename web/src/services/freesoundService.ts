import { Sound, SearchFilters, SearchResponse } from '../types/wellnessHub.types';
import { API_ENDPOINTS } from '../utils/api';

const API_KEY = import.meta.env.VITE_FREESOUND_API_KEY;
const BASE_URL = 'https://freesound.org/apiv2';

interface Categories {
  [key: string]: string;
}

const categories: Categories = {
  nature: 'peaceful nature sounds relaxing',
  meditation: 'tibetan bowls meditation',
  rain: 'gentle rain ambient',
  ocean: 'calming ocean waves',
  forest: 'peaceful forest ambience',
  space: 'deep space ambient',
  bowls: 'crystal singing bowls healing',
  binaural: 'binaural beats meditation',
  flute: 'native american flute',
};

/**
 * Search for sounds on Freesound API
 * @param category - Category to search for
 * @param page - Page number for pagination
 * @param filters - Optional filters for the search
 * @returns Search results with sounds
 */
export const searchSounds = async (
  category: string,
  page: number = 1,
  filters: SearchFilters = {}
): Promise<SearchResponse> => {
  try {
    const { duration, rating, tags } = filters;
    let query = categories[category] || category;

    if (tags) {
      query += ` ${tags}`;
    }

    // Parse duration filter
    let durationFilter = '';
    if (duration) {
      durationFilter = `&filter=duration:${duration}`;
    }

    // Parse rating filter
    let ratingFilter = '';
    if (rating) {
      ratingFilter = `&filter=avg_rating:[${rating} TO 5]`;
    }

    const response = await fetch(
      `${BASE_URL}/search/text/?query=${encodeURIComponent(query)}${durationFilter}${ratingFilter}&fields=id,name,username,previews,images,duration,description,avg_rating,tags&page_size=12&page=${page}&token=${API_KEY}`
    );

    if (!response.ok) throw new Error('Failed to fetch sounds');

    return await response.json();
  } catch (error) {
    console.error('Error fetching sounds:', error);
    throw error;
  }
};

/**
 * Get sound details by ID
 * @param soundId - ID of the sound to fetch
 * @returns Sound details
 */
export const getSound = async (soundId: number | string): Promise<Sound> => {
  try {
    const response = await fetch(`${BASE_URL}/sounds/${soundId}/?token=${API_KEY}`);

    if (!response.ok) throw new Error('Failed to fetch sound');

    return await response.json();
  } catch (error) {
    console.error('Error fetching sound:', error);
    throw error;
  }
};

/**
 * Get proxied audio URL to bypass CORS issues
 * @param originalUrl - Original audio URL
 * @returns Proxied audio URL as blob
 */
export const getProxiedAudioUrl = async (originalUrl: string): Promise<string> => {
  try {
    const response = await fetch(API_ENDPOINTS.FREESOUND_AUDIO_PROXY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: originalUrl }),
    });

    if (!response.ok) throw new Error('Failed to get proxied audio URL');

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error getting proxied audio:', error);
    throw error;
  }
};
