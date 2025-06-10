import { TbMessageChatbot } from 'react-icons/tb';

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
      <TbMessageChatbot />
    </button>
  );
};

export default ChatButton;
