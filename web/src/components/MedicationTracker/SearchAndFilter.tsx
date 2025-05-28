import React, { useRef, useState } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import AccessibleDropdown from '../AccessibleDropdown/AccessibleDropdown';
import { SearchAndFilterProps } from '../../types/medicationTracker.types';

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({ 
  searchTerm, 
  onSearchChange, 
  filters, 
  onFilterChange, 
  isDarkMode 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <FaSearch className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        </div>
        <input
          type="text"
          className={`w-full pl-10 pr-16 py-3 rounded-lg border ${
            isDarkMode
              ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
              : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
          } focus:ring-blue-500 focus:outline-none`}
          placeholder="Search medications..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />

        <div className="absolute inset-y-0 right-1 flex items-center">
          <div className="relative" ref={dropdownRef}>
            <AccessibleDropdown
              isOpen={isDropdownOpen}
              onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
              ariaLabel="Filter medications"
              className={`px-3 py-2 flex items-center gap-2 rounded-lg border ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              } transition-colors`}
            >
              <FaFilter /> Filters
            </AccessibleDropdown>

            {isDropdownOpen && (
              <div
                className={`absolute right-0 mt-1 p-3 rounded-lg shadow-lg z-10 w-56 ${
                  isDarkMode
                    ? 'bg-gray-800 border border-gray-700'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <div className="mb-3">
                  <div
                    className={`block mb-1 text-sm font-medium ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    Status
                  </div>
                  <select
                    value={filters.status}
                    onChange={(e) => onFilterChange('status', e.target.value)}
                    className={`w-full p-2 rounded-md border ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-gray-50 border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="">All</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="mb-3">
                  <div
                    className={`block mb-1 text-sm font-medium ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    Frequency
                  </div>
                  <select
                    value={filters.frequency}
                    onChange={(e) => onFilterChange('frequency', e.target.value)}
                    className={`w-full p-2 rounded-md border ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-gray-50 border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="">All</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <div
                    className={`block mb-1 text-sm font-medium ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    Time of Day
                  </div>
                  <select
                    value={filters.timeOfDay}
                    onChange={(e) => onFilterChange('timeOfDay', e.target.value)}
                    className={`w-full p-2 rounded-md border ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-gray-50 border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="">All</option>
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening/Night</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilter;
