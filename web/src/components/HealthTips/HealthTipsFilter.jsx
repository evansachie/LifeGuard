import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaFilter, FaChevronDown, FaChevronUp, FaCheck } from 'react-icons/fa';
import './HealthTipsFilter.css';

const HealthTipsFilter = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  isDarkMode,
  onSortChange,
  currentSort = 'newest'
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  const sortOptions = [
    { id: 'newest', label: 'Newest First' },
    { id: 'oldest', label: 'Oldest First' },
    { id: 'az', label: 'A-Z' },
    { id: 'za', label: 'Z-A' },
    { id: 'relevant', label: 'Most Relevant' }
  ];

  return (
    <div className={`health-tips-filter ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="filter-categories">
        <button
          className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => onCategoryChange('all')}
        >
          All
        </button>
        
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => onCategoryChange(category.id)}
            aria-label={`Filter by ${category.label}`}
          >
            {category.icon}
            <span className="category-label">{category.label}</span>
          </button>
        ))}
      </div>
      
      <div className="filter-actions">
        <div className="filter-sort">
          <div 
            className="advanced-filter-toggle"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            role="button"
            tabIndex={0}
            aria-expanded={showAdvancedFilters}
            aria-label="Toggle advanced filters"
          >
            <FaFilter />
            <span>Advanced</span>
            {showAdvancedFilters ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          
          {showAdvancedFilters && (
            <div className="advanced-filters-dropdown">
              <div className="sort-options">
                <h4>Sort By</h4>
                <ul>
                  {sortOptions.map(option => (
                    <li 
                      key={option.id}
                      className={currentSort === option.id ? 'active' : ''}
                      onClick={() => onSortChange(option.id)}
                    >
                      {currentSort === option.id && <FaCheck className="check-icon" />}
                      {option.label}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="time-filter">
                <h4>Time</h4>
                <div className="time-options">
                  <button className="time-option active">All Time</button>
                  <button className="time-option">This Week</button>
                  <button className="time-option">This Month</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

HealthTipsFilter.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      icon: PropTypes.node.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  selectedCategory: PropTypes.string.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool,
  onSortChange: PropTypes.func,
  currentSort: PropTypes.string
};

export default HealthTipsFilter;
