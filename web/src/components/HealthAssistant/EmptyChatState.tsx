import { FaHeartbeat } from 'react-icons/fa';

interface EmptyChatStateProps {
  onExampleClick: (question: string) => void;
  isDarkMode?: boolean;
}

const EmptyChatState = ({ onExampleClick, isDarkMode = false }: EmptyChatStateProps) => {
  const isAuthenticated = !!localStorage.getItem('token');

  const exampleQuestions = [
    'How can I improve my sleep quality?',
    'What are some stress management techniques?',
    'How much water should I drink daily?',
    'What are signs of good nutrition?',
    'How do I start exercising safely?',
  ];

  return (
    <div className="empty-chat">
      <FaHeartbeat size={40} color="#4a90e2" />
      <p>Hello! I&apos;m your LifeGuard Health Assistant.</p>
      <p>
        {isAuthenticated
          ? 'Ask me anything about your health and wellness!'
          : 'Ask me general health questions, or log in for personalized advice!'}
      </p>

      {!isAuthenticated && (
        <div
          className="auth-notice"
          style={{
            background: '#e3f2fd',
            padding: '8px 12px',
            borderRadius: '8px',
            margin: '10px 0',
            fontSize: '12px',
            color: '#1976d2',
          }}
        >
          💡 Log in to unlock advanced AI health analysis and personalized recommendations!
        </div>
      )}

      <p className="examples-title">Try asking about:</p>
      <div className="examples-list" role="list">
        {exampleQuestions.map((question, index) => (
          <button
            key={index}
            type="button"
            className="example-question-button"
            onClick={() => onExampleClick(question)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onExampleClick(question);
              }
            }}
            style={{
              background: isDarkMode ? '#4a5568' : 'white',
              color: isDarkMode ? '#e2e8f0' : '#333',
              border: 'none',
              padding: '10px 15px',
              margin: '0 0 8px 0',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
              boxShadow: isDarkMode
                ? '0 1px 3px rgba(0, 0, 0, 0.2)'
                : '0 1px 3px rgba(0, 0, 0, 0.08)',
              fontSize: '14px',
              textAlign: 'left',
              width: '100%',
              display: 'block',
            }}
            onMouseEnter={(e) => {
              if (isDarkMode) {
                e.currentTarget.style.backgroundColor = '#718096';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.25)';
              } else {
                e.currentTarget.style.backgroundColor = '#eef4ff';
                e.currentTarget.style.color = '#333';
                e.currentTarget.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
              }
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              if (isDarkMode) {
                e.currentTarget.style.backgroundColor = '#4a5568';
                e.currentTarget.style.color = '#e2e8f0';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.2)';
              } else {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = '#333';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.08)';
              }
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = '2px solid #4a90e2';
              e.currentTarget.style.outlineOffset = '2px';
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = 'none';
            }}
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmptyChatState;
