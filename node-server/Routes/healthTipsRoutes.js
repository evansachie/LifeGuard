const express = require('express');
const router = express.Router();

// MyHealthfinder API Configuration
const MYHEALTHFINDER_API_BASE = 'https://odphp.health.gov/myhealthfinder/api/v4';

// Default images for categories
const getDefaultImageForCategory = (category) => {
  const categoryImages = {
    'prevention': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    'fitness': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
    'nutrition': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
    'mental': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
    'wellness': 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800',
  };
  return categoryImages[category] || categoryImages['wellness'];
};

// Fetch topic details from MyHealthfinder API
const fetchTopicDetails = async (topicId) => {
  try {
    const response = await fetch(`${MYHEALTHFINDER_API_BASE}/topicsearch.json?TopicId=${topicId}`);
    
    if (!response.ok) {
      throw new Error(`Topic fetch failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.Result?.Resources?.Resource?.[0]) {
      throw new Error('Invalid topic response structure');
    }

    return data.Result.Resources.Resource[0];
  } catch (error) {
    console.warn(`Failed to fetch topic ${topicId}:`, error.message);
    return null;
  }
};

// Convert MyHealthfinder topic to our format (with detailed data)
const convertTopicToHealthTip = (topic, isDetailed = false) => {
  let description, imageUrl, imageAlt, url;

  if (isDetailed && topic.Sections?.section?.[0]?.Content) {
    // Extract description from the first section content
    const content = topic.Sections.section[0].Content;
    const textContent = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    description = textContent.substring(0, 200) + (textContent.length > 200 ? '...' : '');
  } else {
    // Fallback description
    description = `Learn about ${topic.Title.toLowerCase()} and discover important health information to help you stay healthy.`;
  }

  // Use API provided image or fallback
  if (isDetailed && topic.ImageUrl) {
    imageUrl = topic.ImageUrl;
    imageAlt = topic.ImageAlt || topic.Title;
  } else {
    // Map to our categories for fallback images
    let category = 'wellness';
    const title = topic.Title.toLowerCase();
    
    if (title.includes('heart') || title.includes('blood') || title.includes('exercise') || title.includes('physical')) {
      category = 'fitness';
    } else if (title.includes('nutrition') || title.includes('eat') || title.includes('food') || title.includes('diet')) {
      category = 'nutrition';
    } else if (title.includes('mental') || title.includes('stress') || title.includes('depression')) {
      category = 'mental';
    } else if (title.includes('screening') || title.includes('test') || title.includes('prevent') || title.includes('vaccine')) {
      category = 'prevention';
    }

    imageUrl = getDefaultImageForCategory(category);
    imageAlt = topic.Title;
  }

  // Use AccessibleVersion URL if available, otherwise fallback
  if (isDetailed && topic.AccessibleVersion) {
    url = topic.AccessibleVersion;
  } else {
    url = `https://odphp.health.gov/myhealthfinder/topics/${topic.Id}`;
  }

  // Determine category
  let category = 'wellness';
  const title = topic.Title.toLowerCase();
  const categories = topic.Categories?.toLowerCase() || '';
  
  if (title.includes('heart') || title.includes('blood') || title.includes('exercise') || title.includes('physical') || categories.includes('physical')) {
    category = 'fitness';
  } else if (title.includes('nutrition') || title.includes('eat') || title.includes('food') || title.includes('diet') || categories.includes('nutrition')) {
    category = 'nutrition';
  } else if (title.includes('mental') || title.includes('stress') || title.includes('depression') || categories.includes('mental')) {
    category = 'mental';
  } else if (title.includes('screening') || title.includes('test') || title.includes('prevent') || title.includes('vaccine') || categories.includes('screening') || categories.includes('checkup')) {
    category = 'prevention';
  }

  return {
    id: `myhealthfinder-${topic.Id}`,
    category,
    title: topic.Title,
    description,
    type: 'article',
    url,
    imageUrl,
    imageAlt,
    date: topic.LastUpdate ? new Date(parseInt(topic.LastUpdate) * 1000).toISOString() : new Date().toISOString(),
  };
};

// Fetch topic details
// Get health videos
const getHealthVideos = () => {
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

// Fallback data
const getFallbackData = () => {
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
      description: 'Regular health screenings can help find problems before they start or early when treatment works better.',
      type: 'article',
      imageUrl: fallbackImages[0],
      date: getRecentDate(),
    },
    {
      id: '2',
      category: 'fitness',
      title: 'Get Moving with Physical Activity',
      description: 'Adults need at least 150 minutes of moderate-intensity aerobic activity each week.',
      type: 'article',
      imageUrl: fallbackImages[1],
      date: getRecentDate(),
    },
    {
      id: '3',
      category: 'nutrition',
      title: 'Eat Healthy Foods',
      description: 'A healthy eating plan emphasizes fruits, vegetables, whole grains, and fat-free or low-fat milk.',
      type: 'article',
      imageUrl: fallbackImages[2],
      date: getRecentDate(),
    },
    {
      id: '4',
      category: 'prevention',
      title: 'Take Steps to Control Your Blood Pressure',
      description: 'High blood pressure usually has no warning signs or symptoms, so monitoring is important.',
      type: 'article',
      imageUrl: fallbackImages[3],
      date: getRecentDate(),
    },
    {
      id: '5',
      category: 'mental',
      title: 'Manage Stress for Better Health',
      description: 'Everyone feels stressed from time to time, but chronic stress can affect your health.',
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
      description: 'Get trusted health information and preventive care recommendations from government health experts',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      imageAlt: 'Health and wellness',
      category: 'prevention',
    },
    tips: fallbackTips,
    videos: getHealthVideos(),
  };
};

// GET /api/health-tips - Fetch health tips from MyHealthfinder API
router.get('/', async (req, res) => {
  try {
    console.log('🔍 Fetching health tips from MyHealthfinder API...');
    
    // Fetch the list of available topics
    const itemListResponse = await fetch(`${MYHEALTHFINDER_API_BASE}/itemlist.json?Type=topic`);

    if (!itemListResponse.ok) {
      throw new Error(`API request failed: ${itemListResponse.status}`);
    }

    const itemListData = await itemListResponse.json();
    
    if (!itemListData.Result?.Items?.Item) {
      throw new Error('Invalid API response structure');
    }

    // Get a selection of topics (limit to 21 for performance)
    const selectedTopics = itemListData.Result.Items.Item
      .filter(item => item.Type === 'Topic')
      .slice(0, 21);

    console.log(`📋 Found ${selectedTopics.length} topics to fetch details for`);

    // Fetch detailed information for selected topics
    const topicDetailsPromises = selectedTopics.map(topic =>
      fetchTopicDetails(topic.Id)
    );

    const topicDetailsResults = await Promise.allSettled(topicDetailsPromises);
    
    const successfulTopics = topicDetailsResults
      .filter(result => result.status === 'fulfilled' && result.value !== null)
      .map(result => result.value);

    console.log(`✅ Successfully fetched ${successfulTopics.length} topic details`);

    // If we have detailed topics, use them; otherwise fallback to basic list
    let healthTips;
    if (successfulTopics.length > 0) {
      healthTips = successfulTopics.map(topic => convertTopicToHealthTip(topic, true));
    } else {
      console.warn('⚠️ No detailed topics fetched, using basic list data');
      healthTips = selectedTopics.map(topic => convertTopicToHealthTip(topic, false));
    }
    
    console.log(`✅ Successfully converted ${healthTips.length} health tips`);

    // Create featured tip from the first topic
    const featured = {
      title: "Today's Health Spotlight",
      description: healthTips[0].description,
      image: healthTips[0].imageUrl,
      category: healthTips[0].category,
      imageAlt: healthTips[0].title,
    };

    const response = {
      featured,
      tips: healthTips,
      videos: getHealthVideos(),
    };

    res.json(response);

  } catch (error) {
    console.warn('⚠️ MyHealthfinder API fetch failed, using fallback data:', error);
    
    // Return fallback data instead of error
    res.json(getFallbackData());
  }
});

// GET /api/health-tips/topics - Get list of available topics
router.get('/topics', async (req, res) => {
  try {
    const response = await fetch(`${MYHEALTHFINDER_API_BASE}/itemlist.json?Type=topic`);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ error: 'Failed to fetch topics' });
  }
});

// GET /api/health-tips/topic/:id - Get specific topic details
router.get('/topic/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 Fetching detailed topic ${id} from MyHealthfinder API...`);
    
    const topicDetail = await fetchTopicDetails(id);
    
    if (!topicDetail) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    const healthTip = convertTopicToHealthTip(topicDetail, true);
    console.log(`✅ Successfully fetched topic details for: ${healthTip.title}`);
    res.json(healthTip);
  } catch (error) {
    console.error('Error fetching topic:', error);
    res.status(500).json({ error: 'Failed to fetch topic details' });
  }
});

module.exports = router;
