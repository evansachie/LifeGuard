import React, { useState } from 'react';
import MemoForm from './MemoForm';

interface Memo {
  Id: number;
  Text: string;
  Done: boolean;
  CreatedAt: string;
}

interface MemoCardProps {
  memo: Memo;
  onEdit: (id: number | null) => void;
  onDelete: (memo: Memo) => void;
  onToggleDone: (id: number, done: boolean) => void;
  onUpdateMemo: (id: number, text: string) => void;
  isEditing: boolean;
  isDarkMode: boolean;
}

const MemoCard: React.FC<MemoCardProps> = ({
  memo,
  onEdit,
  onDelete,
  onToggleDone,
  onUpdateMemo,
  isEditing,
  isDarkMode,
}) => {
  const [editText, setEditText] = useState<string>(memo.Text);

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSaveEdit = (): void => {
    onUpdateMemo(memo.Id, editText);
  };

  const handleCancelEdit = (): void => {
    setEditText(memo.Text);
    onEdit(null);
  };

  return (
    <div className={`saved-memo ${memo.Done ? 'done' : ''}`}>
      {isEditing ? (
        <MemoForm
          memo={editText}
          setMemo={setEditText}
          handleSave={handleSaveEdit}
          handleCancel={handleCancelEdit}
          isEditing={true}
          isDarkMode={isDarkMode}
        />
      ) : (
        <>
          <div className="memo-content" dangerouslySetInnerHTML={{ __html: memo.Text }} />
          <div className="memo-date">{formatDate(memo.CreatedAt)}</div>
          <div className="memo-actions">
            <button
              className="memo-button edit-button"
              onClick={() => onEdit(memo.Id)}
              title="Edit note"
            >
              Edit
            </button>
            <button
              className="memo-button delete-button"
              onClick={() => onDelete(memo)}
              title="Delete note"
            >
              Delete
            </button>
            <button
              className="memo-button done-button"
              onClick={() => onToggleDone(memo.Id, !memo.Done)}
              title={memo.Done ? 'Mark as active' : 'Mark as completed'}
            >
              {memo.Done ? 'Undone' : 'Done'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MemoCard;
