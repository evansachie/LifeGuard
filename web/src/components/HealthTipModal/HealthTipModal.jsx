import React, { useRef, useEffect } from 'react';
import { FaTimes, FaExternalLinkAlt } from 'react-icons/fa';
import './HealthTipModal.css';

const HealthTipModal = ({ tip, isOpen, onClose, isDarkMode }) => {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="health-tip-modal-overlay">
            <div 
                ref={modalRef}
                className={`health-tip-modal ${isDarkMode ? 'dark-mode' : ''}`}
            >
                <button className="close-button" onClick={onClose}>
                    <FaTimes />
                </button>

                <div className="modal-content">
                    <div className="modal-image-container">
                        <img 
                            src={tip.imageUrl} 
                            alt={tip.imageAlt} 
                            className="modal-image"
                        />
                    </div>
                    
                    <div className={`tip-category ${tip.category}`}>
                        {tip.category.charAt(0).toUpperCase() + tip.category.slice(1)}
                    </div>

                    <h2>{tip.title}</h2>

                    <div className="tip-description">
                        <p>{tip.description}</p>
                        {tip.longDescription && <p>{tip.longDescription}</p>}
                    </div>

                    {tip.url && (
                        <div className="tip-resources">
                            <h3>Additional Resources</h3>
                            <a 
                                href={tip.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="resource-link"
                            >
                                Learn More <FaExternalLinkAlt />
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HealthTipModal; 