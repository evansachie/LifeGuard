import React from 'react';
import './Spinner.css';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'medium',
  color = '#4285F4',
  className = '',
}) => {
  const sizeClass =
    {
      small: 'w-4 h-4',
      medium: 'w-8 h-8',
      large: 'w-12 h-12',
    }[size] || 'w-8 h-8';

  return (
    <div className={`spinner ${sizeClass} ${className}`} style={{ borderTopColor: color }}>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
