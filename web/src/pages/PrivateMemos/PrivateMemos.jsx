import * as React from "react";
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStickyNote, FaSearch, FaPlus, FaTags, FaFilter } from 'react-icons/fa';
import { MdSort } from 'react-icons/md';
import { NODE_API_URL } from "../../utils/api";
import { toast } from 'react-toastify';
import Spinner from '../../components/Spinner/Spinner';
import './PrivateMemos.css';
import EmptyState from '../../assets/empty-state.svg';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal/DeleteConfirmationModal';
import { fetchWithAuth } from '../../utils/api';

const PrivateMemos = ({ isDarkMode }) => {
    // Existing state
    const [memo, setMemo] = useState('');
    const [savedMemos, setSavedMemos] = useState([]);
    const [editingMemoId, setEditingMemoId] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [doneMemos, setDoneMemos] = useState([]);
    const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'
    const [searchTerm, setSearchTerm] = useState('');
    const [tags, setTags] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deletingMemo, setDeletingMemo] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    
    // New state for enhanced UI
    const [showNewNoteForm, setShowNewNoteForm] = useState(false);
    const [sortOrder, setSortOrder] = useState('newest'); // 'newest', 'oldest', 'alphabetical'
    const searchInputRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/log-in');
            return;
        }

        const fetchMemos = async () => {
            try {
                const response = await fetch(`${NODE_API_URL}/api/memos`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem('token');
                        navigate('/log-in');
                        toast.error('Session expired. Please login again.');
                        return;
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const memos = await response.json();
                setSavedMemos(memos);
            } catch (error) {
                console.error('Error fetching memos:', error);
                toast.error('Failed to load memos. Please try again.');
                setError('An error occurred while fetching memos. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchMemos();
    }, [navigate]);

    // Add keyboard shortcuts
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

    // Rest of the existing handlers
    const handleMemoChange = (e) => {
        setMemo(e.target.value);
    };

    // Update saveMemo handler for new UI
    const handleSaveMemo = async () => {
        if (memo.trim() === '') {
            toast.info('Please enter some text before saving');
            return;
        }
        
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/log-in');
                return;
            }

            const response = await fetch(`${NODE_API_URL}/api/memos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ memo }),
            });

            if (response.ok) {
                const newMemo = await response.json();
                setSavedMemos([newMemo, ...savedMemos]);
                setMemo('');
                setShowNewNoteForm(false); // Hide form after saving
                toast.success('Note saved successfully!');
            } else {
                console.error('Error saving memo:', response.status);
                toast.error('Failed to save note');
            }
        } catch (error) {
            console.error('Error saving memo:', error);
            toast.error('Failed to save note');
        } finally {
            setSaving(false);
        }
    };

    // Existing handlers
    const handleDeleteMemo = async (memo) => {
        if (!memo.Id) {
            toast.error('Invalid memo ID');
            return;
        }
        setDeletingMemo(memo);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!deletingMemo?.Id) return;
        
        setIsDeleting(true);
        try {
            await fetchWithAuth(`${NODE_API_URL}/api/memos/${deletingMemo.Id}`, {
                method: 'DELETE'
            });
            setSavedMemos(prevMemos => 
                prevMemos.filter(m => m.Id !== deletingMemo.Id)
            );
            toast.success('Note deleted successfully!');
            setDeleteModalOpen(false);
        } catch (error) {
            console.error('Error deleting memo:', error);
            toast.error('Failed to delete note');
        } finally {
            setIsDeleting(false);
            setDeletingMemo(null);
        }
    };

    const handleEditMemo = (id) => {
        setEditingMemoId(id);
    };

    const handleCancelEdit = () => {
        setEditingMemoId(null);
        setMemo('');
    };

    const handleDoneMemo = async (id, isDone) => {
        try {
            const response = await fetchWithAuth(`${NODE_API_URL}/api/memos/${id}/done`, {
                method: 'PUT',
                body: JSON.stringify({ done: isDone })
            });
            
            setSavedMemos(prevMemos => 
                prevMemos.map(memo => 
                    memo.Id === id ? { ...memo, Done: isDone } : memo
                )
            );
            toast.success(isDone ? 'Note marked as done!' : 'Note marked as undone!');
        } catch (error) {
            console.error('Error updating memo status:', error);
            toast.error('Failed to update note status');
        }
    };

    const handleUndoneMemo = (id) => {
        handleDoneMemo(id, false);
    };

    const handleUpdateMemo = async (id, event) => {
        const updatedMemo = event.target.parentElement.parentElement.querySelector('.edit-memo-input').value;

        try {
            const response = await fetchWithAuth(`${NODE_API_URL}/api/memos/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ memo: updatedMemo })
            });

            setSavedMemos(prevMemos => 
                prevMemos.map(memo => 
                    memo.Id === id ? response : memo
                )
            );
            setEditingMemoId(null);
            toast.success('Note updated successfully!');
        } catch (error) {
            console.error('Error updating memo:', error);
            toast.error('Failed to update note');
        }
    };

    // Filter and sort memos
    const getSortedMemos = (memos) => {
        switch (sortOrder) {
            case 'oldest':
                return [...memos].sort((a, b) => new Date(a.CreatedAt) - new Date(b.CreatedAt));
            case 'alphabetical':
                return [...memos].sort((a, b) => a.Text.localeCompare(b.Text));
            case 'newest':
            default:
                return [...memos].sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));
        }
    };
    
    // Filter memos based on current filter and search term
    const filteredMemos = getSortedMemos(
        savedMemos.filter(memo => {
            const matchesFilter = 
                filter === 'all' ? true :
                filter === 'active' ? !memo.Done :
                filter === 'completed' ? memo.Done : true;

            const matchesSearch = memo.Text.toLowerCase().includes(searchTerm.toLowerCase());
            
            return matchesFilter && matchesSearch;
        })
    );

    // Format the date for display
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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
                            placeholder="Search notes... (Press / to focus)"
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

            <div className="filters-bar">
                <div className="filter-tabs">
                    <button 
                        className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </button>
                    <button 
                        className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
                        onClick={() => setFilter('active')}
                    >
                        Active
                    </button>
                    <button 
                        className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
                        onClick={() => setFilter('completed')}
                    >
                        Completed
                    </button>
                </div>
                
                <div className="sort-controls">
                    <div className="sort-dropdown">
                        <button className="sort-button">
                            <MdSort /> Sort: {sortOrder.charAt(0).toUpperCase() + sortOrder.slice(1)}
                        </button>
                        <div className="sort-dropdown-content">
                            <button 
                                className={sortOrder === 'newest' ? 'active' : ''}
                                onClick={() => setSortOrder('newest')}
                            >
                                Newest First
                            </button>
                            <button 
                                className={sortOrder === 'oldest' ? 'active' : ''}
                                onClick={() => setSortOrder('oldest')}
                            >
                                Oldest First
                            </button>
                            <button 
                                className={sortOrder === 'alphabetical' ? 'active' : ''}
                                onClick={() => setSortOrder('alphabetical')}
                            >
                                Alphabetical
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showNewNoteForm && (
                <div className="memo-input-container">
                    <textarea
                        className="memo-input"
                        value={memo}
                        onChange={handleMemoChange}
                        placeholder="Write your note here..."
                        autoFocus
                    />
                    <div className="memo-input-actions">
                        <button 
                            className="action-button cancel-button" 
                            onClick={() => {
                                setShowNewNoteForm(false);
                                setMemo('');
                            }}
                        >
                            Cancel
                        </button>
                        <button 
                            className="action-button save-memo-button" 
                            onClick={handleSaveMemo}
                            disabled={saving || !memo.trim()}
                        >
                            {saving ? <Spinner size="small" color="white" /> : 'Save Note'}
                        </button>
                    </div>
                </div>
            )}

            <div className="saved-memos-container">
                {isLoading ? (
                    <div className="memos-loading-state">
                        <Spinner size="large" color={isDarkMode ? '#fff' : '#4285F4'} />
                    </div>
                ) : filteredMemos.length === 0 ? (
                    <div className="memos-empty-state">
                        <img src={EmptyState} alt="No notes" className="empty-state-image" />
                        <p>No notes found</p>
                        <button 
                            className="action-button new-note-button"
                            onClick={() => setShowNewNoteForm(true)}
                        >
                            <FaPlus /> Create New Note
                        </button>
                    </div>
                ) : (
                    filteredMemos.map(({ Id, Text, Done, CreatedAt }) => (
                        <div key={Id} className={`saved-memo ${Done ? 'done' : ''}`}>
                            {editingMemoId === Id ? (
                                <div className="edit-memo-container">
                                    <textarea
                                        className="edit-memo-input"
                                        defaultValue={Text}
                                        autoFocus
                                    />
                                    <div className="memo-input-actions">
                                        <button 
                                            className="action-button cancel-button"
                                            onClick={handleCancelEdit}
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            className="action-button save-memo-button"
                                            onClick={(e) => handleUpdateMemo(Id, e)}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="memo-content">{Text}</div>
                                    <div className="memo-date">{formatDate(CreatedAt)}</div>
                                    <div className="memo-actions">
                                        <button 
                                            className="memo-button edit-button" 
                                            onClick={() => handleEditMemo(Id)}
                                            title="Edit note"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className="memo-button delete-button" 
                                            onClick={() => handleDeleteMemo({ Id: Id, Text: Text })}
                                            title="Delete note"
                                        >
                                            Delete
                                        </button>
                                        <button 
                                            className="memo-button done-button"
                                            onClick={() => Done ? handleUndoneMemo(Id) : handleDoneMemo(Id, true)}
                                            title={Done ? "Mark as active" : "Mark as completed"}
                                        >
                                            {Done ? 'Undone' : 'Done'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>

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
}

export default PrivateMemos;
