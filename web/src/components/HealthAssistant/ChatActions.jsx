import React from 'react';
import { FaRegTrashAlt, FaDownload } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ChatActions = ({ chatHistory, onClearHistory }) => {
  if (chatHistory.length === 0) return null;

  const handleExportHistory = () => {
    if (chatHistory.length === 0) {
      toast.info('No conversation to export');
      return;
    }
    
    const userName = localStorage.getItem('userName') || 'User';
    
    let formattedChat = `LifeGuard Health Assistant Chat History - ${new Date().toLocaleDateString()}\n\n`;
    
    chatHistory.forEach(message => {
      const sender = message.type === 'user' ? userName : 'LifeGuard';
      const time = new Date(message.timestamp).toLocaleTimeString();
      const date = new Date(message.timestamp).toLocaleDateString();
      formattedChat += `[${date} ${time}] ${sender}:\n${message.content}\n\n`;
    });
    
    // Create a blob and download link
    const blob = new Blob([formattedChat], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lifeguard-chat-history-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    toast.success('Chat history exported successfully');
  };

  return (
    <div className="chat-actions">
      <button 
        className="action-button" 
        onClick={onClearHistory}
        title="Clear conversation"
      >
        <FaRegTrashAlt />
      </button>
      <button 
        className="action-button" 
        onClick={handleExportHistory}
        title="Export conversation"
      >
        <FaDownload />
      </button>
    </div>
  );
};

export default ChatActions;
