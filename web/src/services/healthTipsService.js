import MedImg1 from '../assets/med-1.svg';

// Using health.gov API with CORS proxy
const HEALTH_API_BASE = 'https://api.allorigins.win/raw?url=' + 
    encodeURIComponent('https://health.gov/myhealthfinder/api/v3/topicsearch.json?lang=en');

export const fetchHealthTips = async () => {
    try {
        // Fetch health information from health.gov through CORS proxy
        const healthResponse = await fetch(HEALTH_API_BASE, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!healthResponse.ok) {
            throw new Error('Failed to fetch health tips');
        }

        const healthData = await healthResponse.json();

        // Format and combine the data
        return {
            featured: {
                title: "Today's Health Highlight",
                description: "Learn about health and wellness tips for better living",
                image: MedImg1,
                category: "prevention"
            },
            tips: [
                ...formatHealthTips(healthData.Result?.Resources?.Resource || []),
                {
                    id: 'default-1',
                    category: 'prevention',
                    title: 'Staying Healthy During Seasonal Changes',
                    description: 'Learn how to maintain your health as seasons change with these essential tips.',
                    type: 'article'
                },
                {
                    id: 'default-2',
                    category: 'fitness',
                    title: 'Simple Home Exercises',
                    description: 'Effective exercises you can do at home to maintain your fitness levels.',
                    type: 'article'
                }
            ],
            videos: [
                {
                    id: 'v1',
                    title: 'Understanding Air Quality Index',
                    videoUrl: 'https://www.youtube.com/embed/rn9eUIbqCPU',
                    duration: '1:27'
                },
                {
                    id: 'v2',
                    title: 'Foods to Boost Your Immune System',
                    videoUrl: 'https://www.youtube.com/embed/WHQnxa3vVfk',
                    duration: '9:56'
                }
            ]
        };
    } catch (error) {
        console.error('Error fetching health tips:', error);
        return getFallbackData();
    }
};

const getCategoryFromTitle = (title = '', description = '') => {
    // More specific category mapping rules
    const categoryRules = [
        {
            category: 'emergency',
            keywords: ['emergency', 'urgent', 'critical', 'immediate', 'crisis', 'first aid', 'accident']
        },
        {
            category: 'fitness',
            keywords: ['exercise', 'fitness', 'workout', 'physical activity', 'training', 'strength', 'cardio']
        },
        {
            category: 'nutrition',
            keywords: ['diet', 'nutrition', 'food', 'eating', 'meal', 'vitamin', 'nutrient', 'healthy eating']
        },
        {
            category: 'mental',
            keywords: ['mental', 'stress', 'anxiety', 'depression', 'psychological', 'emotional', 'mindfulness']
        },
        {
            category: 'prevention',
            keywords: ['prevent', 'avoid', 'protect', 'risk', 'safety', 'precaution']
        }
    ];

    const lowerTitle = title.toLowerCase();
    const lowerDescription = description?.toLowerCase() || '';

    // Check both title and description against keywords
    for (const rule of categoryRules) {
        if (rule.keywords.some(keyword => 
            lowerTitle.includes(keyword) || lowerDescription.includes(keyword)
        )) {
            return rule.category;
        }
    }

    // If no specific category is found, check for general health terms
    const healthTerms = ['health', 'medical', 'wellness', 'care', 'treatment'];
    if (healthTerms.some(term => lowerTitle.includes(term))) {
        return 'prevention';
    }

    return 'resources'; // Default category
};

const formatHealthTips = (resources) => {
    return resources.map(resource => {
        const title = resource.Title || '';
        const description = resource.Categories || '';
        
        return {
            id: resource.Id || Math.random().toString(),
            category: getCategoryFromTitle(title, description),
            title: title,
            description: description,
            type: 'article',
            url: resource.AccessibleVersion,
            imageUrl: resource.ImageUrl || 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800',
            imageAlt: resource.ImageAlt || title
        };
    });
};

const getFallbackData = () => ({
    featured: {
        title: "Today's Health Highlight",
        description: "Learn about air quality monitoring and its impact on your health",
        image: MedImg1,
        category: "prevention"
    },
    tips: [
        {
            id: '1',
            category: 'emergency',
            title: 'Recognizing Heart Attack Symptoms',
            description: 'Learn the early warning signs of a heart attack and when to seek immediate medical attention.',
            type: 'article'
        },
        {
            id: '2',
            category: 'fitness',
            title: 'Effective Home Workout Routine',
            description: 'Simple exercises you can do at home to maintain fitness levels.',
            type: 'article'
        },
        {
            id: '3',
            category: 'nutrition',
            title: 'Balanced Diet Guidelines',
            description: 'Understanding the key components of a healthy, balanced diet.',
            type: 'article'
        },
        {
            id: '4',
            category: 'mental',
            title: 'Managing Stress and Anxiety',
            description: 'Practical techniques for maintaining mental well-being.',
            type: 'article'
        },
        {
            id: '5',
            category: 'prevention',
            title: 'Preventive Health Measures',
            description: 'Essential steps to prevent common health issues.',
            type: 'article'
        }
    ],
    videos: [
        {
            id: 'v1',
            title: 'Emergency First Aid Basics',
            videoUrl: 'https://www.youtube.com/embed/IisqrLOnqX8',
            duration: '6:42'
        }
    ]
}); 