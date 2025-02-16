import MedImg1 from '../assets/med-1.svg';

export const healthTipsData = {
  featured: {
    title: "Today's Health Highlight",
    description: "Learn about air quality monitoring and its impact on your health",
    image: MedImg1,
    category: "prevention"
  },
  tips: [
    {
      id: 1,
      category: 'emergency',
      title: 'Recognizing Heart Attack Symptoms',
      description: 'Learn the early warning signs of a heart attack and when to seek immediate medical attention.',
      type: 'article'
    },
    {
      id: 2,
      category: 'fitness',
      title: 'Quick 10-Minute Workouts',
      description: 'Effective exercises you can do anywhere to maintain your fitness levels.',
      type: 'video',
      videoUrl: 'https://youtube.com/watch?v=example'
    },
    {
      id: 3,
      category: 'nutrition',
      title: 'Foods That Boost Immunity',
      description: 'Discover the best foods to strengthen your immune system.',
      type: 'article'
    },
    {
      id: 4,
      category: 'mental',
      title: 'Stress Management Techniques',
      description: 'Simple but effective ways to manage daily stress and anxiety.',
      type: 'interactive'
    },
    {
      id: 5,
      category: 'prevention',
      title: 'Air Quality Safety Tips',
      description: 'How to protect yourself during poor air quality days.',
      type: 'article'
    },
    {
      id: 6,
      category: 'resources',
      title: 'Local Health Resources',
      description: 'Find healthcare facilities and emergency services near you.',
      type: 'tool'
    }
  ],
  videos: [
    {
      id: 'v1',
      title: 'Emergency First Aid Basics',
      videoUrl: 'https://www.youtube.com/embed/IisqrLOnqX8',
      duration: '6:42'
    },
    {
      id: 'v2',
      title: 'Understanding Air Quality Index',
      videoUrl: 'https://www.youtube.com/embed/rn9eUIbqCPU',
      duration: '1:27'
    },
    {
      id: 'v3',
      title: 'Foods to Boost Your Immune System (and Kill Viruses)',
      videoUrl: 'https://www.youtube.com/embed/WHQnxa3vVfk',
      duration: '9:56'
    }
  ]
};