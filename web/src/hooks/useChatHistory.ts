import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { fetchWithAuth, API_ENDPOINTS } from '../utils/api';

interface ChatMessage {
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isError?: boolean;
}

interface ChatHistoryReturn {
  chatHistory: ChatMessage[];
  loading: boolean;
  sendQuery: (query: string) => Promise<string | null>;
  clearHistory: () => void;
  addUserMessage: (content: string) => ChatMessage;
  addAssistantMessage: (content: string, isError?: boolean) => ChatMessage;
}

interface QueryResponse {
  response: string;
  [key: string]: any;
}

export function useChatHistory(): ChatHistoryReturn {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const savedChatHistory = localStorage.getItem('healthAssistantChatHistory');
    if (savedChatHistory) {
      try {
        setChatHistory(JSON.parse(savedChatHistory));
      } catch (error) {
        console.error('Error parsing saved chat history:', error);
        localStorage.removeItem('healthAssistantChatHistory');
      }
    }
  }, []);

  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem('healthAssistantChatHistory', JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  const addUserMessage = (content: string): ChatMessage => {
    const message: ChatMessage = {
      type: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    setChatHistory((prev) => [...prev, message]);
    return message;
  };

  const addAssistantMessage = (content: string, isError = false): ChatMessage => {
    const message: ChatMessage = {
      type: 'assistant',
      content,
      timestamp: new Date().toISOString(),
      isError,
    };
    setChatHistory((prev) => [...prev, message]);
    return message;
  };

  const clearHistory = (): void => {
    setChatHistory([]);
    setLoading(false);
  };

  const sendQuery = async (query: string): Promise<string | null> => {
    if (!query.trim()) return null;
    setLoading(true);

    try {
      addUserMessage(query);

      // Get user ID from local storage
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = userData.id || localStorage.getItem('userId') || 'anonymous';

      // Ensure token is available
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      const result = await fetchWithAuth<QueryResponse>(API_ENDPOINTS.RAG_QUERY, {
        method: 'POST',
        body: JSON.stringify({ question: query, userId }),
        headers: { Authorization: `Bearer ${token}` },
      });

      addAssistantMessage(result.response);
      return result.response;
    } catch (error: any) {
      console.error('Error querying health assistant:', error);

      let errorMessage = 'Failed to get a response. Please try again.';

      if (error.message && (error.message.includes('token') || error.message.includes('401'))) {
        errorMessage = 'Authentication error. Please log out and log in again.';
      }

      toast.error(errorMessage);
      addAssistantMessage(errorMessage, true);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    chatHistory,
    loading,
    sendQuery,
    clearHistory,
    addUserMessage,
    addAssistantMessage,
  };
}
