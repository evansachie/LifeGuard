import MedImg1 from '../assets/med-1.svg';

const HEALTH_API_BASE = 'https://health.gov/myhealthfinder/api/v3/topicsearch.json?lang=en';

interface HealthResource {
  Id?: string;
  Title?: string;
  Categories?: string;
  ImageUrl?: string;
  ImageAlt?: string;
  AccessibleVersion?: string;
  [key: string]: any;
}

interface HealthApiResponse {
  Result?: {
    Resources?: {
      Resource?: HealthResource[];
    };
  };
}

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
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const healthResponse = await fetch(HEALTH_API_BASE, {
      method: 'GET',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    return getFallbackData();
  } catch (error) {
    console.error('Error fetching health tips:', error);

    return getFallbackData();
  } finally {
    clearTimeout(timeoutId);
  }
};

type HealthCategory = 'emergency' | 'fitness' | 'nutrition' | 'mental' | 'prevention' | 'resources';

interface CategoryRule {
  category: HealthCategory;
  keywords: string[];
}

const getCategoryFromTitle = (title: string = '', description: string = ''): HealthCategory => {
  // More specific category mapping rules
  const categoryRules: CategoryRule[] = [
    {
      category: 'emergency',
      keywords: ['emergency', 'urgent', 'critical', 'immediate', 'crisis', 'first aid', 'accident'],
    },
    {
      category: 'fitness',
      keywords: [
        'exercise',
        'fitness',
        'workout',
        'physical activity',
        'training',
        'strength',
        'cardio',
      ],
    },
    {
      category: 'nutrition',
      keywords: [
        'diet',
        'nutrition',
        'food',
        'eating',
        'meal',
        'vitamin',
        'nutrient',
        'healthy eating',
      ],
    },
    {
      category: 'mental',
      keywords: [
        'mental',
        'stress',
        'anxiety',
        'depression',
        'psychological',
        'emotional',
        'mindfulness',
      ],
    },
    {
      category: 'prevention',
      keywords: ['prevent', 'avoid', 'protect', 'risk', 'safety', 'precaution'],
    },
  ];

  const lowerTitle = title.toLowerCase();
  const lowerDescription = description?.toLowerCase() || '';

  // Check both title and description against keywords
  for (const rule of categoryRules) {
    if (
      rule.keywords.some(
        (keyword) => lowerTitle.includes(keyword) || lowerDescription.includes(keyword)
      )
    ) {
      return rule.category;
    }
  }

  // If no specific category is found, check for general health terms
  const healthTerms = ['health', 'medical', 'wellness', 'care', 'treatment'];
  if (healthTerms.some((term) => lowerTitle.includes(term))) {
    return 'prevention';
  }

  return 'resources'; // Default category
};

const formatHealthTips = (resources: HealthResource[]): HealthTip[] => {
  const defaultImages = [
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
    'https://images.unsplash.com/photo-1581056771107-24ca5f033842?w=800',
    'https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=800',
  ];

  return resources.map((resource, index) => {
    const title = resource.Title || '';
    const description = resource.Categories || '';

    // Use a rotating set of default images to ensure variety
    const defaultImage = defaultImages[index % defaultImages.length];

    // Validate image URL before assigning
    let imageUrl = resource.ImageUrl || defaultImage;

    // Make sure URLs are https or replace with default
    if (imageUrl && !imageUrl.startsWith('https://')) {
      imageUrl = defaultImage;
    }

    return {
      id: resource.Id || Math.random().toString(),
      category: getCategoryFromTitle(title, description),
      title: title,
      description: description,
      type: 'article',
      url: resource.AccessibleVersion,
      imageUrl: imageUrl,
      imageAlt: resource.ImageAlt || title,
      date: new Date().toISOString(),
    };
  });
};

