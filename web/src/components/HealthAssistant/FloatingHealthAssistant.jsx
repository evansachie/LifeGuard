import React, { useState, useRef, useEffect } from 'react';
import { fetchWithAuth, API_ENDPOINTS } from '../../utils/api';
import { toast } from 'react-toastify';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';

const FloatingHealthAssistant = ({ isDarkMode }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom of chat when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast.error('Please enter a question');
      return;
    }
    
    setLoading(true);
    
    try {
      // Add user query to chat history
      const newUserMessage = {
        type: 'user',
        content: query,
        timestamp: new Date().toISOString()
      };
      
      setChatHistory(prev => [...prev, newUserMessage]);
      
      // Get user ID from local storage
      const userData = JSON.parse(localStorage.getItem('user')) || {};
      const userId = userData.id || localStorage.getItem('userId') || 'anonymous';
      
      // Ensure token is available
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      console.log('Using token:', token);
      
      // Send query to RAG API with explicit token
      const result = await fetchWithAuth(API_ENDPOINTS.RAG_QUERY, {
        method: 'POST',
        body: JSON.stringify({
          question: query,
          userId
        }),
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Add assistant response to chat history
      const newAssistantMessage = {
        type: 'assistant',
        content: result.response,
        timestamp: new Date().toISOString()
      };
      
      setChatHistory(prev => [...prev, newAssistantMessage]);
      setResponse(result.response);
      setQuery('');
    } catch (error) {
      console.error('Error querying health assistant:', error);
      
      let errorMessage = 'Failed to get a response. Please try again.';
      
      // Handle specific error cases
      if (error.message && error.message.includes('token')) {
        errorMessage = 'Authentication error. Please log out and log in again.';
      } else if (error.message && error.message.includes('401')) {
        errorMessage = 'Authentication error. Please log out and log in again.';
      }
      
      toast.error(errorMessage);
      
      // Add error message to chat history
      const errorChatMessage = {
        type: 'assistant',
        content: errorMessage,
        timestamp: new Date().toISOString(),
        isError: true
      };
      
      setChatHistory(prev => [...prev, errorChatMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle example click
  const handleExampleClick = (exampleText) => {
    setQuery(exampleText);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className={`floating-health-assistant ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* Floating button */}
      <button 
        className={`floating-button ${isOpen ? 'hidden' : ''}`} 
        onClick={toggleChat}
        aria-label="Open Health Assistant"
      >
        <FaRobot />
      </button>

      {/* Chat window */}
      <div className={`chat-window ${isOpen ? 'open' : ''}`}>
        <div className="chat-header">
          <h3>Health Assistant</h3>
          <button 
            className="close-button" 
            onClick={toggleChat}
            aria-label="Close Health Assistant"
          >
            <FaTimes />
          </button>
        </div>

        <div className="chat-body" ref={chatContainerRef}>
          {chatHistory.length === 0 ? (
            <div className="empty-chat">
              <p>Ask me anything about your health data or general health questions.</p>
              <p className="examples-title">Examples:</p>
              <ul className="examples-list">
                <li onClick={() => handleExampleClick("What was my average heart rate last week?")}>
                  "What was my average heart rate last week?"
                </li>
                <li onClick={() => handleExampleClick("How has my sleep quality been trending?")}>
                  "How has my sleep quality been trending?"
                </li>
                <li onClick={() => handleExampleClick("What should I do to improve my cardiovascular health?")}>
                  "What should I do to improve my cardiovascular health?"
                </li>
              </ul>
            </div>
          ) : (
            <div className="messages">
              {chatHistory.map((message, index) => (
                <div 
                  key={index} 
                  className={`message ${message.type} ${message.isError ? 'error' : ''}`}
                >
                  {message.content}
                </div>
              ))}
              {loading && (
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              )}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="chat-input">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleQueryChange}
            placeholder="Ask about your health..."
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            aria-label="Send message"
          >
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
  );
};

export default FloatingHealthAssistant;
