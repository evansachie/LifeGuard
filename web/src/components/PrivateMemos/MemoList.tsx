import React from 'react';
import MemoCard from './MemoCard';
import EmptyState from './EmptyState';
import Spinner from '../Spinner/Spinner';

interface Memo {
  Id: number;
  Text: string;
  Done: boolean;
  CreatedAt: string;
}

interface MemoListProps {
  memos: Memo[];
  isLoading: boolean;
  editingMemoId: number | null;
  setEditingMemoId: (id: number | null) => void;
  handleDeleteMemo: (memo: Memo) => void;
  handleToggleDone: (id: number, done: boolean) => void;
  handleUpdateMemo: (id: number, text: string) => void;
  setShowNewNoteForm: (show: boolean) => void;
  isDarkMode: boolean;
}

const MemoList: React.FC<MemoListProps> = ({
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
