import React from 'react';
import { FaPlus } from 'react-icons/fa';
import EmptyStateImg from '../../../src/assets/empty-state.svg';

const EmptyState = ({ onNewNote, isDarkMode }) => {
  return (
    <div className="memos-empty-state">
      <img src={EmptyStateImg} alt="No notes" className="empty-state-image" />
      <p>No notes found</p>
      <button 
        className="action-button new-note-button"
        onClick={onNewNote}
      >
        <FaPlus /> Create New Note
      </button>
    </div>
  );
};

export default EmptyState;
