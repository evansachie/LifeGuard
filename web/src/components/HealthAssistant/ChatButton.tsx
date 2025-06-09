import { FaRobot } from 'react-icons/fa';

interface ChatButtonProps {
  isOpen: boolean;
  toggleChat: () => void;
}

const ChatButton = ({ isOpen, toggleChat }: ChatButtonProps) => {
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
