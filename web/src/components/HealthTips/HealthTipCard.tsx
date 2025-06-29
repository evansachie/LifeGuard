import React, { memo, useState } from 'react';
import './HealthTipCard.css';
import Spinner from '../Spinner/Spinner';
import { HealthTip } from '../../types/healthTips.types';

interface HealthTipCardProps {
  tip: HealthTip;
  onReadMore: (tip: HealthTip) => void;
  isDarkMode: boolean;
}

const HealthTipCard = ({ tip, onReadMore, isDarkMode }: HealthTipCardProps) => {
  const [imageError, setImageError] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  const defaultImages = [
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
  ];

  const defaultImage = defaultImages[parseInt(String(tip.id).charAt(0), 36) % defaultImages.length];

  const categoryLabel = tip.category.charAt(0).toUpperCase() + tip.category.slice(1);

  const handleImageError = (): void => {
    setImageError(true);
    setImageLoaded(true);
  };

  const handleImageLoad = (): void => {
    setImageLoaded(true);
  };

  return (
    <div className={`health-tip-card ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="tip-image-container">
        {!imageLoaded && (
          <div className="image-placeholder spinner-container">
            <Spinner color="#fff" />
          </div>
        )}
        <img
          src={imageError ? defaultImage : tip.imageUrl || defaultImage}
          alt={tip.imageAlt || tip.title}
          className="tip-image"
          onError={handleImageError}
          onLoad={handleImageLoad}
          style={{ display: imageLoaded ? 'block' : 'none' }}
        />
        <span className={`tip-category ${tip.category}`}>{categoryLabel}</span>
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

          {tip.date && <span className="tip-date">{new Date(tip.date).toLocaleDateString()}</span>}
        </div>
      </div>
    </div>
  );
};

export default memo(HealthTipCard);
