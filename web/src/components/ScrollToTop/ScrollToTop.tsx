import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

interface ScrollToTopProps {
  threshold?: number;
  position?: 'bottom-left' | 'bottom-right';
}

const ScrollToTop = ({ threshold = 300, position = 'bottom-left' }: ScrollToTopProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const positionClasses =
    position === 'bottom-right'
      ? 'bottom-8 right-8 md:bottom-8 md:right-8'
      : 'bottom-8 left-8 md:bottom-8 md:left-8';

  return (
    <button
      className={`fixed ${positionClasses} bg-blue-500 text-white w-[45px] h-[45px] md:w-[45px] md:h-[45px] 
        rounded-full border-none cursor-pointer flex items-center justify-center text-xl
        shadow-lg transition-all duration-300 z-[1000] hover:bg-blue-600 hover:-translate-y-1 
        hover:shadow-xl ${isVisible ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <FaArrowUp />
    </button>
  );
};

export default ScrollToTop;
