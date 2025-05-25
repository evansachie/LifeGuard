import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { NODE_API_URL, fetchWithAuth } from '../utils/api';
import { Memo } from '../types/common.types';

type MemoFilter = 'all' | 'active' | 'completed';
type MemoSortOrder = 'newest' | 'oldest' | 'alphabetical';

interface MemoResponse extends Memo {
  Id: number;
  Text: string;
  Done: boolean;
  CreatedAt: string;
}

interface UseMemosReturn {
  memos: MemoResponse[];
  isLoading: boolean;
  error: string;
  saving: boolean;
  isDeleting: boolean;
  createMemo: (memo: string) => Promise<boolean>;
  updateMemo: (id: number, text: string) => Promise<boolean>;
  deleteMemo: (id: number) => Promise<boolean>;
  toggleDone: (id: number, isDone: boolean) => Promise<boolean>;
  getFilteredAndSortedMemos: (
    filter?: MemoFilter,
    sortOrder?: MemoSortOrder,
    searchTerm?: string
  ) => MemoResponse[];
}

export function useMemos(): UseMemosReturn {
  const [memos, setMemos] = useState<MemoResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
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
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
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

  const createMemo = async (memo: string): Promise<boolean> => {
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ memo }),
      });

      if (response.ok) {
        const newMemo = await response.json();
        setMemos((prevMemos) => [newMemo, ...prevMemos]);
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

  const updateMemo = async (id: number, text: string): Promise<boolean> => {
    try {
      const response = await fetchWithAuth<MemoResponse>(`${NODE_API_URL}/api/memos/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ memo: text }),
      });

      setMemos((prevMemos) => prevMemos.map((memo) => (memo.Id === id ? response : memo)));
      toast.success('Note updated successfully!');
      return true;
    } catch (error) {
      console.error('Error updating memo:', error);
      toast.error('Failed to update note');
      return false;
    }
  };

  const deleteMemo = async (id: number): Promise<boolean> => {
    if (!id) {
      toast.error('Invalid memo ID');
      return false;
    }

    setIsDeleting(true);
    try {
      await fetchWithAuth(`${NODE_API_URL}/api/memos/${id}`, {
        method: 'DELETE',
      });

      setMemos((prevMemos) => prevMemos.filter((m) => m.Id !== id));
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

  const toggleDone = async (id: number, isDone: boolean): Promise<boolean> => {
    try {
      setMemos((prevMemos) =>
        prevMemos.map((memo) => (memo.Id === id ? { ...memo, Done: isDone } : memo))
      );
      toast.success(isDone ? 'Note marked as done!' : 'Note marked as undone!');
      return true;
    } catch (error) {
      console.error('Error updating memo status:', error);
      toast.error('Failed to update note status');
      return false;
    }
  };

  const getFilteredAndSortedMemos = (
    filter: MemoFilter = 'all',
    sortOrder: MemoSortOrder = 'newest',
    searchTerm: string = ''
  ): MemoResponse[] => {
    const filteredByStatus = memos.filter((memo) => {
      return filter === 'all'
        ? true
        : filter === 'active'
        ? !memo.Done
        : filter === 'completed'
        ? memo.Done
        : true;
    });

    const filteredBySearch = filteredByStatus.filter((memo) =>
      memo.Text.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return sortMemos(filteredBySearch, sortOrder);
  };

  const sortMemos = (memos: MemoResponse[], sortOrder: MemoSortOrder): MemoResponse[] => {
    switch (sortOrder) {
      case 'oldest':
        return [...memos].sort((a, b) => new Date(a.CreatedAt).getTime() - new Date(b.CreatedAt).getTime());
      case 'alphabetical':
        return [...memos].sort((a, b) => a.Text.localeCompare(b.Text));
      case 'newest':
      default:
        return [...memos].sort((a, b) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime());
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
    getFilteredAndSortedMemos,
  };
}
