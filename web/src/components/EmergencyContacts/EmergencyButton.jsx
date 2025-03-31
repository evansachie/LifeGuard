import React from 'react';
import { FaBell } from 'react-icons/fa';

const EmergencyButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      aria-label="Send emergency alert"
    >
      <FaBell />
      <span>Emergency Alert</span>
    </button>
  );
};

export default EmergencyButton;
