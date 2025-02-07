import * as React from "react";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStickyNote, FaSearch, FaFilter, FaBold, FaItalic, FaListUl, FaLink, FaTags } from 'react-icons/fa';
import './PrivateMemos.css';
import { toast } from 'react-hot-toast';

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

    const API_BASE_URL = 'https://lifeguard-node.onrender.com';

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/log-in');
            return;
        }

        const fetchMemos = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/memos`, {
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
            }
        };
        fetchMemos();
    }, [navigate]);

    const handleMemoChange = (e) => {
        setMemo(e.target.value);
    };

    const handleSaveMemo = async () => {
        if (memo.trim() !== '') {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/log-in');
                    return;
                }

                const response = await fetch(`${API_BASE_URL}/api/memos`, {
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
            }
        }
    };

    const handleDeleteMemo = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${API_BASE_URL}/api/memos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setSavedMemos(savedMemos.filter((m) => m.id !== id));
        } catch (error) {
            console.error('Error deleting memo:', error);
        }
    };

    const handleEditMemo = (id) => {
        setEditingMemoId(id);
    };

    const handleCancelEdit = () => {
        setEditingMemoId(null);
        setMemo('');
    };

    const handleDoneChange = async (id, done) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/log-in');
                return;
            }

            const response = await fetch(`${API_BASE_URL}/api/memos/${id}/done`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ done }),
            });

            if (response.ok) {
                const updatedMemo = await response.json();
                setSavedMemos(
                    savedMemos.map((m) => (m.id === id ? updatedMemo : m))
                );
            } else {
                const errorData = await response.json();
                console.error('Error updating memo done state:', errorData.error);
                setError(`Error updating memo done state: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error updating memo done state:', error);
            setError('An error occurred while updating the memo done state. Please try again later.');
        }
    };

    const handleDoneMemo = (id) => {
        handleDoneChange(id, true);
    };

    const handleUndoneMemo = (id) => {
        handleDoneChange(id, false);
    };

    const handleUpdateMemo = async (id, event) => {
        const updatedMemo = event.target.parentElement.parentElement.querySelector('.edit-memo-input').value;

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/log-in');
                return;
            }

            const response = await fetch(`${API_BASE_URL}/api/memos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ memo: updatedMemo }),
            });

            if (response.ok) {
                const updatedMemoData = await response.json();

                setSavedMemos(
                    savedMemos.map((m) => (m.id === id ? updatedMemoData : m))
                );

                setEditingMemoId(null);
            } else {
                const errorData = await response.json();
                console.error('Error updating memo:', errorData.error);
                setError(`Error updating memo: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error updating memo:', error);
            setError('An error occurred while updating the memo. Please try again later.');
        }
    };

    // Filter memos based on current filter and search term
    const filteredMemos = savedMemos.filter(memo => {
        const matchesFilter = 
            filter === 'all' ? true :
            filter === 'active' ? !memo.done :
            filter === 'completed' ? memo.done : true;

        const matchesSearch = memo.memo.toLowerCase().includes(searchTerm.toLowerCase());
        
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
                <button className="save-memo-button" onClick={handleSaveMemo}>
                    Save Note
                </button>
            </div>

            <div className="saved-memos-container">
                {filteredMemos.map(({ id, memo, done, created_at }) => (
                    <div key={id} className={`saved-memo ${done ? 'done' : ''}`}>
                        {editingMemoId === id ? (
                            <div className="edit-memo-container">
                                <textarea
                                    className="edit-memo-input"
                                    defaultValue={memo}
                                />
                                <div className="edit-actions">
                                    <button 
                                        className="memo-button edit-button"
                                        onClick={(e) => handleUpdateMemo(id, e)}
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
                                <div className="memo-content">{memo}</div>
                                <div className="memo-actions">
                                    <button 
                                        className="memo-button edit-button" 
                                        onClick={() => handleEditMemo(id)}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        className="memo-button delete-button" 
                                        onClick={() => handleDeleteMemo(id)}
                                    >
                                        Delete
                                    </button>
                                    <button 
                                        className="memo-button done-button"
                                        onClick={() => done ? handleUndoneMemo(id) : handleDoneMemo(id)}
                                    >
                                        {done ? 'Undone' : 'Done'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PrivateMemos;
