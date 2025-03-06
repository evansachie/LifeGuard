import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaExternalLinkAlt, FaClock, FaCalendarAlt, FaTag, FaShareAlt } from 'react-icons/fa';
import './HealthTipModal.css';

const HealthTipModal = ({ tip, isOpen, onClose, isDarkMode }) => {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        const handleEscKey = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscKey);
            document.body.style.overflow = 'hidden'; // Prevent scrolling of background
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscKey);
            document.body.style.overflow = ''; // Re-enable scrolling
        };
    }, [isOpen, onClose]);

    const handleShare = async () => {
        // Check if Web Share API is available
        if (navigator.share) {
            try {
                await navigator.share({
                    title: tip.title,
                    text: tip.description,
                    url: tip.url || window.location.href,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            // Fallback for browsers that don't support Web Share API
            navigator.clipboard.writeText(
                `${tip.title}\n\n${tip.description}\n\n${tip.url || window.location.href}`
            );
            alert('Link copied to clipboard!');
        }
    };

    if (!isOpen || !tip) return null;

    const categoryLabel = tip.category.charAt(0).toUpperCase() + tip.category.slice(1);
    
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    className="health-tip-modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.div 
                        ref={modalRef}
                        className={`health-tip-modal ${isDarkMode ? 'dark-mode' : ''}`}
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        transition={{ type: "spring", damping: 20 }}
                    >
                        <button 
                            className="close-button" 
                            onClick={onClose} 
                            aria-label="Close dialog"
                        >
                            <FaTimes />
                        </button>

                        <div className="modal-content">
                            <div className="modal-image-container">
                                <img 
                                    src={tip.imageUrl} 
                                    alt={tip.imageAlt || tip.title} 
                                    className="modal-image"
                                    onError={(e) => {
                                        e.target.src = '/images/default-health.jpg';
                                    }}
                                />
                                <div className="modal-image-overlay"></div>
                                <div className="modal-image-category">
                                    <span className={`tip-category ${tip.category}`}>
                                        <FaTag className="metadata-icon" />
                                        {categoryLabel}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="modal-header">
                                <h2>{tip.title}</h2>
                                
                                <div className="modal-metadata">
                                    {tip.date && (
                                        <div className="tip-date">
                                            <FaCalendarAlt className="metadata-icon" />
                                            {new Date(tip.date).toLocaleDateString()}
                                        </div>
                                    )}
                                    
                                    {tip.readTime && (
                                        <div className="tip-read-time">
                                            <FaClock className="metadata-icon" />
                                            {tip.readTime} min read
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="tip-description">
                                <p>{tip.description}</p>
                                {tip.longDescription && <p>{tip.longDescription}</p>}
                            </div>

                            <div className="tip-actions">
                                {tip.url && (
                                    <a 
                                        href={tip.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="resource-link primary-action"
                                    >
                                        Learn More <FaExternalLinkAlt />
                                    </a>
                                )}
                                
                                <button 
                                    className="resource-link secondary-action"
                                    onClick={handleShare}
                                    aria-label="Share this health tip"
                                >
                                    <FaShareAlt /> Share
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default HealthTipModal;