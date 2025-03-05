import { useState, useEffect } from 'react';

/**
 * Custom hook to manage dashboard tour state
 * @returns {Object} Tour state and exit handler
 */
const useDashboardTour = () => {
  const [showTour, setShowTour] = useState(false);
  
  useEffect(() => {
    const shouldShowTour = localStorage.getItem('showTour') === 'true';
    if (shouldShowTour && window.location.pathname === '/dashboard') {
      setTimeout(() => {
        setShowTour(true);
      }, 1000);
    }
  }, []);
  
  const handleTourExit = () => {
    setShowTour(false);
    localStorage.removeItem('showTour');
  };
  
  return { showTour, handleTourExit };
};

export default useDashboardTour;
