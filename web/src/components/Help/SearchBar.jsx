import React from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ searchQuery, onSearchChange, isDarkMode }) => {
  return (
    <div className="relative">
      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="Search for help..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className={`w-full pl-10 pr-4 py-2 rounded-lg ${
          isDarkMode
            ? 'bg-gray-800 border-gray-700 focus:border-blue-500'
            : 'bg-white border-gray-300 focus:border-blue-400'
        } border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
      />
    </div>
  );
};

export default SearchBar;
