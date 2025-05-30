import React from 'react';
import { FaSearch, FaFilter, FaStar } from 'react-icons/fa';
import { SoundFiltersProps } from '../../types/wellnessHub.types';

const SoundFilters: React.FC<SoundFiltersProps> = ({ 
  filters, 
  setFilters, 
  onSearch, 
  isDarkMode,
}) => {
  return (
    <div
      className={`
      w-full p-6 rounded-xl shadow-lg backdrop-blur-md
      transition-all duration-300 mb-8
      ${
        isDarkMode
          ? 'bg-gray-800/30 border border-gray-700/50'
          : 'bg-white/30 border border-gray-200/50'
      }
    `}
    >
      {/* Search Box */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative w-full md:w-96">
          <FaSearch
            className={`absolute left-4 top-3.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
          />
          <input
            type="text"
            placeholder="Search sounds..."
            value={filters.tags || ''}
            onChange={(e) => setFilters((prev) => ({ ...prev, tags: e.target.value }))}
            onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && onSearch()}
            className={`
              w-full pl-11 pr-4 py-3 rounded-lg
              focus:ring-2 focus:outline-none transition-colors
              ${
                isDarkMode
                  ? 'bg-gray-900/50 text-gray-100 placeholder-gray-500 border-gray-600 focus:ring-blue-500'
                  : 'bg-white/50 text-gray-800 placeholder-gray-400 border-gray-300 focus:ring-blue-400'
              } border
            `}
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          {/* Duration Filter */}
          <div
            className={`flex items-center gap-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
          >
            <div className="flex items-center gap-2">
              <FaFilter className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
              <span className="font-medium">Duration:</span>
            </div>
            <select
              value={filters.duration || ''}
              onChange={(e) => setFilters((prev) => ({ ...prev, duration: e.target.value }))}
              className={`
                rounded-lg border py-2 px-3 cursor-pointer
                focus:ring-2 focus:outline-none transition-colors
                ${
                  isDarkMode
                    ? 'bg-gray-900/50 text-gray-100 border-gray-600 focus:ring-blue-500'
                    : 'bg-white/50 text-gray-800 border-gray-300 focus:ring-blue-400'
                }
              `}
            >
              <option value="">Any length</option>
              <option value="[0 TO 60]">Under 1 min</option>
              <option value="[60 TO 180]">1-3 min</option>
              <option value="[180 TO 300]">3-5 min</option>
            </select>
          </div>

          {/* Rating Filter */}
          <div
            className={`flex items-center gap-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
          >
            <div className="flex items-center gap-2">
              <FaStar className={`text-sm ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
              <span className="font-medium">Rating:</span>
            </div>
            <select
              value={filters.rating || ''}
              onChange={(e) => setFilters((prev) => ({ ...prev, rating: e.target.value }))}
              className={`
                rounded-lg border py-2 px-3 cursor-pointer
                focus:ring-2 focus:outline-none transition-colors
                ${
                  isDarkMode
                    ? 'bg-gray-900/50 text-gray-100 border-gray-600 focus:ring-blue-500'
                    : 'bg-white/50 text-gray-800 border-gray-300 focus:ring-blue-400'
                }
              `}
            >
              <option value="">Any rating</option>
              <option value="4">4+ stars</option>
              <option value="4.5">4.5+ stars</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoundFilters;
