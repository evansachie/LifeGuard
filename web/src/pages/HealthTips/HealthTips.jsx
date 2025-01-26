import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHeartbeat, FaRunning, FaAppleAlt, FaBrain, FaYoutube, FaBookMedical, FaSearch } from 'react-icons/fa';
import { MdLocalHospital, MdHealthAndSafety } from 'react-icons/md';
import MedImg1 from '../../assets/med-1.svg';
import MedImg2 from '../../assets/med-2.svg'
import './HealthTips.css';

const categories = [
  { id: 'emergency', icon: <MdLocalHospital />, label: 'Emergency Care' },
  { id: 'fitness', icon: <FaRunning />, label: 'Fitness' },
  { id: 'nutrition', icon: <FaAppleAlt />, label: 'Nutrition' },
  { id: 'mental', icon: <FaBrain />, label: 'Mental Health' },
  { id: 'prevention', icon: <MdHealthAndSafety />, label: 'Prevention' },
  { id: 'resources', icon: <FaBookMedical />, label: 'Resources' }
];

// Simulated health tips data (replace with API call)
const healthTipsData = {
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

function HealthTips({ isDarkMode }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredTips = healthTipsData.tips.filter(tip => 
    (selectedCategory === 'all' || tip.category === selectedCategory) &&
    (tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     tip.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  if (isLoading) {
    return (
      <div className={`health-tips-loading ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className="loader"></div>
        <p>Loading health tips...</p>
      </div>
    );
  }

  return (
    <div className={`health-tips-container ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* Featured Section */}
      <section className="featured-tip">
        <div className="featured-content">
          <h1>{healthTipsData.featured.title}</h1>
          <p>{healthTipsData.featured.description}</p>
          <button className="learn-more-btn">Learn More</button>
        </div>
        <div className="featured-image" style={{ backgroundImage: `url(${healthTipsData.featured.image})` }} />
      </section>

      {/* Search and Categories */}
      <section className="controls-section">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search health tips..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="categories">
          <button
            className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.icon}
              {category.label}
            </button>
          ))}
        </div>
      </section>

      {/* Tips Grid */}
      <motion.section 
        className="tips-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredTips.map(tip => (
          <motion.div
            key={tip.id}
            className={`tip-card ${tip.type}`}
            variants={itemVariants}
          >
            {tip.type === 'video' && <FaYoutube className="type-icon" />}
            <h3>{tip.title}</h3>
            <p>{tip.description}</p>
            <div className="tip-footer">
              <span className={`tip-category ${tip.category}`}>
                {categories.find(cat => cat.id === tip.category)?.label}
              </span>
              <button className="read-more">Read More</button>
            </div>
          </motion.div>
        ))}
      </motion.section>

      {/* Video Section */}
      <section className="video-section">
        <h2>Featured Videos</h2>
        <div className="video-grid">
          {healthTipsData.videos.map(video => (
            <div key={video.id} className="video-card">
              <div className="video-iframe-container">
                <iframe
                  src={video.videoUrl}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <h4>{video.title}</h4>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HealthTips;
