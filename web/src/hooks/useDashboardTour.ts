import { useState, useEffect } from 'react';

interface UseDashboardTourReturn {
  showTour: boolean;
  handleTourExit: () => void;
}

/**
 * Custom hook to manage dashboard tour state
 * @returns Tour state and exit handler
 */
const useDashboardTour = (): UseDashboardTourReturn => {
  const [showTour, setShowTour] = useState<boolean>(false);

  useEffect(() => {
    const shouldShowTour = localStorage.getItem('showTour') === 'true';
    if (shouldShowTour && window.location.pathname === '/dashboard') {
      setTimeout(() => {
        setShowTour(true);
      }, 1000);
    }
  }, []);

  const handleTourExit = (): void => {
    setShowTour(false);
    localStorage.removeItem('showTour');
  };

  return { showTour, handleTourExit };
};

export default useDashboardTour;
