import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = "logo", 
  width, 
  height 
}) => {
  return (
    <Link to="/">
      <img 
        src="/images/lifeguard-2.svg" 
        alt="lifeguard logo" 
        className={className}
        style={{ 
          width: width ? width : 'auto', 
          height: height ? height : 'auto' 
        }}
      />
    </Link>
  );
};

export default Logo;
