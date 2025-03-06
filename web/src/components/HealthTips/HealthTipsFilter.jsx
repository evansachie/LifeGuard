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
