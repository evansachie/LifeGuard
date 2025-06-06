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

// Multiple API sources for health content
const API_SOURCES = {
  // Free APIs for health content
  newsApi: 'https://newsapi.org/v2/everything?q=health%20tips&apiKey=YOUR_NEWS_API_KEY',
  mediumApi: 'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/tag/health',
  devToApi: 'https://dev.to/api/articles?tag=health',

  healthlineRss:
    'https://api.rss2json.com/v1/api.json?rss_url=https://www.healthline.com/rss/health-news',
  mayoClinicRss:
    'https://api.rss2json.com/v1/api.json?rss_url=https://www.mayoclinic.org/rss/all-health-news',
};

export const fetchHealthTips = async (): Promise<HealthTipsData> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    // Try multiple sources in parallel
    const apiPromises = [fetchFromMedium(), fetchFromHealthlineRSS(), fetchFromDevTo()];

    const results = await Promise.allSettled(apiPromises);
    const successfulResults = results
      .filter(
        (result): result is PromiseFulfilledResult<HealthTip[]> => result.status === 'fulfilled'
      )
      .map((result) => result.value)
      .flat();

    if (successfulResults.length > 0) {
      console.log(`✅ Fetched ${successfulResults.length} health tips from APIs`);

      return {
        featured: generateFeaturedTip(successfulResults[0] || getFallbackData().tips[0]),
        tips: successfulResults.slice(0, 20), // Limit to 20 tips
        videos: getHealthVideos(),
      };
    } else {
      throw new Error('All API sources failed');
    }
  } catch (error) {
    console.warn('⚠️ API fetch failed, using fallback data:', error);
    return getFallbackData();
  } finally {
    clearTimeout(timeoutId);
  }
};

// Fetch from Medium RSS (no API key needed)
const fetchFromMedium = async (): Promise<HealthTip[]> => {
  const response = await fetch(API_SOURCES.mediumApi);
  const data = await response.json();

  if (data.status === 'ok' && data.items) {
    return data.items.slice(0, 8).map((item: any, index: number) => ({
      id: `medium-${index}`,
      category: 'wellness',
      title: item.title,
      description: item.description.replace(/<[^>]*>/g, '').substring(0, 200) + '...',
      type: 'article',
      url: item.link,
      imageUrl: item.thumbnail || `https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800`,
      date: new Date(item.pubDate).toISOString(),
    }));
  }
  return [];
};

// Fetch from Healthline RSS
const fetchFromHealthlineRSS = async (): Promise<HealthTip[]> => {
  const response = await fetch(API_SOURCES.healthlineRss);
  const data = await response.json();

  if (data.status === 'ok' && data.items) {
    return data.items.slice(0, 6).map((item: any, index: number) => ({
      id: `healthline-${index}`,
      category: 'prevention',
      title: item.title,
      description: item.description.replace(/<[^>]*>/g, '').substring(0, 200) + '...',
      type: 'article',
      url: item.link,
      imageUrl:
        item.enclosure?.link ||
        `https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800`,
      date: new Date(item.pubDate).toISOString(),
    }));
  }
  return [];
};

// Fetch from Dev.to API (free, no key needed)
const fetchFromDevTo = async (): Promise<HealthTip[]> => {
  const response = await fetch(API_SOURCES.devToApi);
  const data = await response.json();

  if (Array.isArray(data)) {
    return data.slice(0, 4).map((item: any) => ({
      id: `devto-${item.id}`,
      category: 'mental',
      title: item.title,
      description: item.description || 'Health and wellness tips from the developer community',
      type: 'article',
      url: item.url,
      imageUrl:
        item.cover_image || `https://images.unsplash.com/photo-1505751171710-1f6d0ace5a85?w=800`,
      date: new Date(item.published_at).toISOString(),
    }));
  }
  return [];
};

// Generate featured tip from API data
const generateFeaturedTip = (tip: HealthTip): FeaturedTip => {
  return {
    title: "Today's Health Spotlight",
    description: tip.description,
    image: tip.imageUrl || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    category: tip.category,
    imageAlt: tip.title,
  };
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

// Enhanced fallback data
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
      category: 'fitness',
      title: '10-Minute Morning Workout',
      description: 'Start your day with energy using this quick and effective morning routine.',
      type: 'article',
      imageUrl: fallbackImages[0],
      date: getRecentDate(),
    },
    {
      id: '2',
      category: 'nutrition',
      title: 'Hydration: The Foundation of Health',
      description: 'Learn why proper hydration is crucial for optimal body function.',
      type: 'article',
      imageUrl: fallbackImages[1],
      date: getRecentDate(),
    },
    {
      id: '3',
      category: 'mental',
      title: 'Mindfulness in Daily Life',
      description: 'Simple techniques to incorporate mindfulness into your busy schedule.',
      type: 'article',
      imageUrl: fallbackImages[2],
      date: getRecentDate(),
    },
    {
      id: '4',
      category: 'prevention',
      title: 'Understanding Blood Pressure',
      description: 'What your blood pressure numbers mean and how to maintain healthy levels.',
      type: 'article',
      imageUrl: fallbackImages[3],
      date: getRecentDate(),
    },
    {
      id: '5',
      category: 'fitness',
      title: 'Strength Training for Beginners',
      description: 'Build muscle and improve fitness with bodyweight exercises.',
      type: 'article',
      imageUrl: fallbackImages[4],
      date: getRecentDate(),
    },
    {
      id: '6',
      category: 'nutrition',
      title: 'Superfoods for Immune Health',
      description: 'Boost your immune system naturally with these nutrient-rich foods.',
      type: 'article',
      imageUrl: fallbackImages[5],
      date: getRecentDate(),
    },
  ];

  return {
    featured: {
      title: "Today's Health Focus",
      description: 'Discover evidence-based health tips to improve your well-being',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      imageAlt: 'Health and wellness',
      category: 'wellness',
    },
    tips: fallbackTips,
    videos: getHealthVideos(),
  };
};
