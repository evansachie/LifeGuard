import React from 'react';

const Message = ({ message, isDarkMode }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatContent = (content) => {
    if (!content) return '';

    return content.split('\n').map((paragraph, i) => {
      if (!paragraph.trim()) return <br key={i} />;
      return <p key={i}>{paragraph}</p>;
    });
  };

  return (
    <div className={`message ${message.type} ${message.isError ? 'error' : ''}`}>
      <div className="message-header">
        <span className={`${isDarkMode ? 'text-white' : 'text-black'} gap-2`}>
          {message.type === 'user' ? 'You' : 'LifeGuard'}
        </span>
        <span className={`${isDarkMode ? 'text-white' : 'text-black'} gap-2`}>
          {formatTime(message.timestamp)}
        </span>
      </div>
      <div className="message-content">
        {message.type === 'assistant' 
          ? formatContent(message.content)
          : message.content
        }
      </div>
    </div>
  );
};

export default Message;
