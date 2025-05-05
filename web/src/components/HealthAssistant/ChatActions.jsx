import React, { useState } from 'react';
import { FaRegTrashAlt, FaDownload } from 'react-icons/fa';
import { toast } from 'react-toastify';
import DeleteConfirmationModal from '../DeleteConfirmationModal/DeleteConfirmationModal';

const ChatActions = ({ chatHistory, onClearHistory, isDarkMode }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (chatHistory.length === 0) return null;

  const handleExportHistory = () => {
    if (chatHistory.length === 0) {
      toast.info('No conversation to export');
      return;
    }

    const userName = localStorage.getItem('userName') || 'User';

    let formattedChat = `LifeGuard Health Assistant Chat History - ${new Date().toLocaleDateString()}\n\n`;

    chatHistory.forEach((message) => {
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

  const handleClearHistoryClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmClearHistory = () => {
    onClearHistory();
    setIsDeleteModalOpen(false);
    // Only show one toast message
    toast.success('Chat history cleared');
  };

  return (
    <>
      <div className="chat-actions">
        <button
          className="action-button"
          onClick={handleClearHistoryClick}
          title="Clear conversation"
        >
          <FaRegTrashAlt />
        </button>
        <button className="action-button" onClick={handleExportHistory} title="Export conversation">
          <FaDownload />
        </button>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmClearHistory}
        title="Clear Conversation"
        message="Are you sure you want to clear the chat history? This action cannot be undone."
        isDarkMode={isDarkMode}
      />
    </>
  );
};

export default ChatActions;
