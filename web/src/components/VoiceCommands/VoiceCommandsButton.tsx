import React, { useState } from 'react';
import { FaMicrophone, FaMicrophoneSlash, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { useVoiceCommands } from '../../hooks/useVoiceCommands';

interface VoiceCommandsButtonProps {
  isDarkMode: boolean;
  className?: string;
}

export const VoiceCommandsButton = ({ isDarkMode, className = '' }: VoiceCommandsButtonProps) => {
  const { isListening, isSupported, lastCommand, toggleListening, getAvailableCommands } =
    useVoiceCommands();

  const [showCommands, setShowCommands] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const availableCommands = getAvailableCommands();

  if (!isSupported) {
    return null;
  }

  const handleToggle = () => {
    if (!isMuted) {
      toggleListening();
    }
  };

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
    if (isListening) {
      toggleListening();
    }
  };

  return (
    <div className={`relative flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1">
        <button
          className={`
            w-12 h-12 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all duration-300 text-white text-lg relative overflow-hidden
            ${
              isListening
                ? 'bg-gradient-to-br from-red-400 to-red-600 border-red-300 shadow-lg shadow-red-300/40 animate-pulse'
                : 'bg-gradient-to-br from-blue-400 to-blue-600 border-blue-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-300/40'
            }
            ${isMuted ? 'opacity-60 cursor-not-allowed' : ''}
            ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}
          `}
          onClick={handleToggle}
          disabled={isMuted}
          title={
            isMuted
              ? 'Voice commands muted'
              : isListening
                ? 'Stop voice commands'
                : 'Start voice commands'
          }
        >
          {isListening ? <FaMicrophone className="animate-pulse" /> : <FaMicrophoneSlash />}
        </button>

        <button
          className={`
            w-8 h-8 rounded-full border flex items-center justify-center cursor-pointer transition-all duration-200 text-xs
            ${
              isMuted
                ? 'bg-red-500 text-white border-red-500'
                : `bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200 ${
                    isDarkMode ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600' : ''
                  }`
            }
          `}
          onClick={handleMuteToggle}
          title={isMuted ? 'Unmute voice commands' : 'Mute voice commands'}
        >
          {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>
      </div>

      {lastCommand && (
        <div
          className={`
            absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-2 rounded-full text-xs whitespace-nowrap z-50 shadow-lg border
            ${
              isDarkMode
                ? 'bg-gray-800 text-white border-gray-600'
                : 'bg-white text-gray-900 border-gray-200'
            }
          `}
        >
          &quot;{lastCommand}&quot;
        </div>
      )}

      <button
        className={`
          w-6 h-6 rounded-full border flex items-center justify-center cursor-pointer transition-all duration-200 text-xs font-bold
          ${
            isDarkMode
              ? 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700'
              : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
          }
        `}
        onClick={() => setShowCommands(!showCommands)}
        title="Show available voice commands"
      >
        ?
      </button>

      {showCommands && (
        <div
          className={`
            absolute top-16 right-0 w-96 max-h-96 rounded-xl shadow-2xl z-50 overflow-hidden border
            ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}
          `}
        >
          <div
            className={`
              flex justify-between items-center p-4 border-b
              ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-200'}
            `}
          >
            <h3
              className={`
                text-lg font-semibold
                ${isDarkMode ? 'text-white' : 'text-gray-900'}
              `}
            >
              Available Voice Commands
            </h3>
            <button
              className={`
                w-6 h-6 rounded-full flex items-center justify-center text-lg cursor-pointer transition-colors
                ${
                  isDarkMode
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }
              `}
              onClick={() => setShowCommands(false)}
            >
              ×
            </button>
          </div>

          <div className="p-4 max-h-80 overflow-y-auto">
            {Object.entries(
              availableCommands.reduce(
                (acc, command) => {
                  if (!acc[command.category]) {
                    acc[command.category] = [];
                  }
                  acc[command.category].push(command);
                  return acc;
                },
                {} as Record<string, typeof availableCommands>
              )
            ).map(([category, commands]) => (
              <div key={category} className="mb-4 last:mb-0">
                <h4
                  className={`
                    text-sm font-semibold uppercase tracking-wide mb-2
                    ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}
                  `}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)} Commands
                </h4>
                <div className="space-y-2">
                  {commands.map((command) => (
                    <div
                      key={command.id}
                      className={`
                        p-3 rounded-lg border-l-4
                        ${isDarkMode ? 'bg-gray-800 border-blue-400' : 'bg-gray-50 border-blue-400'}
                      `}
                    >
                      <div
                        className={`
                          font-medium text-sm mb-1
                          ${isDarkMode ? 'text-white' : 'text-gray-900'}
                        `}
                      >
                        {command.keywords.join(', ')}
                      </div>
                      <div
                        className={`
                          text-xs
                          ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}
                        `}
                      >
                        {command.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceCommandsButton;
