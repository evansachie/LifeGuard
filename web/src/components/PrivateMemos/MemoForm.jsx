import React from 'react';
import Spinner from '../Spinner/Spinner';

const MemoForm = ({ 
  memo, 
  setMemo, 
  handleSave, 
  handleCancel, 
  isEditing = false, 
  saving = false
}) => {
  return (
    <div className="memo-input-container">
      <textarea
        className={isEditing ? "edit-memo-input" : "memo-input"}
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        placeholder="Write your note here..."
        autoFocus
      />
      <div className="memo-input-actions">
        <button 
          className="action-button cancel-button" 
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button 
          className="action-button save-memo-button" 
          onClick={handleSave}
          disabled={saving || !memo.trim()}
        >
          {saving ? <Spinner size="small" color="white" /> : isEditing ? 'Update Note' : 'Save Note'}
        </button>
      </div>
    </div>
  );
};

export default MemoForm;
