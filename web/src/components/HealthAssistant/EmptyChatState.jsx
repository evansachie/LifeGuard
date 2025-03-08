import React from 'react';

const EmptyChatState = ({ onExampleClick }) => {
  const exampleQuestions = [
    "How has my sleep been lately?",
    "What's my heart rate trend this week?",
    "How can I improve my overall health?",
    "What exercises are good for back pain?"
  ];

  return (
    <div className="empty-chat">
      <p>Ask me anything about your health data or general health questions.</p>
      <p className="examples-title">Examples:</p>
      <ul className="examples-list">
        {exampleQuestions.map((question, index) => (
          <li key={index} onClick={() => onExampleClick(question)}>
            "{question}"
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmptyChatState;
