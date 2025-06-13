import { useState, useEffect } from 'react';
import { fetchWithAuth, API_ENDPOINTS } from '../utils/api';
import { handleError, getErrorMessage } from '../utils/errorHandler';
import { ragService } from '../services/ragService';

interface ChatMessage {
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isError?: boolean;
}

interface ChatHistoryReturn {
  chatHistory: ChatMessage[];
  loading: boolean;
  sendQuery: (query: string) => Promise<string | null>;
  clearHistory: () => void;
  addUserMessage: (content: string) => ChatMessage;
  addAssistantMessage: (content: string, isError?: boolean) => ChatMessage;
}

interface QueryResponse {
  response: string;
  [key: string]: any;
}

export function useChatHistory(): ChatHistoryReturn {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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

  const addUserMessage = (content: string): ChatMessage => {
    const message: ChatMessage = {
      type: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    setChatHistory((prev) => [...prev, message]);
    return message;
  };

  const addAssistantMessage = (content: string, isError = false): ChatMessage => {
    const message: ChatMessage = {
      type: 'assistant',
      content,
      timestamp: new Date().toISOString(),
      isError,
    };
    setChatHistory((prev) => [...prev, message]);
    return message;
  };

  const clearHistory = (): void => {
    setChatHistory([]);
    setLoading(false);
  };

  const getBasicHealthResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();

    // Basic health responses for common questions
    if (lowerQuery.includes('headache') || lowerQuery.includes('head pain')) {
      return 'For headaches, try resting in a quiet, dark room, staying hydrated, and applying a cold or warm compress. If headaches persist or are severe, please consult a healthcare professional.';
    }

    if (lowerQuery.includes('fever') || lowerQuery.includes('temperature')) {
      return 'For fever, rest, drink plenty of fluids, and consider over-the-counter fever reducers if appropriate. Seek medical attention if fever is high (over 103°F/39.4°C) or persists for more than 3 days.';
    }

    if (lowerQuery.includes('cough') || lowerQuery.includes('sore throat')) {
      return 'For cough or sore throat, try warm saltwater gargles, honey (for adults), staying hydrated, and using a humidifier. If symptoms worsen or persist beyond a week, consult a healthcare provider.';
    }

    if (lowerQuery.includes('stress') || lowerQuery.includes('anxiety')) {
      return "For stress and anxiety, try deep breathing exercises, regular physical activity, adequate sleep, and mindfulness practices. If you're experiencing persistent anxiety, consider speaking with a mental health professional.";
    }

    if (lowerQuery.includes('sleep') || lowerQuery.includes('insomnia')) {
      return 'For better sleep, maintain a regular sleep schedule, avoid screens before bedtime, keep your bedroom cool and dark, and limit caffeine late in the day. If sleep problems persist, consult a healthcare provider.';
    }

    if (lowerQuery.includes('exercise') || lowerQuery.includes('workout')) {
      return 'Regular exercise is important for overall health. Aim for at least 150 minutes of moderate aerobic activity per week, plus strength training exercises. Start slowly and gradually increase intensity. Always consult your doctor before starting a new exercise program.';
    }

    if (
      lowerQuery.includes('diet') ||
      lowerQuery.includes('nutrition') ||
      lowerQuery.includes('eating')
    ) {
      return 'A balanced diet includes plenty of fruits, vegetables, whole grains, lean proteins, and healthy fats. Stay hydrated, limit processed foods, and control portion sizes. Consider consulting a registered dietitian for personalized advice.';
    }

    if (lowerQuery.includes('water') || lowerQuery.includes('hydration')) {
      return "Staying hydrated is essential for health. Aim for about 8 glasses (64 ounces) of water daily, more if you're active or in hot weather. Signs of good hydration include pale yellow urine and feeling energetic.";
    }

    // Default response
    return 'Thank you for your health question. While I can provide general wellness information, I recommend consulting with a qualified healthcare professional for personalized medical advice. In the meantime, maintaining a healthy lifestyle with regular exercise, balanced nutrition, adequate sleep, and stress management is always beneficial.';
  };

  const sendQuery = async (query: string): Promise<string | null> => {
    if (!query.trim()) return null;
    setLoading(true);

    try {
      addUserMessage(query);

      // Check if user is authenticated
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (token && userId) {
        // Check if query is about health report/PDF data
        const healthReportKeywords = [
          'health report',
          'my report',
          'pdf',
          'vitals',
          'environmental metrics',
          'activity metrics',
          'recommendations',
          'blood pressure',
          'heart rate',
          'temperature',
          'humidity',
          'air quality',
        ];

        const isHealthReportQuery = healthReportKeywords.some((keyword) =>
          query.toLowerCase().includes(keyword)
        );

        if (isHealthReportQuery) {
          try {
            // Try RAG system first for health report queries
            const ragResponse = await ragService.askQuestion({
              user_id: userId,
              question: query,
              top_k: 3,
            });

            addAssistantMessage(ragResponse.answer);
            return ragResponse.answer;
          } catch (ragError) {
            console.log('RAG query failed, falling back to regular API:', ragError);
            // Fall through to regular API if RAG fails
          }
        }

        // Try authenticated request for general health queries
        try {
          const result = await fetchWithAuth<QueryResponse>(API_ENDPOINTS.RAG_QUERY, {
            method: 'POST',
            body: JSON.stringify({ question: query, userId }),
            headers: { Authorization: `Bearer ${token}` },
          });

          addAssistantMessage(result.response);
          return result.response;
        } catch (authError: unknown) {
          const errorMessage = getErrorMessage(authError, 'Authentication failed');
          console.log(
            'Authenticated request failed, falling back to basic responses:',
            errorMessage
          );
        }
      }

      // Provide basic health responses for unauthenticated users or when API fails
      const basicResponse = getBasicHealthResponse(query);

      // Add a note about enhanced features for authenticated users
      const enhancedResponse = token
        ? basicResponse
        : `${basicResponse}\n\n💡 **Tip**: Log in to access our advanced AI health assistant with personalized responses and comprehensive health analysis!`;

      addAssistantMessage(enhancedResponse);
      return enhancedResponse;
    } catch (error: unknown) {
      handleError(error, 'Health assistant query', false);

      const errorMessage =
        "I'm currently experiencing some technical difficulties. Here are some general health tips: maintain a balanced diet, exercise regularly, get adequate sleep, stay hydrated, and consult healthcare professionals for any specific concerns.";

      addAssistantMessage(errorMessage, true);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    chatHistory,
    loading,
    sendQuery,
    clearHistory,
    addUserMessage,
    addAssistantMessage,
  };
}
