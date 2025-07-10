import { FaHeartbeat, FaFileUpload } from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface EmptyChatStateProps {
  onExampleClick: (question: string) => void;
  isDarkMode?: boolean;
  hasRagContext?: boolean | null;
}

const EmptyChatState = ({
  onExampleClick,
  isDarkMode = false,
  hasRagContext = null,
}: EmptyChatStateProps) => {
  const isAuthenticated = !!localStorage.getItem('token');

  const exampleQuestions = [
    'How can I improve my sleep quality?',
    'What are some stress management techniques?',
    'How much water should I drink daily?',
    'What are signs of good nutrition?',
    'How do I start exercising safely?',
  ];

  const personalizedQuestions = [
    'What is my current health status?',
    'What should I focus on improving?',
    'Am I getting enough exercise?',
    'Analyze my latest health metrics',
    'What are my risk factors?',
  ];

  // Show personalized questions if user has RAG context
  const displayQuestions = hasRagContext === true ? personalizedQuestions : exampleQuestions;

  return (
    <div className="empty-chat">
      <FaHeartbeat size={40} color="#4a90e2" />
      <p>Hello! I&apos;m your LifeGuard Health Assistant.</p>

      {hasRagContext === true && (
        <p>I have access to your health data and can provide personalized insights!</p>
      )}

      {hasRagContext === false && isAuthenticated && (
        <div
          className="upload-prompt"
          style={{
            padding: '12px',
            marginBottom: '15px',
            borderRadius: '8px',
            background: isDarkMode ? '#2d3748' : '#f0f9ff',
            border: `1px solid ${isDarkMode ? '#4a5568' : '#bfdbfe'}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <FaFileUpload size={24} color="#4a90e2" />
          <p style={{ margin: 0, fontSize: '14px', textAlign: 'center' }}>
            Upload your health report to get personalized advice!
          </p>
          <Link
            to="/health-report"
            style={{
              display: 'inline-block',
              padding: '8px 16px',
              background: '#4a90e2',
              color: 'white',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            Go to Health Report
          </Link>
        </div>
      )}

      {!isAuthenticated && (
        <div
          className="auth-notice"
          style={{
            background: isDarkMode ? '#2d3748' : '#e3f2fd',
            padding: '8px 12px',
            borderRadius: '8px',
            margin: '10px 0',
            fontSize: '12px',
            color: isDarkMode ? '#90cdf4' : '#1976d2',
          }}
        >
          💡 Log in to unlock advanced AI health analysis and personalized recommendations!
        </div>
      )}

      <p className="examples-title">Try asking about:</p>
      <div className="examples-list" role="list">
        {displayQuestions.map((question, index) => (
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
