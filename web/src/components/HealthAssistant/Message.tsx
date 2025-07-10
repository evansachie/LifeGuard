import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { FaUser, FaRobot } from 'react-icons/fa';
import { BiAnalyse } from 'react-icons/bi';

interface MessageProps {
  message: {
    id?: string;
    type: 'user' | 'assistant' | 'system';
    text: string;
    timestamp: string;
    isError?: boolean;
    source?: 'with-context' | 'no-context';
  };
  previousMessage?: {
    type: 'user' | 'assistant' | 'system';
    text: string;
  } | null;
  isDarkMode?: boolean;
}

const Message = ({ message, previousMessage, isDarkMode }: MessageProps) => {
  // Clean up the message content to avoid showing repeated questions
  const processedContent = useMemo(() => {
    if (message.type !== 'assistant') return message.text;

    let content = message.text;

    // Check if this is an assistant message that follows a user message
    if (previousMessage && previousMessage.type === 'user') {
      const userText = previousMessage.text.trim();

      // Check if the assistant message starts with the user's question
      if (content.toLowerCase().startsWith(userText.toLowerCase())) {
        // Remove the duplicated question
        content = content.substring(userText.length).trim();

        // Remove any leading punctuation or whitespace
        content = content.replace(/^[,.?!:;\s]+/, '');
      }

      // Also check for common prefixes and remove them
      const prefixes = [
        'based on your health data',
        'according to your health data',
        'from your health data',
        'your health data shows',
        'according to the information provided',
        'based on the information provided',
      ];

      const lowerContent = content.toLowerCase();
      for (const prefix of prefixes) {
        if (lowerContent.startsWith(prefix)) {
          content = content.substring(prefix.length).trim();
          content = content.replace(/^[,.?!:;\s]+/, '');
          break;
        }
      }
    }

    return content || "I'm processing your request...";
  }, [message.text, message.type, previousMessage]);

  return (
    <div className={`message ${message.type} ${message.isError ? 'error' : ''}`}>
      <div className="message-avatar">
        {message.type === 'user' ? (
          <FaUser className="text-gray-300" />
        ) : message.source === 'with-context' ? (
          <BiAnalyse className="text-green-500" />
        ) : (
          <FaRobot className="text-gray-500" />
        )}
      </div>
      <div className="message-content">
        <div className="message-text">
          {message.type === 'assistant' ? (
            <ReactMarkdown>{processedContent}</ReactMarkdown>
          ) : (
            <p>{message.text}</p>
          )}
          {message.source === 'with-context' && (
            <div className="context-indicator">
              <small
                className={`text-xs ${isDarkMode ? 'text-green-400' : 'text-green-600'} mt-1 block`}
              >
                Based on your health data
              </small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
