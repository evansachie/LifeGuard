import React, { useRef, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { FaTimes, FaExternalLinkAlt, FaShareAlt, FaBookmark } from 'react-icons/fa';
import './HealthTipModal.css';

const HealthTipModal = ({ tip, isOpen, onClose, isDarkMode }) => {
    const modalRef = useRef(null);

    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    // Handle escape key press
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen || !tip) return null;

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: tip.title,
                text: tip.description,
                url: window.location.href,
            })
            .catch((error) => console.log('Error sharing:', error));
        }
    };

    const canShare = () => {
        return typeof navigator.share !== 'undefined';
    };

    return (
        <div 
            className="health-tip-modal-overlay" 
            role="dialog" 
            aria-labelledby="modal-title"
            aria-modal="true"
        >
            <div 
                ref={modalRef}
                className={`health-tip-modal ${isDarkMode ? 'dark-mode' : ''}`}
            >
                <div className="modal-header">
                    <h2 id="modal-title">{tip.title}</h2>
                    <button 
                        className="close-button" 
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        <FaTimes />
                    </button>
                </div>

                <div className="modal-content">
                    <div className="modal-image-container">
                        <img 
                            src={tip.imageUrl} 
                            alt={tip.imageAlt || ""} 
                            className="modal-image"
                            onError={(e) => {
                                e.target.src = '/images/default-health.jpg';
                            }}
                        />
                    </div>
                    
                    <div className={`tip-category ${tip.category}`}>
                        {tip.category.charAt(0).toUpperCase() + tip.category.slice(1)}
                    </div>

                    <div className="tip-description">
                        <p>{tip.description}</p>
                        {tip.longDescription && <p>{tip.longDescription}</p>}
                        {tip.tips && (
                            <div className="tip-bullet-points">
                                <h3>Key Points:</h3>
                                <ul>
                                    {tip.tips.map((point, index) => (
                                        <li key={index}>{point}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="tip-actions">
                        {tip.url && (
                            <a 
                                href={tip.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="tip-action-btn learn-more-btn"
                            >
                                Learn More <FaExternalLinkAlt />
                            </a>
                        )}
                        
                        <button 
                            className="tip-action-btn bookmark-btn"
                            aria-label="Save this tip"
                        >
                            <FaBookmark /> Save
                        </button>
                        
                        {canShare() && (
                            <button 
                                className="tip-action-btn share-btn"
                                onClick={handleShare}
                                aria-label="Share this tip"
                            >
                                <FaShareAlt /> Share
                            </button>
                        )}
                    </div>

                    {tip.relatedTips && tip.relatedTips.length > 0 && (
                        <div className="related-tips">
                            <h3>Related Tips</h3>
                            <div className="related-tips-grid">
                                {tip.relatedTips.map(relatedTip => (
                                    <div key={relatedTip.id} className="related-tip">
                                        <h4>{relatedTip.title}</h4>
                                        <p>{relatedTip.description.substring(0, 60)}...</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

HealthTipModal.propTypes = {
    tip: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        longDescription: PropTypes.string,
        imageUrl: PropTypes.string,
        imageAlt: PropTypes.string,
        category: PropTypes.string,
        tips: PropTypes.arrayOf(PropTypes.string),
        url: PropTypes.string,
        relatedTips: PropTypes.array
    }),
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    isDarkMode: PropTypes.bool
};

export default memo(HealthTipModal);