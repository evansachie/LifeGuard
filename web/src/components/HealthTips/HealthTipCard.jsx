import React, { memo } from 'react';
import PropTypes from 'prop-types';
import './HealthTipCard.css';

const HealthTipCard = ({ tip, onReadMore, isDarkMode }) => {
  const categoryLabel = tip.category.charAt(0).toUpperCase() + tip.category.slice(1);

  const handleImageError = (e) => {
    e.target.src = 'https://placehold.co/600x400';
  };

  return (
    <div className={`health-tip-card ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="tip-image-container">
        <img
          src={tip.imageUrl}
          alt={tip.imageAlt || tip.title}
          className="tip-image"
          onError={handleImageError}
        />
        <span className={`tip-category ${tip.category}`}>
          {categoryLabel}
        </span>
      </div>
      
      <div className="tip-content">
        <h3 className="tip-title">{tip.title}</h3>
        <p className="tip-description">{tip.description}</p>
        
        <div className="tip-footer">
          <button 
            className="read-more-btn"
            onClick={() => onReadMore(tip)}
            aria-label={`Read more about ${tip.title}`}
          >
            Read More
          </button>
          
          {tip.date && (
            <span className="tip-date">
              {new Date(tip.date).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

HealthTipCard.propTypes = {
  tip: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    imageAlt: PropTypes.string,
    category: PropTypes.string.isRequired,
    date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  }).isRequired,
  onReadMore: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool
};

export default memo(HealthTipCard);
