import React, { RefObject } from 'react';
import { FaPaperPlane, FaMicrophone } from 'react-icons/fa';

interface ChatInputFormProps {
  query: string;
  onQueryChange: (value: string) => void;
  onSubmit: (query?: string) => void;
  isLoading: boolean;
  isListening: boolean;
  toggleListening: () => void;
  inputRef: RefObject<HTMLInputElement>;
}

const ChatInputForm: React.FC<ChatInputFormProps> = ({
  query,
  onQueryChange,
  onSubmit,
  isLoading,
  isListening,
  toggleListening,
  inputRef,
}) => {
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (query.trim() && !isLoading && !isListening) {
      onSubmit(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="chat-input">
      <input
        ref={inputRef}
        type="text"
        value={isListening ? 'Listening...' : query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Ask about your health..."
        disabled={isLoading || isListening}
      />
      <button
        type="button"
        onClick={toggleListening}
        disabled={isLoading}
        className={`voice-button ${isListening ? 'listening' : ''}`}
        aria-label={isListening ? 'Stop listening' : 'Start voice input'}
        title={isListening ? 'Stop listening' : 'Start voice input'}
      >
        <FaMicrophone />
      </button>
      <button
        type="submit"
        disabled={isLoading || !query.trim() || isListening}
        aria-label="Send message"
        title="Send message"
      >
        <FaPaperPlane />
      </button>
    </form>
  );
};

export default ChatInputForm;
