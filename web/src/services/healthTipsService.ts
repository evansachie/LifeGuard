import { API_ENDPOINTS, fetchApi } from '../utils/api';

interface Video {
  id: string;
  title: string;
  videoUrl: string;
  duration: string;
}

interface FeaturedTip {
  title: string;
  description: string;
  image: string;
  category: string;
  imageAlt?: string;
}

interface HealthTip {
  id: string;
  category: string;
  title: string;
  description: string;
  type: string;
  url?: string;
  imageUrl?: string;
  imageAlt?: string;
  placeholderImage?: string;
  date?: string | Date;
}

interface HealthTipsData {
  featured: FeaturedTip;
  tips: HealthTip[];
  videos: Video[];
}

export const fetchHealthTips = async (): Promise<HealthTipsData> => {
  try {
    // Use the backend endpoint which handles CORS and API calls
    const data = await fetchApi<HealthTipsData>(API_ENDPOINTS.HEALTH_TIPS.LIST, {
      method: 'GET',
      timeout: 20000, // 20 second timeout for health tips
    });

    if (!data || !data.tips || data.tips.length === 0) {
      throw new Error('No valid health tips received from backend');
    }
    return data;
  } catch (error) {
    console.warn('⚠️ Backend API fetch failed, using fallback data:', error);
    return getFallbackData();
  }
};

// Get curated health videos
const getHealthVideos = (): Video[] => {
  return [
    {
      id: 'v1',
      title: '5-Minute Meditation for Beginners',
      videoUrl: 'https://www.youtube.com/embed/inpok4MKVLM',
      duration: '5:23',
    },
    {
      id: 'v2',
      title: 'Quick Home Workout Routine',
      videoUrl: 'https://www.youtube.com/embed/ML4wb94dG10',
      duration: '12:45',
    },
    {
      id: 'v3',
      title: 'Healthy Meal Prep Ideas',
      videoUrl: 'https://www.youtube.com/embed/ghseFWwK9cI',
      duration: '8:30',
    },
    {
      id: 'v4',
      title: 'Breathing Exercises for Stress Relief',
      videoUrl: 'https://www.youtube.com/embed/wfDTp2GogaQ',
      duration: '6:15',
    },
  ];
};

// Enhanced fallback data with official health guidance
const getFallbackData = (): HealthTipsData => {
  const fallbackImages = [
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
    'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
    'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800',
  ];

  const getRecentDate = () => {
    const now = new Date();
    const daysAgo = Math.floor(Math.random() * 7);
    now.setDate(now.getDate() - daysAgo);
    return now.toISOString();
  };

  const fallbackTips = [
    {
      id: '1',
      category: 'prevention',
      title: 'Get Recommended Health Screenings',
      description:
        'Regular health screenings can help find problems before they start or early when treatment works better.',
      type: 'article',
      imageUrl: fallbackImages[0],
      date: getRecentDate(),
    },
    {
      id: '2',
      category: 'fitness',
      title: 'Get Moving with Physical Activity',
      description:
        'Adults need at least 150 minutes of moderate-intensity aerobic activity each week.',
      type: 'article',
      imageUrl: fallbackImages[1],
      date: getRecentDate(),
    },
    {
      id: '3',
      category: 'nutrition',
      title: 'Eat Healthy Foods',
      description:
        'A healthy eating plan emphasizes fruits, vegetables, whole grains, and fat-free or low-fat milk.',
      type: 'article',
      imageUrl: fallbackImages[2],
      date: getRecentDate(),
    },
    {
      id: '4',
      category: 'prevention',
      title: 'Take Steps to Control Your Blood Pressure',
      description:
        'High blood pressure usually has no warning signs or symptoms, so monitoring is important.',
      type: 'article',
      imageUrl: fallbackImages[3],
      date: getRecentDate(),
    },
    {
      id: '5',
      category: 'mental',
      title: 'Manage Stress for Better Health',
      description:
        'Everyone feels stressed from time to time, but chronic stress can affect your health.',
      type: 'article',
      imageUrl: fallbackImages[4],
      date: getRecentDate(),
    },
    {
      id: '6',
      category: 'prevention',
      title: 'Get Vaccinated to Protect Your Health',
      description: 'Vaccines help protect you from serious diseases and their complications.',
      type: 'article',
      imageUrl: fallbackImages[5],
      date: getRecentDate(),
    },
  ];

  return {
    featured: {
      title: 'Evidence-Based Health Guidance',
      description:
        'Get trusted health information and preventive care recommendations from government health experts',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      imageAlt: 'Health and wellness',
      category: 'prevention',
    },
    tips: fallbackTips,
    videos: getHealthVideos(),
  };
};
