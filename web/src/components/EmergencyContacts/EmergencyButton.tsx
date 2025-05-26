import React from 'react';
import { FaBell } from 'react-icons/fa';

interface EmergencyButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isDarkMode?: boolean;
}

const EmergencyButton: React.FC<EmergencyButtonProps> = ({ 
  onClick, 
  disabled = false,
  isDarkMode = false 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-4 py-2 ${disabled ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'} 
        text-white rounded-lg transition-colors
        ${isDarkMode ? 'shadow-dark' : 'shadow-sm'}`}
      aria-label="Send emergency alert"
    >
      <FaBell />
      <span>Emergency Alert</span>
    </button>
  );
};

export default EmergencyButton;
