import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Slide {
  image: string;
  text: string;
  alt?: string;
}

interface ImageSliderProps {
  slides: Slide[];
  interval?: number;
}

const ImageSlider = ({ slides, interval = 5000 }: ImageSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, interval);

    return () => clearInterval(timer);
  }, [slides.length, interval]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="flex flex-col items-center justify-center w-full"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={slides[currentIndex].image}
            alt={slides[currentIndex].alt || 'auth illustration'}
            className="max-w-[80%] h-auto object-contain"
          />
          <div className="mt-6 text-lg text-white text-center bg-black bg-opacity-45 px-5 py-3 rounded-xl max-w-[90%] shadow-md">
            {slides[currentIndex].text}
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-white scale-125'
                : 'bg-white bg-opacity-50 hover:bg-opacity-70'
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
