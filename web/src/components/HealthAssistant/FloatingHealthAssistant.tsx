import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './FloatingHealthAssistant.css';

import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useChatHistory } from '../../hooks/useChatHistory';

import ChatButton from './ChatButton';
import ChatHeader from './ChatHeader';
import ShortcutsPanel from './ShortcutsPanel';
import ChatMessages from './ChatMessages';
import ChatActions from './ChatActions';
import ChatInputForm from './ChatInputForm';

interface FloatingHealthAssistantProps {
  isDarkMode: boolean;
}

interface ChatMessage {
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date | string;
  isError?: boolean;
}

const FloatingHealthAssistant: React.FC<FloatingHealthAssistantProps> = ({ isDarkMode }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const [showShortcuts, setShowShortcuts] = useState<boolean>(false);
  const [textToSpeechEnabled, setTextToSpeechEnabled] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const { isListening, transcript, toggleListening } = useSpeechRecognition();
  const { chatHistory, loading, sendQuery, clearHistory } = useChatHistory();

  useEffect(() => {
    if (transcript) {
      setQuery(transcript);
    }
  }, [transcript]);

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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.ctrlKey && e.key === 'Enter') {
        if (query.trim()) {
          handleSubmit();
        }
      }

      if (e.key === 'Escape') {
        toggleChat();
      }

      if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        clearHistory();
      }

      if (e.ctrlKey && e.key === 'm') {
        e.preventDefault();
        toggleListening();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, query, isListening, clearHistory, toggleListening]);

  useEffect(() => {
    const adjustPosition = () => {
      const floatingButton = document.querySelector('.floating-button') as HTMLElement;
      const chatWindow = document.querySelector('.chat-window') as HTMLElement;

      if (floatingButton && chatWindow) {
        const rect = floatingButton.getBoundingClientRect();
        const isPartiallyVisible =
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <= (window.innerWidth || document.documentElement.clientWidth);

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

  const toggleChat = (): void => setIsOpen(!isOpen);

  const toggleTextToSpeech = (): void => {
    setTextToSpeechEnabled(!textToSpeechEnabled);
    if (textToSpeechEnabled) {
      window.speechSynthesis.cancel();
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (query.trim()) {
      await sendQuery(query);
      setQuery('');
    }
  };

  const handleExampleClick = (exampleText: string): void => {
    setQuery(exampleText);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const speakText = (text: string): void => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (voice) =>
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

  const chatWindowVariants = {
    closed: {
      opacity: 0,
      y: 20,
      scale: 0.95,
      transition: { duration: 0.2, ease: 'easeOut' },
    },
    open: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.25, ease: 'easeOut' },
    },
  };

  return (
    <div className={`floating-health-assistant ${isDarkMode ? 'dark-mode' : ''}`}>
      <ChatButton isOpen={isOpen} toggleChat={toggleChat} />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chat-window"
            initial="closed"
            animate="open"
            exit="closed"
            variants={chatWindowVariants}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          >
            <ChatHeader
              toggleChat={toggleChat}
              toggleTextToSpeech={toggleTextToSpeech}
              textToSpeechEnabled={textToSpeechEnabled}
              toggleShowShortcuts={() => setShowShortcuts(!showShortcuts)}
            />

            <ShortcutsPanel showShortcuts={showShortcuts} />

            <ChatMessages
              chatHistory={chatHistory}
              loading={loading}
              isDarkMode={isDarkMode}
              onExampleClick={handleExampleClick}
            />

            <ChatActions
              chatHistory={chatHistory}
              onClearHistory={clearHistory}
              isDarkMode={isDarkMode}
            />

            <ChatInputForm
              query={query}
              onQueryChange={setQuery}
              onSubmit={handleSubmit}
              isLoading={loading}
              isListening={isListening}
              toggleListening={toggleListening}
              inputRef={inputRef}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingHealthAssistant;
