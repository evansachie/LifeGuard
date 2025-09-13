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
import { FaSearch, FaExclamationTriangle, FaSync } from 'react-icons/fa';
import { HealthTip, FeaturedTip } from '../../types/healthTips.types';
import './HealthTips.css';

interface HealthTipsProps {
  isDarkMode: boolean;
}

interface HealthData {
  featured: FeaturedTip;
  tips: HealthTip[];
  videos?: unknown[];
}

const ITEMS_PER_PAGE = 6;

const HealthTips = ({ isDarkMode }: HealthTipsProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [healthData, setHealthData] = useState<HealthData>(localHealthTips);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isApiLoaded, setIsApiLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTip, setSelectedTip] = useState<HealthTip | null>(null);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);

  useEffect(() => {
    const loadHealthTips = async (): Promise<void> => {
      try {
        setIsRetrying(true);
        const data = await fetchHealthTips();

        // Verify we have valid data before replacing local data
        if (data && data.tips && data.tips.length > 0) {
          setHealthData(data);
          setIsApiLoaded(true);
          setError(null);
        } else {
          throw new Error('No valid health tips received from API');
        }
      } catch (err) {
        console.error('❌ Error loading health tips:', err);
        setError('Unable to load the latest health tips. Showing local content.');
        // Keep local data as fallback
      } finally {
        setIsLoading(false);
        setIsRetrying(false);
      }
    };

    loadHealthTips();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const sortTips = (tips: HealthTip[]): HealthTip[] => {
    return [...tips].sort(
      (a, b) => new Date(b.date || Date.now()).getTime() - new Date(a.date || 0).getTime()
    );
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

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReadMore = (tip: HealthTip): void => {
    setSelectedTip(tip);
  };

  const handleFeaturedLearnMore = (): void => {
    const featuredTip: HealthTip = {
      id: 'featured',
      ...healthData.featured,
      title: healthData.featured.title,
      description: healthData.featured.description,
      imageUrl: healthData.featured.image,
      category: healthData.featured.category || 'prevention',
      type: 'featured',
    };
    setSelectedTip(featuredTip);
  };

  const handleRetry = (): void => {
    setIsLoading(true);
    setError(null);
    setIsRetrying(true);
    fetchHealthTips()
      .then((data) => {
        if (data && data.tips && data.tips.length > 0) {
          setHealthData(data);
          setIsApiLoaded(true);
          setError(null);
        } else {
          throw new Error('No valid health tips received on retry');
        }
      })
      .catch((err) => {
        console.error('❌ Error retrying health tips fetch:', err);
        setError('Still unable to load the latest health tips. Please try again later.');
      })
      .finally(() => {
        setIsLoading(false);
        setIsRetrying(false);
      });
  };

  if (isLoading && !healthData.tips.length) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-t-blue-500 border-blue-200 rounded-full mb-4"></div>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Loading health tips...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-4 md:p-6 max-w-7xl mx-auto ${
        isDarkMode ? 'text-white' : 'bg-white text-gray-900'
      }`}
    >
      {error && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            isDarkMode
              ? 'bg-yellow-900/30 text-yellow-300 border border-yellow-700'
              : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
          }`}
        >
          <FaExclamationTriangle className="flex-shrink-0 text-xl" />
          <p className="flex-grow">{error}</p>
          <button
            onClick={handleRetry}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${
              isDarkMode
                ? 'bg-yellow-800/50 hover:bg-yellow-700/50 text-white'
                : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800'
            } transition-colors`}
            disabled={isRetrying}
          >
            {isRetrying ? (
              <>
                <FaSync className="animate-spin" /> Retrying...
              </>
            ) : (
              <>
                <FaSync /> Try Again
              </>
            )}
          </button>
        </div>
      )}

      <FeaturedHealthTip featuredTip={healthData?.featured} onLearnMore={handleFeaturedLearnMore} />

      <section className="my-8 space-y-4">
        <div className="flex flex-col gap-4">
          <div
            className={`relative w-full max-w-md mx-auto md:mx-0 rounded-full overflow-hidden border ${
              isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-gray-50'
            }`}
          >
            <FaSearch
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            />
            <input
              type="text"
              placeholder="Search health tips..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              aria-label="Search health tips"
              className={`w-full py-2.5 pl-12 pr-4 ${
                isDarkMode
                  ? 'bg-gray-800 text-white placeholder-gray-400 focus:bg-gray-700'
                  : 'bg-gray-50 text-gray-900 placeholder-gray-500 focus:bg-white'
              } focus:outline-none transition-colors`}
            />
          </div>

          <div className="w-full">
            <HealthTipsFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
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
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      ) : (
        <HealthVideoGrid
          videos={featuredVideos}
          containerVariants={containerVariants}
          itemVariants={itemVariants}
        />
      )}

      {isLoading && isApiLoaded && (
        <div
          className={`py-3 text-center text-sm rounded-md mt-6 flex items-center justify-center gap-2 ${
            isDarkMode ? 'bg-gray-800 text-blue-400' : 'bg-blue-50 text-blue-700'
          }`}
        >
          <span className="inline-block animate-spin">⟳</span>
          Updating content from MyHealthfinder...
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
};

export default HealthTips;
