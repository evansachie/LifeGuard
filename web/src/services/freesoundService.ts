interface ImportMetaEnv {
  readonly VITE_FREESOUND_API_KEY: string;
  [key: string]: any;
}

const API_KEY = import.meta.env.VITE_FREESOUND_API_KEY;
const BASE_URL = 'https://freesound.org/apiv2';
import { API_ENDPOINTS } from '../utils/api';

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

interface SearchFilters {
  duration?: [number, number];
  rating?: number;
  tags?: string;
}

interface Preview {
  'preview-hq-mp3': string;
  'preview-lq-mp3': string;
  [key: string]: string;
}

interface Sound {
  id: number;
  name: string;
  username: string;
  previews: Preview;
  images: {
    waveform_m: string;
    [key: string]: string;
  };
  duration: number;
  description: string;
  avg_rating: number;
  tags: string[];
}

interface SearchResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Sound[];
}

export const searchSounds = async (
  category: string, 
  page: number = 1, 
  filters: SearchFilters = {}
): Promise<SearchResponse> => {
  try {
    const { duration, rating, tags } = filters;
    let query = categories[category];

    if (tags) {
      query += ` ${tags}`;
    }

    const durationFilter = duration ? `&filter=duration:[${duration[0]} TO ${duration[1]}]` : '';
    const ratingFilter = rating ? `&filter=avg_rating:[${rating} TO 5]` : '';

    const response = await fetch(
      `${BASE_URL}/search/text/?query=${query}${durationFilter}${ratingFilter}&fields=id,name,username,previews,images,duration,description,avg_rating,tags&page_size=12&page=${page}&token=${API_KEY}`
    );

    if (!response.ok) throw new Error('Failed to fetch sounds');

    return await response.json();
  } catch (error) {
    console.error('Error fetching sounds:', error);
    throw error;
  }
};

export const getSound = async (soundId: number): Promise<Sound> => {
  try {
    const response = await fetch(`${BASE_URL}/sounds/${soundId}/?token=${API_KEY}`);

    if (!response.ok) throw new Error('Failed to fetch sound');

    return await response.json();
  } catch (error) {
    console.error('Error fetching sound:', error);
    throw error;
  }
};

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
