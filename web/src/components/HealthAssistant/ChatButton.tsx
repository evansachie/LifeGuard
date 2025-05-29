import React from 'react';
import { FaRobot } from 'react-icons/fa';

interface ChatButtonProps {
  isOpen: boolean;
  toggleChat: () => void;
}

const ChatButton: React.FC<ChatButtonProps> = ({ isOpen, toggleChat }) => {
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
