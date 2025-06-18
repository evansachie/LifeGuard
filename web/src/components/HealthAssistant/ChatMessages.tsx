import { useRef, useEffect } from 'react';
import Message from './Message';
import EmptyChatState from './EmptyChatState';
import TypingIndicator from './TypingIndicator';

interface ChatMessagesProps {
  messages: {
    id?: string;
    type: 'user' | 'assistant' | 'system';
    text: string;
    timestamp: string;
    isError?: boolean;
    source?: 'with-context' | 'no-context';
  }[];
  isLoading: boolean;
  isDarkMode?: boolean;
  hasRagContext?: boolean | null;
  onExampleClick: (question: string) => void;
}

const ChatMessages = ({
  messages,
  isLoading,
  isDarkMode = false,
  hasRagContext = null,
  onExampleClick,
}: ChatMessagesProps) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="chat-body" ref={chatContainerRef}>
      {messages.length === 0 ? (
        <EmptyChatState
          onExampleClick={onExampleClick}
          isDarkMode={isDarkMode}
          hasRagContext={hasRagContext}
        />
      ) : (
        <div className="messages">
          {messages.map((message, index) => {
            // Get the previous message if it exists
            const previousMessage = index > 0 ? messages[index - 1] : null;

            return (
              <Message
                key={message.id || `msg-${index}`}
                message={message}
                previousMessage={previousMessage}
                isDarkMode={isDarkMode}
              />
            );
          })}
          {isLoading && <TypingIndicator />}
        </div>
      )}
    </div>
  );
};

export default ChatMessages;
