import React, { useState, useEffect, useRef } from 'react';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal/DeleteConfirmationModal';
import { FaStickyNote, FaSearch, FaPlus } from 'react-icons/fa';
import { useMemos } from '../../hooks/useMemos';

import FilterBar from '../../components/PrivateMemos/FilterBar';
import MemoForm from '../../components/PrivateMemos/MemoForm';
import MemoList from '../../components/PrivateMemos/MemoList';
import { FilterType, SortOrderType } from '../../components/PrivateMemos/FilterBar';

import './PrivateMemos.css';

interface Memo {
  Id: number;
  Text: string;
  Done: boolean;
  CreatedAt: string;
}

interface PrivateMemosProps {
  isDarkMode: boolean;
}

const PrivateMemos: React.FC<PrivateMemosProps> = ({ isDarkMode }) => {
  const [memo, setMemo] = useState<string>('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortOrder, setSortOrder] = useState<SortOrderType>('newest');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showNewNoteForm, setShowNewNoteForm] = useState<boolean>(false);
  const [editingMemoId, setEditingMemoId] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [deletingMemo, setDeletingMemo] = useState<Memo | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const {
    isLoading,
    error,
    saving,
    isDeleting,
    createMemo,
    updateMemo,
    deleteMemo,
    toggleDone,
    getFilteredAndSortedMemos,
  } = useMemos();

  const filteredMemos = getFilteredAndSortedMemos(filter, sortOrder, searchTerm);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      // "/" to focus search
      if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        if (document.activeElement !== searchInputRef.current) {
          e.preventDefault();
          searchInputRef.current?.focus();
        }
      }

      // Ctrl/⌘ + N to create new note
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        setShowNewNoteForm(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSaveMemo = async (): Promise<void> => {
    const success = await createMemo(memo);
    if (success) {
      setMemo('');
      setShowNewNoteForm(false);
    }
  };

  const handleDeleteMemo = (memo: Memo): void => {
    setDeletingMemo(memo);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async (): Promise<void> => {
    if (!deletingMemo?.Id) return;

    const success = await deleteMemo(deletingMemo.Id);
    if (success) {
      setDeleteModalOpen(false);
      setDeletingMemo(null);
    }
  };

  const handleUpdateMemo = async (id: number, updatedText: string): Promise<void> => {
    const success = await updateMemo(id, updatedText);
    if (success) {
      setEditingMemoId(null);
    }
  };

  const handleToggleDone = async (id: number, isDone: boolean): Promise<void> => {
    await toggleDone(id, isDone);
  };

  const toggleNewNoteForm = (): void => {
    setShowNewNoteForm(!showNewNoteForm);
    if (!showNewNoteForm) {
      setMemo('');
    }
  };

  return (
    <div className={`private-memos ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="header-section">
        <div className="header-left">
          <FaStickyNote className="icon" />
          <h1 className="page-title">Sticky Notes</h1>
        </div>
        <div className="header-actions">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Press / to focus"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button
            className="action-button new-note-button"
            onClick={() => setShowNewNoteForm(!showNewNoteForm)}
            title="Create new note (Ctrl+N)"
          >
            <FaPlus /> <span>New Note</span>
          </button>
        </div>
      </div>

      <FilterBar
        filter={filter}
        setFilter={setFilter}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      {showNewNoteForm && (
        <MemoForm
          memo={memo}
          setMemo={setMemo}
          handleSave={handleSaveMemo}
          handleCancel={toggleNewNoteForm}
          saving={saving}
          isDarkMode={isDarkMode}
        />
      )}

      {error && <div className="error-message">{error}</div>}

      <MemoList
        memos={filteredMemos}
        isLoading={isLoading}
        editingMemoId={editingMemoId}
        setEditingMemoId={setEditingMemoId}
        handleDeleteMemo={handleDeleteMemo}
        handleToggleDone={handleToggleDone}
        handleUpdateMemo={handleUpdateMemo}
        setShowNewNoteForm={setShowNewNoteForm}
        isDarkMode={isDarkMode}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Note"
        message="Are you sure you want to delete this note?"
        itemName={deletingMemo?.Text}
        isLoading={isDeleting}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default PrivateMemos;
