import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaRunning, FaBrain, FaYoutube, FaBookMedical, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { MdHealthAndSafety } from 'react-icons/md';
import { fetchHealthTips } from '../../services/healthTipsService';
import { localHealthTips } from '../../data/healthTipsData';
import { featuredVideos } from '../../data/featured-videos-data';
import HealthTipModal from '../../components/HealthTipModal/HealthTipModal';
import './HealthTips.css';

const categories = [
  { id: 'fitness', icon: <FaRunning />, label: 'Fitness' },
  { id: 'mental', icon: <FaBrain />, label: 'Mental Health' },
  { id: 'prevention', icon: <MdHealthAndSafety />, label: 'Prevention' },
  { id: 'resources', icon: <FaBookMedical />, label: 'Resources' },
  { id: 'videos', icon: <FaYoutube />, label: 'Featured Videos' }
];

const ITEMS_PER_PAGE = 6;

function HealthTips({ isDarkMode }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [healthData, setHealthData] = useState(localHealthTips);
  const [currentPage, setCurrentPage] = useState(1);
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTip, setSelectedTip] = useState(null);

  useEffect(() => {
    const loadHealthTips = async () => {
      try {
        const data = await fetchHealthTips();
        setHealthData(data);
        setIsApiLoaded(true);
        setError(null);
      } catch (err) {
        console.error('Error loading health tips:', err);
        setError('Failed to load additional health tips. Showing local content.');
      } finally {
        setIsLoading(false);
      }
    };

    loadHealthTips();
  }, []);

  const filteredTips = healthData?.tips.filter(tip => 
    (selectedCategory === 'all' || tip.category === selectedCategory) &&
    (tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     tip.description.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  // Pagination
  const totalPages = Math.ceil(filteredTips.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTips = filteredTips.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReadMore = (tip) => {
    setSelectedTip(tip);
  };

  const renderPagination = () => {
    const renderPageNumbers = () => {
      const pages = [];
      
      if (totalPages <= 5) {
        // If 5 or fewer pages, show all
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Always show first page
        pages.push(1);
        
        if (currentPage > 3) {
          pages.push('...');
        }
        
        // Show current page and one before/after
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(currentPage + 1, totalPages - 1); i++) {
          pages.push(i);
        }
        
        if (currentPage < totalPages - 2) {
          pages.push('...');
        }
        
        // Always show last page
        pages.push(totalPages);
      }
      
      return pages.map((page, index) => (
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
        ) : (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`pagination-button ${currentPage === page ? 'active' : ''}`}
          >
            {page}
          </button>
        )
      ));
    };

    return (
      <div className="pagination">
        <button 
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          <FaChevronLeft /> Prev
        </button>
        
        {renderPageNumbers()}
        
        <button 
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          Next <FaChevronRight />
        </button>
      </div>
    );
  };

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

  if (isLoading && !healthData) {
    return (
      <div className={`health-tips-loading ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className={`health-tips-container ${isDarkMode ? 'dark-mode' : ''}`}>
      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      {/* Featured Section - Shows immediately with local data */}
      <section className="featured-tip">
        <div className="featured-content">
          <h1>{healthData?.featured.title}</h1>
          <p>{healthData?.featured.description}</p>
          <button className="learn-more-btn">Learn More</button>
        </div>
        <div className="featured-image" style={{ backgroundImage: `url(${healthData?.featured.image})` }} />
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

      {/* Tips Grid with Pagination */}
      <motion.section 
        className="tips-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {paginatedTips.map(tip => (
          <motion.div
            key={tip.id}
            className={`tip-card ${tip.type}`}
            variants={itemVariants}
          >
            <img 
              src={tip.imageUrl} 
              alt={tip.imageAlt}
              className="tip-card-image"
              onError={(e) => {
                e.target.src = '/images/default-health.jpg';
              }}
            />
            <div className="tip-card-content">
              <h3>{tip.title}</h3>
              <p>{tip.description}</p>
              <div className="tip-footer">
                <span className={`tip-category ${tip.category}`}>
                  {categories.find(cat => cat.id === tip.category)?.label}
                </span>
                <button 
                  className="read-more"
                  onClick={() => handleReadMore(tip)}
                >
                  Read More
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.section>

      {/* Pagination */}
      {filteredTips.length > ITEMS_PER_PAGE && renderPagination()}

      {/* Loading indicator for API data */}
      {isLoading && !isApiLoaded && (
        <div className="api-loading-indicator">
          Updating content...
        </div>
      )}

      {selectedCategory === 'videos' && (
        <section className="video-section">
          <div className="video-grid">
            {featuredVideos.map(video => (
              <motion.div
                key={video.id}
                className="video-card"
                variants={itemVariants}
              >
                <div className="video-thumbnail">
                  <div className="video-duration">{video.duration}</div>
                  <iframe
                    src={video.videoUrl}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="video-info">
                  <h3>{video.title}</h3>
                  <p>{video.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <HealthTipModal 
        tip={selectedTip}
        isOpen={!!selectedTip}
        onClose={() => setSelectedTip(null)}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}

export default HealthTips;
