import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'react-feather';

export const BackButton = (text, to) => {
  return (
    <div className="mb-8 flex items-center justify-between">
        <Link 
            to={to} 
            className={`inline-flex items-center px-4 py-2 rounded-lg ${
                isDarkMode 
                    ? 'bg-inner-dark hover:bg-dark-card2' 
                    : 'bg-white hover:bg-gray-100'
            } transition-colors duration-200`}
        >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {text}
        </Link>
    </div>
  );
};
