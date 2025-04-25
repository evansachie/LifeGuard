import React, { useState, useEffect } from 'react';
import { fetchHealthTips } from '../../services/healthTipsService';
import { localHealthTips } from '../../data/health-tips-data';
import { featuredVideos } from '../../data/featured-videos-data';
import { containerVariants, itemVariants } from '../../utils/animationVariants';
import { categories } from '../../data/health-tips-categories';
import HealthTipModal from '../../components/HealthTipModal/HealthTipModal';
import HealthTipsFilter from '../../components/HealthTips/HealthTipsFilter';
import FeaturedHealthTip from '../../components/HealthTips/FeaturedHealthTip';
import TipsGrid from '../../components/HealthTips/TipsGrid';
import HealthVideoGrid from '../../components/HealthTips/HealthVideoGrid';
import Pagination from '../../components/HealthTips/Pagination';
import { FaSearch } from 'react-icons/fa';
import './HealthTips.css';

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

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const sortTips = (tips) => {
    return [...tips].sort((a, b) => new Date(b.date || Date.now()) - new Date(a.date || 0));
  };

  const filteredTips =
    healthData?.tips.filter(
      (tip) =>
        (selectedCategory === 'all' || tip.category === selectedCategory) &&
        (tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tip.description.toLowerCase().includes(searchQuery.toLowerCase()))
    ) || [];

  const sortedAndFilteredTips = sortTips(filteredTips);

  const totalPages = Math.ceil(sortedAndFilteredTips.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTips = sortedAndFilteredTips.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      category: healthData.featured.category || 'prevention',
    };
    setSelectedTip(featuredTip);
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
      {error && <div className="error-banner">{error}</div>}

      <FeaturedHealthTip featuredTip={healthData?.featured} onLearnMore={handleFeaturedLearnMore} />

      <section className="controls-section">
        <div className="search-bar">
          <FaSearch className="search-icon" />
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
          <TipsGrid
            tips={paginatedTips}
            onReadMore={handleReadMore}
            isDarkMode={isDarkMode}
            containerVariants={containerVariants}
            itemVariants={itemVariants}
          />

          {sortedAndFilteredTips.length > ITEMS_PER_PAGE && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <HealthVideoGrid
          videos={featuredVideos}
          containerVariants={containerVariants}
          itemVariants={itemVariants}
        />
      )}

      {isLoading && !isApiLoaded && (
        <div className="api-loading-indicator">Updating content...</div>
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
