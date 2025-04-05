import React from 'react';
import { motion } from 'framer-motion';

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

  // Animation variants for messages
  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
  };

  return (
    <motion.div
      className={`message ${message.type} ${message.isError ? 'error' : ''}`}
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      layout
    >
      <div className="message-header">
        <span className="sender-name">
          {message.type === 'user' ? 'You' : 'LifeGuard'}
        </span>
        <span className="timestamp">
          {formatTime(message.timestamp)}
        </span>
      </div>
      <div className="message-content">
        {message.type === 'assistant'
          ? formatContent(message.content)
          : message.content
        }
      </div>
    </motion.div>
  );
};

export default Message;
