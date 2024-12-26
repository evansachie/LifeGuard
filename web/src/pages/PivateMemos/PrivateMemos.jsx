import * as React from "react";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PrivateMemos.css';

const PrivateMemos = ({ isDarkMode }) => {
    const [memo, setMemo] = useState('');
    const [savedMemos, setSavedMemos] = useState([]);
    const [editingMemoId, setEditingMemoId] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [doneMemos, setDoneMemos] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/log-in');
            return;
        }

        const fetchMemos = async () => {
            try {
                const response = await fetch('https://lighthouse-portal.onrender.com/api/memos', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const memos = await response.json();
                    setSavedMemos(memos);
                } else {
                    setError('Error fetching memos. Please try again later.');
                }
            } catch (error) {
                console.error('Error fetching memos:', error);
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

                // Fetch the user's email from the server
                const userResponse = await fetch('https://lighthouse-portal.onrender.com/api/users', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (userResponse.ok) {
                    const { email } = await userResponse.json();
                    const response = await fetch('https://lighthouse-portal.onrender.com/api/memos', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({ email, memo }),
                    });

                    if (response.ok) {
                        const newMemo = await response.json();
                        console.log('New memo saved:', newMemo);
                        setSavedMemos([...savedMemos, newMemo]);
                        // Reset the memo input field after a successful save
                        setMemo('');
                    } else {
                        console.error('Error saving memo:', response.status);
                    }
                } else {
                    console.error('Error fetching user email:', userResponse.status);
                }
            } catch (error) {
                console.error('Error saving memo:', error);
            }
        }
    };

    const handleDeleteMemo = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`https://lighthouse-portal.onrender.com/api/memos/${id}`, {
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
        setMemo(''); // Clear the memo input when canceling edit
    };

    const handleDoneChange = async (id, done) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/log-in');
                return;
            }

            const response = await fetch(`https://lighthouse-portal.onrender.com/api/memos/${id}/done`, {
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
                navigate('/log-in'); // Redirect to the login page if the user is not logged in
                return;
            }

            const response = await fetch(`https://lighthouse-portal.onrender.com/api/memos/${id}`, {
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

    return (
        <div className={`private-memos ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <h2>Sticky Notes</h2>
            <div className="memo-input-container">
                <textarea
                    className={`memo-input ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
                    value={memo}
                    onChange={handleMemoChange}
                    placeholder="Write your private memo..."
                />
                <button
                    className={`save-memo-button ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
                    onClick={handleSaveMemo}
                >
                    Save Memo
                </button>
            </div>
            <div className="saved-memos-container">
                <h3>Saved Memos</h3>
                <div className="saved-memos-list">
                    {savedMemos.map(({id, memo, done}) => (
                        <div key={id} className={`saved-memo ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
                            {editingMemoId === id ? (
                                <div className="edit-memo-container">
                                    <textarea
                                        className={`edit-memo-input ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
                                        defaultValue={memo}
                                    />
                                    <div className="edit-memo-actions">
                                        <button className="save-edit-button" onClick={(e) => handleUpdateMemo(id, e)}>
                                            Save
                                        </button>
                                        <button className="cancel-edit-button" onClick={handleCancelEdit}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p style={{textDecoration: done ? 'line-through' : 'none'}}>{memo}</p>
                                    <div className="memo-actions">
                                    <button className="edit-memo-button" onClick={() => handleEditMemo(id)}>
                                            Edit
                                        </button>
                                        <button className="delete-memo-button" onClick={() => handleDeleteMemo(id)}>
                                            Delete
                                        </button>
                                        {done ? (
                                            <button className="undone-memo-button" onClick={() => handleUndoneMemo(id)}>
                                                Undone
                                            </button>
                                        ) : (
                                            <button className="done-memo-button" onClick={() => handleDoneMemo(id)}>
                                                Done
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default PrivateMemos;
