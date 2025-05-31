import React from 'react';
import { FaSearch } from 'react-icons/fa';

interface SearchBoxProps {
  searchQuery?: string;
  onSearchChange: (query: string) => void;
  isDarkMode: boolean;
  placeholder?: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  searchQuery = '',
  onSearchChange,
  isDarkMode,
  placeholder = 'Search for help topics...',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onSearchChange(e.target.value);
  };

  return (
    <div className={`relative max-w-2xl mx-auto mt-4 ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          className={`w-full pl-10 pr-4 py-3 rounded-lg ${
            isDarkMode
              ? 'bg-gray-800 text-gray-200 focus:bg-gray-700'
              : 'bg-white text-gray-700 focus:bg-gray-50'
          } border ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          } focus:outline-none focus:ring-2 ${
            isDarkMode ? 'focus:ring-blue-500' : 'focus:ring-blue-400'
          } transition duration-200`}
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleChange}
          aria-label="Search help topics"
        />
      </div>
    </div>
  );
};

export default SearchBox;
