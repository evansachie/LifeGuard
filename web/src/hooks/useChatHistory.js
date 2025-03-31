import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { fetchWithAuth, API_ENDPOINTS } from '../utils/api';

export function useChatHistory() {
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  
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

  const addUserMessage = (content) => {
    const message = {
      type: 'user',
      content,
      timestamp: new Date().toISOString()
    };
    setChatHistory(prev => [...prev, message]);
    return message;
  };

  const addAssistantMessage = (content, isError = false) => {
    const message = {
      type: 'assistant',
      content,
      timestamp: new Date().toISOString(),
      isError
    };
    setChatHistory(prev => [...prev, message]);
    return message;
  };

  const clearHistory = () => {
    if (chatHistory.length === 0) return false;
    
    if (window.confirm('Are you sure you want to clear the conversation history?')) {
      setChatHistory([]);
      localStorage.removeItem('healthAssistantChatHistory');
      toast.info('Conversation history cleared');
      return true;
    }
    return false;
  };

  const sendQuery = async (query) => {
    if (!query.trim()) return null;
    setLoading(true);
    
    try {
      addUserMessage(query);
      
      // Get user ID from local storage
      const userData = JSON.parse(localStorage.getItem('user')) || {};
      const userId = userData.id || localStorage.getItem('userId') || 'anonymous';
      
      // Ensure token is available
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      const result = await fetchWithAuth(API_ENDPOINTS.RAG_QUERY, {
        method: 'POST',
        body: JSON.stringify({ question: query, userId }),
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      addAssistantMessage(result.response);
      return result.response;
    } catch (error) {
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
    addAssistantMessage
  };
}
