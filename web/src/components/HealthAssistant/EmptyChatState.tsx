import React from 'react';

interface EmptyChatStateProps {
  onExampleClick: (question: string) => void;
}

const EmptyChatState: React.FC<EmptyChatStateProps> = ({ onExampleClick }) => {
  const exampleQuestions: string[] = [
    'What are the benefits of regular exercise?',
    'How much water should I drink daily?',
    'What foods can help boost my immune system?',
    'What are some stress management techniques?',
  ];

  return (
    <div className="empty-chat">
      <p>Ask me anything about your health data or general health questions.</p>
      <p className="examples-title">Examples:</p>
      <ul className="examples-list">
        {exampleQuestions.map((question, index) => (
          <button
            key={index}
            onClick={() => onExampleClick(question)}
            className="text-left w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
          >
            &ldquo;{question}&rdquo;
          </button>
        ))}
      </ul>
    </div>
  );
};

export default EmptyChatState;
