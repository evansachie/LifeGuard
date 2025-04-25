import React from 'react';
import './Spinner.css';

const Spinner = ({ size = 'medium', color = '#4285F4' }) => {
  const sizeClass =
    {
      small: 'w-4 h-4',
      medium: 'w-8 h-8',
      large: 'w-12 h-12',
    }[size] || 'w-8 h-8';

  return (
    <div className={`spinner ${sizeClass}`} style={{ borderTopColor: color }}>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
