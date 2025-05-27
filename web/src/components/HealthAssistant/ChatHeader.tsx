import React from 'react';
import { FaTimes, FaKeyboard } from 'react-icons/fa';
import { IoVolumeHigh, IoVolumeMute } from 'react-icons/io5';

interface ChatHeaderProps {
  toggleChat: () => void;
  toggleTextToSpeech: () => void;
  textToSpeechEnabled: boolean;
  toggleShowShortcuts: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  toggleChat,
  toggleTextToSpeech,
  textToSpeechEnabled,
  toggleShowShortcuts,
}) => {
  return (
    <div className="chat-header">
      <h3>Health Assistant</h3>
      <div className="header-actions">
        <button
          className={`icon-button ${textToSpeechEnabled ? 'active' : ''}`}
          onClick={toggleTextToSpeech}
          aria-label={textToSpeechEnabled ? 'Disable text-to-speech' : 'Enable text-to-speech'}
          title={textToSpeechEnabled ? 'Disable text-to-speech' : 'Enable text-to-speech'}
        >
          {textToSpeechEnabled ? <IoVolumeHigh /> : <IoVolumeMute />}
        </button>
        <button
          className="icon-button"
          onClick={toggleShowShortcuts}
          aria-label="Keyboard shortcuts"
          title="Keyboard shortcuts"
        >
          <FaKeyboard />
        </button>
        <button className="icon-button" onClick={toggleChat} aria-label="Close Health Assistant">
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
