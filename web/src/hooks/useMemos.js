import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { NODE_API_URL, fetchWithAuth } from '../utils/api';

export function useMemos() {
  const [memos, setMemos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

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

        const data = await response.json();
        setMemos(data);
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

  const createMemo = async (memo) => {
    if (memo.trim() === '') {
      toast.info('Please enter some text before saving');
      return false;
    }
    
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/log-in');
        return false;
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
        setMemos(prevMemos => [newMemo, ...prevMemos]);
        toast.success('Note saved successfully!');
        return true;
      } else {
        console.error('Error saving memo:', response.status);
        toast.error('Failed to save note');
        return false;
      }
    } catch (error) {
      console.error('Error saving memo:', error);
      toast.error('Failed to save note');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const updateMemo = async (id, text) => {
    try {
      const response = await fetchWithAuth(`${NODE_API_URL}/api/memos/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ memo: text })
      });

      setMemos(prevMemos => 
        prevMemos.map(memo => 
          memo.Id === id ? response : memo
        )
      );
      toast.success('Note updated successfully!');
      return true;
    } catch (error) {
      console.error('Error updating memo:', error);
      toast.error('Failed to update note');
      return false;
    }
  };

  const deleteMemo = async (id) => {
    if (!id) {
      toast.error('Invalid memo ID');
      return false;
    }
    
    setIsDeleting(true);
    try {
      await fetchWithAuth(`${NODE_API_URL}/api/memos/${id}`, {
        method: 'DELETE'
      });
      
      setMemos(prevMemos => prevMemos.filter(m => m.Id !== id));
      toast.success('Note deleted successfully!');
      return true;
    } catch (error) {
      console.error('Error deleting memo:', error);
      toast.error('Failed to delete note');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleDone = async (id, isDone) => {
    try {
      const response = await fetchWithAuth(`${NODE_API_URL}/api/memos/${id}/done`, {
        method: 'PUT',
        body: JSON.stringify({ done: isDone })
      });
      
      setMemos(prevMemos => 
        prevMemos.map(memo => 
          memo.Id === id ? { ...memo, Done: isDone } : memo
        )
      );
      toast.success(isDone ? 'Note marked as done!' : 'Note marked as undone!');
      return true;
    } catch (error) {
      console.error('Error updating memo status:', error);
      toast.error('Failed to update note status');
      return false;
    }
  };

  const getFilteredAndSortedMemos = (filter = 'all', sortOrder = 'newest', searchTerm = '') => {
    const filteredByStatus = memos.filter(memo => {
      return filter === 'all' ? true :
             filter === 'active' ? !memo.Done :
             filter === 'completed' ? memo.Done : true;
    });
    
    const filteredBySearch = filteredByStatus.filter(memo => 
      memo.Text.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return sortMemos(filteredBySearch, sortOrder);
  };
  
  const sortMemos = (memos, sortOrder) => {
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

  return {
    memos,
    isLoading,
    error,
    saving,
    isDeleting,
    createMemo,
    updateMemo,
    deleteMemo,
    toggleDone,
    getFilteredAndSortedMemos
  };
}
