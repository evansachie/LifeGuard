import React, { useRef, useEffect } from 'react';
import Message from './Message';
import TypingIndicator from './TypingIndicator';
import EmptyChatState from './EmptyChatState';

const ChatMessages = ({ chatHistory, loading, isDarkMode, onExampleClick }) => {
  const chatContainerRef = useRef(null);

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
