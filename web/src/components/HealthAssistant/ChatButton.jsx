import React from 'react';
import { FaRobot } from 'react-icons/fa';

const ChatButton = ({ isOpen, toggleChat }) => {
  return (
    <button 
      className={`floating-button ${isOpen ? 'hidden' : ''}`} 
      onClick={toggleChat}
      aria-label="Open Health Assistant"
    >
      <FaRobot />
    </button>
  );
};

export default ChatButton;
