import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ImageSlider.css';

const ImageSlider = ({ slides, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, interval);

    return () => clearInterval(timer);
  }, [slides.length, interval]);

  return (
    <div className="slider-container">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="slider-slide"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={slides[currentIndex].image}
            alt={slides[currentIndex].alt || 'auth illustration'}
            className="slider-image"
          />
          <div className="slider-text">{slides[currentIndex].text}</div>
        </motion.div>
      </AnimatePresence>
      <div className="slider-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`slider-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
