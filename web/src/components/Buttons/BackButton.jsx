import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PropTypes from 'prop-types';

export const BackButton = ({ text, to, isDarkMode }) => {
  return (
    <div className="mb-8">
      <Link
        to={to}
        className={`inline-flex items-center px-4 py-2 rounded-lg ${
          isDarkMode
            ? 'bg-inner-dark hover:bg-dark-card2'
            : 'bg-white hover:bg-gray-100 text-gray-700'
        } transition-colors duration-200`}
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        {text}
      </Link>
    </div>
  );
};

BackButton.propTypes = {
  text: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  isDarkMode: PropTypes.bool,
};

BackButton.defaultProps = {
  isDarkMode: false,
};

export default BackButton;
