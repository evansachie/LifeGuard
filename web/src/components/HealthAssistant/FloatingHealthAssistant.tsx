import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import EmptyChatState from './EmptyChatState';
import HealthReportModal from '../HealthReportModal/HealthReportModal';

interface FloatingHealthAssistantProps {
  isDarkMode: boolean;
}

const FloatingHealthAssistant = ({ isDarkMode }: FloatingHealthAssistantProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const [showShortcuts, setShowShortcuts] = useState<boolean>(false);
  const [textToSpeechEnabled, setTextToSpeechEnabled] = useState<boolean>(false);
  const [showHealthReportModal, setShowHealthReportModal] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const { isListening, transcript, toggleListening } = useSpeechRecognition();
  const { messages, isLoading, hasRagContext, sendQuery, clearHistory } = useChatHistory();

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

  const speakText = useCallback((text: string) => {
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, []);

  useEffect(() => {
    if (
      textToSpeechEnabled &&
      messages.length > 0 &&
      messages[messages.length - 1].type === 'assistant' &&
      !messages[messages.length - 1].isError
    ) {
      const lastMessage = messages[messages.length - 1].text;
      speakText(lastMessage);
      }
  }, [messages, textToSpeechEnabled, speakText]);

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

  const handleOpenHealthReport = (): void => {
    setShowHealthReportModal(true);
  };

  const handleSubmit = async (query?: string): Promise<void> => {
    if (!query || !query.trim()) return;

      await sendQuery(query);
      setQuery('');

    if (inputRef.current) {
      inputRef.current.focus();
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
            variants={chatWindowVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <ChatHeader
              toggleChat={toggleChat}
              toggleTextToSpeech={toggleTextToSpeech}
              textToSpeechEnabled={textToSpeechEnabled}
              toggleShowShortcuts={() => setShowShortcuts(!showShortcuts)}
            />

            <ShortcutsPanel showShortcuts={showShortcuts} />

            <div className="chat-body">
              {messages.length === 0 && !isLoading ? (
                <EmptyChatState onExampleClick={handleExampleClick} isDarkMode={isDarkMode} />
              ) : (
                <ChatMessages
                  messages={messages}
                  isLoading={isLoading}
                  isDarkMode={isDarkMode}
                  hasRagContext={hasRagContext}
                  onExampleClick={handleExampleClick}
                />
              )}
            </div>

            <ChatActions
              messages={messages}
              onClearHistory={clearHistory}
              onOpenHealthReport={handleOpenHealthReport}
              isDarkMode={isDarkMode}
            />

            <ChatInputForm
              query={query}
              onQueryChange={setQuery}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              isListening={isListening}
              toggleListening={toggleListening}
              inputRef={inputRef}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <HealthReportModal
        isOpen={showHealthReportModal}
        onClose={() => setShowHealthReportModal(false)}
        userData={{}} // You can pass actual user data if available
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default FloatingHealthAssistant;
