import React, { useState, useEffect, useRef } from 'react';
import './PrivateMemos.css';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal/DeleteConfirmationModal';
import {FaStickyNote, FaSearch, FaPlus} from 'react-icons/fa';
import { useMemos } from '../../hooks/useMemos';

import FilterBar from '../../components/PrivateMemos/FilterBar';
import MemoForm from '../../components/PrivateMemos/MemoForm';
import MemoList from '../../components/PrivateMemos/MemoList';

const PrivateMemos = ({ isDarkMode }) => {
    const [memo, setMemo] = useState('');
    const [filter, setFilter] = useState('all');
    const [sortOrder, setSortOrder] = useState('newest');
    const [searchTerm, setSearchTerm] = useState('');
    const [showNewNoteForm, setShowNewNoteForm] = useState(false);
    const [editingMemoId, setEditingMemoId] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deletingMemo, setDeletingMemo] = useState(null);
    
    const searchInputRef = useRef(null);
    
    const { 
      isLoading, 
      error, 
      saving, 
      isDeleting,
      createMemo, 
      updateMemo, 
      deleteMemo, 
      toggleDone,
      getFilteredAndSortedMemos 
    } = useMemos();

    const filteredMemos = getFilteredAndSortedMemos(filter, sortOrder, searchTerm);

    useEffect(() => {
        const handleKeyDown = (e) => {
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

    const handleSaveMemo = async () => {
        const success = await createMemo(memo);
        if (success) {
            setMemo('');
            setShowNewNoteForm(false);
        }
    };

    const handleDeleteMemo = (memo) => {
        setDeletingMemo(memo);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!deletingMemo?.Id) return;
        
        const success = await deleteMemo(deletingMemo.Id);
        if (success) {
            setDeleteModalOpen(false);
            setDeletingMemo(null);
        }
    };

    const handleUpdateMemo = async (id, updatedText) => {
        const success = await updateMemo(id, updatedText);
        if (success) {
            setEditingMemoId(null);
        }
    };

    const handleToggleDone = async (id, isDone) => {
        await toggleDone(id, isDone);
    };

    const toggleNewNoteForm = () => {
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
                showNewNoteForm={showNewNoteForm}
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
