import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaRunning, FaBrain, FaYoutube, FaBookMedical, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { MdHealthAndSafety, MdRestaurant } from 'react-icons/md';
import { fetchHealthTips } from '../../services/healthTipsService';
import { localHealthTips } from '../../data/healthTipsData';
import { featuredVideos } from '../../data/featured-videos-data';
import HealthTipModal from '../../components/HealthTipModal/HealthTipModal';
import HealthTipsFilter from '../../components/HealthTips/HealthTipsFilter';
import HealthTipCard from '../../components/HealthTips/HealthTipCard';
import './HealthTips.css';

// Define categories with icons
const categories = [
  { id: 'fitness', icon: <FaRunning />, label: 'Fitness' },
  { id: 'mental', icon: <FaBrain />, label: 'Mental Health' },
  { id: 'nutrition', icon: <MdRestaurant />, label: 'Nutrition' },
  { id: 'prevention', icon: <MdHealthAndSafety />, label: 'Prevention' },
  { id: 'resources', icon: <FaBookMedical />, label: 'Resources' },
  { id: 'videos', icon: <FaYoutube />, label: 'Featured Videos' }
];

const ITEMS_PER_PAGE = 6;

function HealthTips({ isDarkMode }) {
  // State
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [healthData, setHealthData] = useState(localHealthTips);
  const [currentPage, setCurrentPage] = useState(1);
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTip, setSelectedTip] = useState(null);
  const [sortOrder, setSortOrder] = useState('newest');
  
  // Fetch health tips
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

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const sortTips = (tips) => {
    return [...tips].sort((a, b) => new Date(b.date || Date.now()) - new Date(a.date || 0));
  };

  const filteredTips = healthData?.tips.filter(tip => 
    (selectedCategory === 'all' || tip.category === selectedCategory) &&
    (tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     tip.description.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  const sortedAndFilteredTips = sortTips(filteredTips);

  // Pagination
  const totalPages = Math.ceil(sortedAndFilteredTips.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTips = sortedAndFilteredTips.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (sortType) => {
    setSortOrder(sortType);
    setCurrentPage(1);
  };

  const handleReadMore = (tip) => {
    setSelectedTip(tip);
  };

  const handleFeaturedLearnMore = () => {
    const featuredTip = {
      ...healthData.featured,
      title: healthData.featured.title,
      description: healthData.featured.description,
      imageUrl: healthData.featured.image,
      category: healthData.featured.category || 'prevention'
    };
    setSelectedTip(featuredTip);
  };

  const renderPagination = () => {
    const renderPageNumbers = () => {
      const pages = [];
      
      if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        
        if (currentPage > 3) {
          pages.push('...');
        }
        
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(currentPage + 1, totalPages - 1); i++) {
          pages.push(i);
        }
        
        if (currentPage < totalPages - 2) {
          pages.push('...');
        }
        
        if (totalPages > 1) {
          pages.push(totalPages);
        }
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
          className="pagination-button prev-button"
          aria-label="Previous page"
        >
          Previous
        </button>
        
        <div className="page-numbers">
          {renderPageNumbers()}
        </div>
        
        <button 
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-button next-button"
          aria-label="Next page"
        >
          Next
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
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  if (isLoading && !healthData) {
    return (
      <div className={`health-tips-loading ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className="loader"></div>
        <p>Loading health tips...</p>
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

      <motion.section 
        className="featured-tip"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="featured-content">
          <h1>{healthData?.featured.title}</h1>
          <p>{healthData?.featured.description}</p>
          <button className="learn-more-btn" onClick={handleFeaturedLearnMore}>Learn More</button>
        </div>
        <div className="featured-image" style={{ backgroundImage: `url(${healthData?.featured.image})` }} />
      </motion.section>

      <section className="controls-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search health tips..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search health tips"
          />
        </div>
        
        <HealthTipsFilter 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          isDarkMode={isDarkMode}
        />
      </section>

      {selectedCategory !== 'videos' ? (
        <>
          <motion.section 
            className="tips-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {paginatedTips.length > 0 ? paginatedTips.map(tip => (
              <motion.div
                key={tip.id}
                variants={itemVariants}
              >
                <HealthTipCard 
                  tip={tip}
                  onReadMore={handleReadMore}
                  isDarkMode={isDarkMode}
                />
              </motion.div>
            )) : (
              <div className="no-results">
                <p>No health tips found matching your criteria. Try adjusting your search or filters.</p>
              </div>
            )}
          </motion.section>

          {sortedAndFilteredTips.length > ITEMS_PER_PAGE && renderPagination()}
        </>
      ) : (
        <section className="video-section">
          <motion.div 
            className="video-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {featuredVideos.map(video => (
              <motion.div
                key={video.id}
                className="video-card"
                variants={itemVariants}
              >
                <div className="video-thumbnail">
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
          </motion.div>
        </section>
      )}

      {isLoading && !isApiLoaded && (
        <div className="api-loading-indicator">
          Updating content...
        </div>
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
