import * as React from "react";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStickyNote } from 'react-icons/fa';
import { NODE_API_URL } from "../../utils/api";
import { toast } from 'react-toastify';
import Spinner from '../../components/Spinner/Spinner';
import './PrivateMemos.css';
import EmptyState from '../../assets/empty-state.svg';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal/DeleteConfirmationModal';
import { fetchWithAuth } from '../../utils/api';

const PrivateMemos = ({ isDarkMode }) => {
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

    const handleMemoChange = (e) => {
        setMemo(e.target.value);
    };

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
                console.log('New memo saved:', newMemo);
                setSavedMemos([...savedMemos, newMemo]);
                setMemo('');
            } else {
                console.error('Error saving memo:', response.status);
            }
        } catch (error) {
            console.error('Error saving memo:', error);
        } finally {
            setSaving(false);
        }
    };

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

    const handleDoneMemo = async (id) => {
        try {
            const response = await fetchWithAuth(`${NODE_API_URL}/api/memos/${id}/done`, {
                method: 'PUT',
                body: JSON.stringify({ done: true })
            });
            
            setSavedMemos(prevMemos => 
                prevMemos.map(memo => 
                    memo.Id === id ? response : memo
                )
            );
        } catch (error) {
            console.error('Error marking memo as done:', error);
            toast.error('Failed to update memo status');
        }
    };

    const handleUndoneMemo = (id) => {
        handleDoneMemo(id);
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
            toast.success('Memo updated successfully!');
        } catch (error) {
            console.error('Error updating memo:', error);
            toast.error('Failed to update memo');
        }
    };

    // Filter memos based on current filter and search term
    const filteredMemos = savedMemos.filter(memo => {
        const matchesFilter = 
            filter === 'all' ? true :
            filter === 'active' ? !memo.Done :
            filter === 'completed' ? memo.Done : true;

        const matchesSearch = memo.Text.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesFilter && matchesSearch;
    });

    return (
        <div className={`private-memos ${isDarkMode ? 'dark-mode' : ''}`}>
            <div className="header-section">
                <div className="header-left">
                    <FaStickyNote className="icon" />
                    <h1 className="page-title">Sticky Notes</h1>
                </div>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="🔍 Search notes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="memo-input-container">
                <textarea
                    className="memo-input"
                    value={memo}
                    onChange={handleMemoChange}
                    placeholder="Write your personal notes here..."
                />
                <button 
                    className="save-memo-button" 
                    onClick={handleSaveMemo}
                    disabled={saving}
                >
                    {saving ? <Spinner size="small" color="white" /> : 'Save Note'}
                </button>
            </div>

            <div className="saved-memos-container">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Spinner size="large" color={isDarkMode ? '#fff' : '#4285F4'} />
                    </div>
                ) : filteredMemos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <img src={EmptyState} alt="No memos" className="w-64 mb-4" />
                        <p className="text-lg text-gray-500">No notes found</p>
                    </div>
                ) : (
                    filteredMemos.map(({ Id, Text, Done, CreatedAt }) => (
                        <div key={Id} className={`saved-memo ${Done ? 'done' : ''}`}>
                            {editingMemoId === Id ? (
                                <div className="edit-memo-container">
                                    <textarea
                                        className="edit-memo-input"
                                        defaultValue={Text}
                                    />
                                    <div className="edit-actions">
                                        <button 
                                            className="memo-button edit-button"
                                            onClick={(e) => handleUpdateMemo(Id, e)}
                                        >
                                            Save
                                        </button>
                                        <button 
                                            className="memo-button cancel-button"
                                            onClick={handleCancelEdit}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="memo-content">{Text}</div>
                                    <div className="memo-actions">
                                        <button 
                                            className="memo-button edit-button" 
                                            onClick={() => handleEditMemo(Id)}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className="memo-button delete-button" 
                                            onClick={() => handleDeleteMemo({ Id: Id, Text: Text })}
                                        >
                                            Delete
                                        </button>
                                        <button 
                                            className="memo-button done-button"
                                            onClick={() => Done ? handleUndoneMemo(Id) : handleDoneMemo(Id)}
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
                itemName={deletingMemo?.memo}
                isLoading={isDeleting}
                isDarkMode={isDarkMode}
            />
        </div>
    );
}

export default PrivateMemos;
