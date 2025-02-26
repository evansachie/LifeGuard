import React, { useState } from 'react';
import { fetchWithAuth } from '../../utils/api';
import { API_ENDPOINTS } from '../../utils/api';
import { toast } from 'react-toastify';

const HealthAssistant = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
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
      const userId = userData.id || 'anonymous';
      
      // Send query to RAG API
      const result = await fetchWithAuth(API_ENDPOINTS.RAG_QUERY, {
        method: 'POST',
        body: JSON.stringify({
          question: query,
          userId
        })
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
      toast.error('Failed to get a response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Health Assistant</h2>
      
      <div className="mb-6 bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto">
        {chatHistory.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <p>Ask me anything about your health data or general health questions.</p>
            <p className="text-sm mt-2">Examples:</p>
            <ul className="text-sm mt-1">
              <li>"What was my average heart rate last week?"</li>
              <li>"How has my sleep quality been trending?"</li>
              <li>"What should I do to improve my cardiovascular health?"</li>
            </ul>
          </div>
        ) : (
          <div className="space-y-4">
            {chatHistory.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-3/4 p-3 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-blue-500 text-white rounded-br-none' 
                      : 'bg-gray-200 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        )}
        {loading && (
          <div className="flex justify-center items-center mt-4">
            <div className="animate-pulse flex space-x-2">
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
            </div>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="flex items-center">
        <input
          type="text"
          value={query}
          onChange={handleQueryChange}
          placeholder="Ask about your health data..."
          className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Ask'}
        </button>
      </form>
    </div>
  );
};

export default HealthAssistant;
