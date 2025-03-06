import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SiSmartthings } from "react-icons/si";
import { FaRunning, FaBrain, FaYoutube, FaBookMedical } from 'react-icons/fa';
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

  // Filter tips by category and search query
  const filteredTips = healthData?.tips?.filter(tip => 
    (selectedCategory === 'all' || tip.category === selectedCategory) &&
    (tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     tip.description.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  // Sort filtered tips
  const sortedTips = [...filteredTips].sort((a, b) => {
    switch (sortOrder) {
      case 'oldest':
        return new Date(a.date) - new Date(b.date);
      case 'az':
        return a.title.localeCompare(b.title);
      case 'za':
        return b.title.localeCompare(a.title);
      case 'relevant':
        // In a real app, you'd have a relevance algorithm
        return b.priority - a.priority;
      case 'newest':
      default:
        return new Date(b.date) - new Date(a.date);
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedTips.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTips = sortedTips.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when changing categories
  };

  const handleSortChange = (sortType) => {
    setSortOrder(sortType);
    setCurrentPage(1); // Reset to first page when changing sort
  };

  const handleReadMore = (tip) => {
    setSelectedTip(tip);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Animation variants
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

  // Pagination component
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

  // Loading state
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
      {/* Error banner if API fails */}
      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      {/* Featured Section - Shows immediately with local data */}
      <section className="featured-tip">
        <div className="featured-content">
          <h1>{healthData?.featured?.title || "Today's Featured Health Tip"}</h1>
          <p>{healthData?.featured?.description || "Stay healthy with our daily health tips and recommendations."}</p>
          <button 
            className="learn-more-btn"
            onClick={() => healthData?.featured && setSelectedTip(healthData.featured)}
          >
            Learn More
          </button>
        </div>
        <div 
          className="featured-image" 
          style={{ backgroundImage: `url(${healthData?.featured?.image || 'https://placehold.co/600x400'})` }} 
        />
      </section>

      {/* New Search and Advanced Filters */}
      <section className="controls-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search health tips..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
        
        <HealthTipsFilter 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          isDarkMode={isDarkMode}
          onSortChange={handleSortChange}
          currentSort={sortOrder}
          allCategoryIcon={<SiSmartthings />}
        />
      </section>

      {/* Tips Grid with Pagination */}
      <motion.section 
        className="tips-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {selectedCategory !== 'videos' && paginatedTips.length === 0 ? (
          <div className="no-results">
            <h3>No health tips found</h3>
            <p>Try changing your search or filter settings</p>
          </div>
        ) : selectedCategory !== 'videos' && (
          paginatedTips.map(tip => (
            <motion.div
              key={tip.id}
              className="tip-card-container"
              variants={itemVariants}
            >
              <HealthTipCard 
                tip={tip}
                onReadMore={handleReadMore}
                isDarkMode={isDarkMode}
              />
            </motion.div>
          ))
        )}
      </motion.section>

      {/* Pagination - Only show if tips exist and not in videos category */}
      {selectedCategory !== 'videos' && filteredTips.length > ITEMS_PER_PAGE && renderPagination()}

      {/* Loading indicator for API data */}
      {isLoading && !isApiLoaded && (
        <div className="api-loading-indicator">
          Updating content...
        </div>
      )}

      {/* Video Section - Only show when Videos category is selected */}
      {selectedCategory === 'videos' && (
        <section className="video-section">
          <h2>Featured Health Videos</h2>
          <div className="video-grid">
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
          </div>
        </section>
      )}

      {/* Modal for displaying full health tip details */}
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
