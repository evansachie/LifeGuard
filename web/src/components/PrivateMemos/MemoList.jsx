import React from 'react';
import MemoCard from './MemoCard';
import EmptyState from './EmptyState';
import Spinner from '../Spinner/Spinner';

const MemoList = ({
  memos,
  isLoading,
  editingMemoId,
  setEditingMemoId,
  handleDeleteMemo,
  handleToggleDone,
  handleUpdateMemo,
  setShowNewNoteForm,
  isDarkMode,
}) => {
  if (isLoading) {
    return (
      <div className="memos-loading-state">
        <Spinner size="large" color={isDarkMode ? '#fff' : '#4285F4'} />
      </div>
    );
  }

  if (memos.length === 0) {
    return <EmptyState onNewNote={() => setShowNewNoteForm(true)} isDarkMode={isDarkMode} />;
  }

  return (
    <div className="saved-memos-container">
      {memos.map((memo) => (
        <MemoCard
          key={memo.Id}
          memo={memo}
          onEdit={setEditingMemoId}
          onDelete={handleDeleteMemo}
          onToggleDone={handleToggleDone}
          onUpdateMemo={handleUpdateMemo}
          isEditing={editingMemoId === memo.Id}
          isDarkMode={isDarkMode}
        />
      ))}
    </div>
  );
};

export default MemoList;