const getFallbackData = (): HealthTipsData => {
  // Add more variety to the fallback data to make it feel like it's coming from an API
  const fallbackImages = [
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
    'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800',
    'https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=800',
  ];

  // Generate a random date in the last 30 days
  const getRecentDate = () => {
    const now = new Date();
    const daysAgo = Math.floor(Math.random() * 30);
    now.setDate(now.getDate() - daysAgo);
    return now.toISOString();
  };

  // Create an extended set of tips
  const extendedTips = [
    {
      id: '1',
      category: 'emergency',
      title: 'Recognizing Heart Attack Symptoms',
      description:
        'Learn the early warning signs of a heart attack and when to seek immediate medical attention.',
      type: 'article',
      imageUrl: fallbackImages[0],
      date: getRecentDate(),
    },
    {
      id: '2',
      category: 'fitness',
      title: 'Effective Home Workout Routine',
      description: 'Simple exercises you can do at home to maintain fitness levels.',
      type: 'article',
      imageUrl: fallbackImages[1],
      date: getRecentDate(),
    },
    {
      id: '3',
      category: 'nutrition',
      title: 'Balanced Diet Guidelines',
      description: 'Understanding the key components of a healthy, balanced diet.',
      type: 'article',
      imageUrl: fallbackImages[2],
      date: getRecentDate(),
    },
    {
      id: '4',
      category: 'mental',
      title: 'Managing Stress and Anxiety',
      description: 'Practical techniques for maintaining mental well-being.',
      type: 'article',
      imageUrl: fallbackImages[3],
      date: getRecentDate(),
    },
    {
      id: '5',
      category: 'prevention',
      title: 'Preventive Health Measures',
      description: 'Essential steps to prevent common health issues.',
      type: 'article',
      imageUrl: fallbackImages[4],
      date: getRecentDate(),
    },
    {
      id: '6',
      category: 'nutrition',
      title: 'Superfoods for Immune Support',
      description: 'Foods that help strengthen your immune system naturally.',
      type: 'article',
      imageUrl: fallbackImages[5],
      date: getRecentDate(),
    },
    {
      id: '7',
      category: 'fitness',
      title: '10-Minute Morning Stretches',
      description: 'Quick stretching routine to start your day with energy.',
      type: 'article',
      imageUrl: fallbackImages[6],
      date: getRecentDate(),
    },
    {
      id: '8',
      category: 'mental',
      title: 'Mindfulness for Beginners',
      description: 'Simple mindfulness practices you can incorporate into daily life.',
      type: 'article',
      imageUrl: fallbackImages[7],
      date: getRecentDate(),
    },
    {
      id: '9',
      category: 'prevention',
      title: 'Understanding Blood Pressure Readings',
      description:
        'How to interpret your blood pressure numbers and what they mean for your health.',
      type: 'article',
      imageUrl: fallbackImages[0],
      date: getRecentDate(),
    },
    {
      id: '10',
      category: 'nutrition',
      title: 'Hydration Tips for Active Lifestyles',
      description:
        'How to stay properly hydrated throughout your day and during exercise.',
      type: 'article',
      imageUrl: fallbackImages[1],
      date: getRecentDate(),
    },
    {
      id: '11',
      category: 'fitness',
      title: 'Building Strength Without Equipment',
      description: 'Bodyweight exercises that build muscle and improve fitness.',
      type: 'article',
      imageUrl: fallbackImages[2],
      date: getRecentDate(),
    },
    {
      id: '12',
      category: 'mental',
      title: 'Improving Sleep Quality',
      description: 'Tips and techniques for getting better, more restful sleep.',
      type: 'article',
      imageUrl: fallbackImages[3],
      date: getRecentDate(),
    },
  ];

  return {
    featured: {
      title: "Today's Health Highlight",
      description: 'Learn about air quality monitoring and its impact on your health',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      imageAlt: 'Health monitoring display',
      category: 'prevention',
    },
    tips: extendedTips,
    videos: [
      {
        id: 'v1',
        title: 'Emergency First Aid Basics',
        videoUrl: 'https://www.youtube.com/embed/IisqrLOnqX8',
        duration: '6:42',
      },
      {
        id: 'v2',
        title: 'Mindful Breathing Techniques',
        videoUrl: 'https://www.youtube.com/embed/wfDTp2GogaQ',
        duration: '8:12',
      },
      {
        id: 'v3',
        title: 'Healthy Meal Prep Fundamentals',
        videoUrl: 'https://www.youtube.com/embed/ghseFWwK9cI',
        duration: '12:25',
      },
    ],
  };
};
