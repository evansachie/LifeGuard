import React from 'react';
import { FcGoogle } from 'react-icons/fc';

interface OAuthButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isLoading?: boolean;
  isDarkMode?: boolean;
}

const OAuthButton: React.FC<OAuthButtonProps> = ({ 
  onClick, 
  isLoading = false,
  isDarkMode = false
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`w-full flex items-center justify-center gap-2 px-4 py-2 mt-4 border 
        ${isDarkMode 
          ? 'border-gray-600 hover:bg-gray-700 text-gray-200' 
          : 'border-gray-300 hover:bg-gray-100 text-gray-700'} 
        rounded-md transition-colors`}
    >
      <FcGoogle size={20} />
      <span className={isDarkMode ? 'text-gray-200' : 'text-gray-500'}>Continue with Google</span>
    </button>
  );
};

export default OAuthButton;
