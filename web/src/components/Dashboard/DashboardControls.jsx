import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaSortAmountDown, FaListUl, FaTh, FaChevronDown } from 'react-icons/fa';
import './DashboardControls.css';

const DashboardControls = ({
  isDarkMode,
  onSearchChange,
  onViewChange,
  onFilterChange,
  onSortChange,
  filterOptions = {
    temperature: true,
    humidity: true,
    airQuality: true,
    alerts: true
  },
  sortOption = 'newest',
  viewMode = 'grid' 
}) => {
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [localFilters, setLocalFilters] = useState(filterOptions);
  const [localSort, setLocalSort] = useState(sortOption);
  
  // Update local state when props change
  useEffect(() => {
    setLocalFilters(filterOptions);
  }, [filterOptions]);
  
  useEffect(() => {
    setLocalSort(sortOption);
  }, [sortOption]);
  
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const toggleFilterMenu = () => {
    // Close sort menu first to avoid z-index conflicts
    setIsSortMenuOpen(false);
    
    // Small timeout to ensure proper rendering
    setTimeout(() => {
      setIsFilterMenuOpen(!isFilterMenuOpen);
    }, 10);
  };

  const toggleSortMenu = () => {
    // Close filter menu first to avoid z-index conflicts
    setIsFilterMenuOpen(false);
    
    // Small timeout to ensure proper rendering
    setTimeout(() => {
      setIsSortMenuOpen(!isSortMenuOpen);
    }, 10);
  };
  
  const handleFilterOptionChange = (e) => {
    const { id, checked } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [id]: checked
    }));
  };
  
  const applyFilters = () => {
    if (onFilterChange) {
      Object.entries(localFilters).forEach(([key, value]) => {
        onFilterChange(key, value);
      });
    }
    setIsFilterMenuOpen(false);
  };
  
  const handleSortOptionChange = (e) => {
    const { id } = e.target;
    setLocalSort(id);
  };
  
  const applySort = () => {
    if (onSortChange) {
      onSortChange(localSort);
    }
    setIsSortMenuOpen(false);
  };

  const handleViewChange = (view) => {
    if (onViewChange) {
      onViewChange(view);
    }
  };
  
  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isFilterMenuOpen &&
        !event.target.closest('.filter-container')
      ) {
        setIsFilterMenuOpen(false);
      }
      
      if (
        isSortMenuOpen &&
        !event.target.closest('.sort-container')
      ) {
        setIsSortMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterMenuOpen, isSortMenuOpen]);

  return (
    <div className={`dashboard-controls ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search dashboard..."
          value={searchValue}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      
      <div className="controls-right">
        <div className="filter-container">
          <button 
            className={`control-btn ${isFilterMenuOpen ? 'active' : ''}`} 
            onClick={toggleFilterMenu}
          >
            <FaFilter /> <span>Filter</span> <FaChevronDown />
          </button>
          
          {isFilterMenuOpen && (
            <div className="dropdown-menu filter-menu">
              <div className="filter-option">
                <input 
                  type="checkbox" 
                  id="temperature" 
                  checked={localFilters.temperature}
                  onChange={handleFilterOptionChange}
                />
                <div
                  className={`${isDarkMode ? 'text-white' : 'text-black'}`} 
                  htmlFor="temperature">Temperature & Weather
                </div>
              </div>
              <div className="filter-option">
                <input 
                  type="checkbox" 
                  id="airQuality" 
                  checked={localFilters.airQuality}
                  onChange={handleFilterOptionChange}
                />
                <div 
                  className={`${isDarkMode ? 'text-white' : 'text-black'}`}
                  htmlFor="airQuality">Air Quality
                </div>
              </div>
              <div className="filter-option">
                <input 
                  type="checkbox" 
                  id="alerts" 
                  checked={localFilters.alerts}
                  onChange={handleFilterOptionChange}
                />
                <div 
                  className={`${isDarkMode ? 'text-white' : 'text-black'}`}
                  htmlFor="alerts">Alerts
                </div>
              </div>
              <button className="apply-btn" onClick={applyFilters}>Apply Filters</button>
            </div>
          )}
        </div>
        
        <div className="sort-container">
          <button 
            className={`control-btn ${isSortMenuOpen ? 'active' : ''}`} 
            onClick={toggleSortMenu}
          >
            <FaSortAmountDown /> <span>Sort</span> <FaChevronDown />
          </button>
          
          {isSortMenuOpen && (
            <div className="dropdown-menu sort-menu">
              <div className="sort-option">
                <input 
                  type="radio" 
                  name="sort" 
                  id="newest" 
                  checked={localSort === 'newest'}
                  onChange={handleSortOptionChange}
                />
                <div 
                  className={`${isDarkMode ? 'text-white' : 'text-black'}`}
                  htmlFor="newest">Newest First
                </div>
              </div>
              <div className="sort-option">
                <input 
                  type="radio" 
                  name="sort" 
                  id="oldest" 
                  checked={localSort === 'oldest'}
                  onChange={handleSortOptionChange}
                />
                <div
                  className={`${isDarkMode ? 'text-white' : 'text-black'}`} 
                  htmlFor="oldest">Oldest First
                </div>
              </div>
              <div className="sort-option">
                <input 
                  type="radio" 
                  name="sort" 
                  id="priority" 
                  checked={localSort === 'priority'}
                  onChange={handleSortOptionChange}
                />
                <div
                  className={`${isDarkMode ? 'text-white' : 'text-black'}`}
                  htmlFor="priority">Priority
                </div>
              </div>
              <button className="apply-btn" onClick={applySort}>Apply Sort</button>
            </div>
          )}
        </div>
        
        <div className="view-toggle">
          <button 
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} 
            onClick={() => handleViewChange('grid')}
          >
            <FaTh />
          </button>
          <button 
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} 
            onClick={() => handleViewChange('list')}
          >
            <FaListUl />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardControls;
