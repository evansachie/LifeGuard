import React from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchAndFilter = ({ searchTerm, onSearchChange, filters, onFilterChange, isDarkMode }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      {/* Search Bar */}
      <div className="relative flex-1">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search medications..."
          className={`w-full pl-12 pr-4 py-3 rounded-lg border transition-colors ${
            isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'
          }`}
        />
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <select
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className={`rounded-lg px-4 py-3 border ${
            isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'
          }`}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <select
          value={filters.frequency}
          onChange={(e) => onFilterChange('frequency', e.target.value)}
          className={`rounded-lg px-4 py-3 border ${
            isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'
          }`}
        >
          <option value="">All Frequencies</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>

        <select
          value={filters.timeOfDay}
          onChange={(e) => onFilterChange('timeOfDay', e.target.value)}
          className={`rounded-lg px-4 py-3 border ${
            isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'
          }`}
        >
          <option value="">All Times</option>
          <option value="morning">Morning</option>
          <option value="afternoon">Afternoon</option>
          <option value="evening">Evening</option>
        </select>
      </div>
    </div>
  );
};

export default SearchAndFilter;
