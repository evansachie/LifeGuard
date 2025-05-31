import React, { useRef, useEffect } from 'react';
import Message from './Message';
import TypingIndicator from './TypingIndicator';
import EmptyChatState from './EmptyChatState';

interface ChatMessage {
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date | string;
  isError?: boolean;
}

interface ChatMessagesProps {
  chatHistory: ChatMessage[];
  loading: boolean;
  isDarkMode: boolean;
  onExampleClick: (question: string) => void;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  chatHistory,
  loading,
  isDarkMode,
  onExampleClick,
}) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, loading]);

  return (
    <div className="chat-body" ref={chatContainerRef}>
      {chatHistory.length === 0 ? (
        <EmptyChatState onExampleClick={onExampleClick} />
      ) : (
        <div className="messages">
          {chatHistory.map((message, index) => (
            <Message key={index} message={message} isDarkMode={isDarkMode} />
          ))}
          {loading && <TypingIndicator />}
        </div>
      )}
    </div>
  );
};

export default ChatMessages;
