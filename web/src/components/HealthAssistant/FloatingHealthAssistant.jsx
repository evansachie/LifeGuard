import React, { useState, useRef, useEffect } from 'react';
import { fetchWithAuth, API_ENDPOINTS } from '../../utils/api';
import { toast } from 'react-toastify';
import { FaRobot, FaTimes, FaPaperPlane, FaMicrophone, FaRegTrashAlt, FaDownload, FaKeyboard } from 'react-icons/fa';
import { IoVolumeHigh, IoVolumeMute } from 'react-icons/io5';
import './FloatingHealthAssistant.css';

const FloatingHealthAssistant = ({ isDarkMode }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [textToSpeechEnabled, setTextToSpeechEnabled] = useState(false);
  
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const speechRecognitionRef = useRef(null);

  // Load chat history from localStorage on component mount
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

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      speechRecognitionRef.current = new SpeechRecognition();
      speechRecognitionRef.current.continuous = false;
      speechRecognitionRef.current.interimResults = false;
      speechRecognitionRef.current.lang = 'en-US';
      
      speechRecognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
      };
      
      speechRecognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        toast.error('Voice input failed. Please try again or type your question.');
        setIsListening(false);
      };
      
      speechRecognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
    
    return () => {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (textToSpeechEnabled && chatHistory.length > 0) {
      const lastMessage = chatHistory[chatHistory.length - 1];
      if (lastMessage.type === 'assistant' && !lastMessage.isError) {
        speakText(lastMessage.content);
      }
    }
  }, [chatHistory, textToSpeechEnabled]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      if (e.ctrlKey && e.key === 'Enter') {
        if (query.trim()) {
          handleSubmit(e);
        }
      }
      
      if (e.key === 'Escape') {
        toggleChat();
      }

      if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        handleClearHistory();
      }
      
      if (e.ctrlKey && e.key === 'm') {
        e.preventDefault();
        toggleListening();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, query, isListening]);

  useEffect(() => {
    const adjustPosition = () => {
      const floatingButton = document.querySelector('.floating-button');
      const chatWindow = document.querySelector('.chat-window');
      
      if (floatingButton && chatWindow) {
        const rect = floatingButton.getBoundingClientRect();
        const isPartiallyVisible = (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
        
        if (!isPartiallyVisible) {
          floatingButton.style.bottom = '80px';
          floatingButton.style.right = '30px';
          chatWindow.style.bottom = '80px';
          chatWindow.style.right = '30px';
        }
      }
    };

    adjustPosition();

    window.addEventListener('resize', adjustPosition);
    
    return () => window.removeEventListener('resize', adjustPosition);
  }, [isOpen]);

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const toggleListening = () => {
    if (!speechRecognitionRef.current) {
      toast.error('Voice input is not supported in your browser.');
      return;
    }
    
    if (isListening) {
      speechRecognitionRef.current.stop();
      setIsListening(false);
    } else {
      speechRecognitionRef.current.start();
      setIsListening(true);
      setQuery('');
      toast.info('Listening... Speak now.');
    }
  };
  
  const toggleTextToSpeech = () => {
    setTextToSpeechEnabled(!textToSpeechEnabled);
    toast.info(textToSpeechEnabled ? 'Text-to-speech disabled' : 'Text-to-speech enabled');
    
    if (textToSpeechEnabled) {
      window.speechSynthesis.cancel();
    }
  };

  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') || 
      voice.name.includes('Natural') || 
      voice.name.includes('Female')
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.pitch = 1;
    utterance.rate = 1;
    utterance.volume = 1;
    
    window.speechSynthesis.speak(utterance);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast.error('Please enter a question');
      return;
    }
    
    setLoading(true);
    
    try {
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
      
      if (error.message && error.message.includes('token')) {
        errorMessage = 'Authentication error. Please log out and log in again.';
      } else if (error.message && error.message.includes('401')) {
        errorMessage = 'Authentication error. Please log out and log in again.';
      }
      
      toast.error(errorMessage);
      
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

  const handleClearHistory = () => {
    if (chatHistory.length === 0) return;
    
    if (window.confirm('Are you sure you want to clear the conversation history?')) {
      setChatHistory([]);
      localStorage.removeItem('healthAssistantChatHistory');
      toast.info('Conversation history cleared');
    }
  };

  const handleExportHistory = () => {
    if (chatHistory.length === 0) {
      toast.info('No conversation to export');
      return;
    }
    
    const userName = localStorage.getItem('userName') || 'User';
    
    let formattedChat = `LifeGuard Health Assistant Chat History - ${new Date().toLocaleDateString()}\n\n`;
    
    chatHistory.forEach(message => {
      const sender = message.type === 'user' ? userName : 'LifeGuard';
      const time = new Date(message.timestamp).toLocaleTimeString();
      const date = new Date(message.timestamp).toLocaleDateString();
      formattedChat += `[${date} ${time}] ${sender}:\n${message.content}\n\n`;
    });
    
    // Create a blob and download link
    const blob = new Blob([formattedChat], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lifeguard-chat-history-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    toast.success('Chat history exported successfully');
  };

  const formatMessageContent = (content) => {
    if (!content) return '';

    return content.split('\n').map((paragraph, i) => {
      if (!paragraph.trim()) return <br key={i} />;
      return <p key={i}>{paragraph}</p>;
    });
  };

  const handleExampleClick = (exampleText) => {
    setQuery(exampleText);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
          <div className="header-actions">
            <button
              className={`icon-button ${textToSpeechEnabled ? 'active' : ''}`} 
              onClick={toggleTextToSpeech}
              aria-label={textToSpeechEnabled ? "Disable text-to-speech" : "Enable text-to-speech"}
              title={textToSpeechEnabled ? "Disable text-to-speech" : "Enable text-to-speech"}
            >
              {textToSpeechEnabled ? <IoVolumeHigh /> : <IoVolumeMute />}
            </button>
            <button 
              className="icon-button" 
              onClick={() => setShowShortcuts(!showShortcuts)}
              aria-label="Keyboard shortcuts"
              title="Keyboard shortcuts"
            >
              <FaKeyboard />
            </button>
            <button 
              className="icon-button" 
              onClick={toggleChat}
              aria-label="Close Health Assistant"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {showShortcuts && (
          <div className="shortcuts-panel">
            <h4>Keyboard Shortcuts</h4>
            <ul>
              <li><kbd>Ctrl</kbd> + <kbd>Enter</kbd> Send message</li>
              <li><kbd>Esc</kbd> Close chat</li>
              <li><kbd>Ctrl</kbd> + <kbd>L</kbd> Clear history</li>
              <li><kbd>Ctrl</kbd> + <kbd>M</kbd> Toggle voice input</li>
            </ul>
          </div>
        )}

        <div className="chat-body" ref={chatContainerRef}>
          {chatHistory.length === 0 ? (
            <div className="empty-chat">
              <p>Ask me anything about your health data or general health questions.</p>
              <p className="examples-title">Examples:</p>
              <ul className="examples-list">
                <li onClick={() => handleExampleClick("How has my sleep been lately?")}>
                  "How has my sleep been lately?"
                </li>
                <li onClick={() => handleExampleClick("What's my heart rate trend this week?")}>
                  "What's my heart rate trend this week?"
                </li>
                <li onClick={() => handleExampleClick("How can I improve my overall health?")}>
                  "How can I improve my overall health?"
                </li>
                <li onClick={() => handleExampleClick("What exercises are good for back pain?")}>
                  "What exercises are good for back pain?"
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
                  <div className="message-header">
                    <span className={`${isDarkMode ? 'text-white' : 'text-black'} gap-2`}>{message.type === 'user' ? 'You' : 'LifeGuard'}</span>
                    <span className={`${isDarkMode ? 'text-white' : 'text-black'} gap-2`}>{formatTime(message.timestamp)}</span>
                  </div>
                  {message.type === 'assistant' ? (
                    <div className="message-content">
                      {formatMessageContent(message.content)}
                    </div>
                  ) : (
                    <div className="message-content">
                      {message.content}
                    </div>
                  )}
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
        
        <div className="chat-actions">
          {chatHistory.length > 0 && (
            <>
              <button 
                className="action-button" 
                onClick={handleClearHistory}
                title="Clear conversation"
              >
                <FaRegTrashAlt />
              </button>
              <button 
                className="action-button" 
                onClick={handleExportHistory}
                title="Export conversation"
              >
                <FaDownload />
              </button>
            </>
          )}
        </div>

        <form onSubmit={handleSubmit} className="chat-input">
          <input
            ref={inputRef}
            type="text"
            value={isListening ? 'Listening...' : query}
            onChange={handleQueryChange}
            placeholder="Ask about your health..."
            disabled={loading || isListening}
          />
          <button
            type="button"
            onClick={toggleListening}
            disabled={loading}
            className={`voice-button ${isListening ? 'listening' : ''}`}
            aria-label={isListening ? 'Stop listening' : 'Start voice input'}
            title={isListening ? 'Stop listening' : 'Start voice input'}
          >
            <FaMicrophone />
          </button>
          <button
            type="submit"
            disabled={loading || !query.trim() || isListening}
            aria-label="Send message"
            title="Send message"
          >
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
  );
};

export default FloatingHealthAssistant;
