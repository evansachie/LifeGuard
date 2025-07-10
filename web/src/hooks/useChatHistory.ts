import { useState, useEffect, useCallback, useRef } from 'react';
import { Message, ChatHistoryHook } from '../types/chat.types';
import { ragService } from '../services/ragService';

let messageCounter = 0;

export const useChatHistory = (): ChatHistoryHook => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasRagContext, setHasRagContext] = useState<boolean | null>(null);
  const userId = localStorage.getItem('userId');
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load initial state
  useEffect(() => {
    // Load any stored messages from localStorage
    const storedMessages = localStorage.getItem('chatMessages');
    if (storedMessages) {
      try {
        setMessages(JSON.parse(storedMessages));
      } catch (error) {
        console.error('Failed to parse stored messages:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  // Check if user has RAG context (uploaded health report)
  useEffect(() => {
    const checkRagContext = async () => {
      if (!userId) {
        setHasRagContext(false);
        return;
      }

      try {
        // Try a simple test query to see if user has context
        const testResponse = await ragService.askQuestion({
          user_id: userId,
          question: 'Give me an overview of what you know about me?',
          top_k: 1,
        });

        // If we get a "No relevant document chunks" response, then no context
        setHasRagContext(!testResponse.answer.includes('No relevant document chunks found'));
      } catch (error) {
        console.error('Error checking RAG context:', error);
        setHasRagContext(false);
      }
    };

    checkRagContext();
  }, [userId]);

  // Add a user message to the chat
  const addUserMessage = useCallback((text: string) => {
    // Use a combination of timestamp and counter for unique IDs
    messageCounter++;
    const newMessage: Message = {
      id: `${Date.now().toString()}_${messageCounter}`,
      type: 'user',
      text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  }, []);

  // Add an assistant message to the chat
  const addAssistantMessage = useCallback(
    (text: string, isLoading = false, source: 'with-context' | 'no-context' = 'no-context') => {
      messageCounter++;
      const newMessage: Message = {
        id: `${Date.now().toString()}_${messageCounter}`,
        type: 'assistant',
        text,
        timestamp: new Date().toISOString(),
        isLoading,
        source,
      };

      setMessages((prev) => [...prev, newMessage]);
      return newMessage;
    },
    []
  );

  // Update a message (used for loading states)
  const updateMessage = useCallback((id: string, updates: Partial<Message>) => {
    setMessages((prev) => prev.map((msg) => (msg.id === id ? { ...msg, ...updates } : msg)));
  }, []);

  const cleanResponseText = (query: string, response: string): string => {
    if (!response) return response;

    const queryLower = query.trim().toLowerCase();
    const responseLower = response.trim().toLowerCase();

    if (responseLower.startsWith(queryLower)) {
      const cleanedText = response.substring(query.length).trim();
      // Remove any leading punctuation
      return cleanedText.replace(/^[,.?!:;\s]+/, '');
    }

    // Check for common prefixes
    const prefixes = [
      'based on your health data',
      'according to your health data',
      'from your health data',
      'your health data shows',
      'according to the information provided',
      'based on the information provided',
    ];

    for (const prefix of prefixes) {
      if (responseLower.startsWith(prefix)) {
        const cleanedText = response.substring(prefix.length).trim();
        // Remove any leading punctuation
        return cleanedText.replace(/^[,.?!:;\s]+/, '');
      }
    }

    return response;
  };

  // Send a query to the assistant
  const sendQuery = async (query: string) => {
    if (!query.trim()) return;

    addUserMessage(query);

    // Cancel any previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setIsLoading(true);

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found');
      }

      // Try RAG first if user has context
      try {
        const loadingMsgId = addAssistantMessage(
          'Analyzing your health data...',
          true,
          'with-context'
        ).id;

        // Query the RAG system with user ID
        const ragResponse = await ragService.askQuestion({
          user_id: userId,
          question: query,
          top_k: 3,
        });

        // Check if we got a "no context" response from RAG
        if (ragResponse.answer.includes('No relevant document chunks found')) {
          // Update state for future queries
          setHasRagContext(false);

          // Update loading message to indicate fallback
          updateMessage(loadingMsgId, {
            text: "You haven't uploaded any health reports yet. Please upload a PDF in the Health Report section to get personalized insights.",
            isLoading: false,
            source: 'no-context',
          });
        } else {
          // Process the response to remove any duplicated question or prefixes
          const cleanedAnswer = cleanResponseText(query, ragResponse.answer);

          // Update loading message with the processed RAG response
          updateMessage(loadingMsgId, {
            text: cleanedAnswer,
            isLoading: false,
            source: 'with-context',
          });

          // Update state for future queries
          setHasRagContext(true);
        }
      } catch (error) {
        console.error('RAG query error:', error);
        // RAG failed, we can inform the user
        const loadingMsgId = addAssistantMessage(
          "I'm sorry, I couldn't process your request at the moment. Please try again later.",
          false,
          'no-context'
        ).id;
        updateMessage(loadingMsgId, {
          isLoading: false,
          isError: true,
        });
        setHasRagContext(null);
      }
    } catch (error) {
      console.error('Chat query error:', error);
      // Handle general errors
      const loadingMsgId = addAssistantMessage(
        "I'm sorry, I encountered an error while processing your request. Please try again later.",
        false,
        'no-context'
      ).id;
      updateMessage(loadingMsgId, {
        isLoading: false,
        isError: true,
      });
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  // Clear chat history
  const clearHistory = useCallback(() => {
    setMessages([]);
    localStorage.removeItem('chatMessages');
  }, []);

  return {
    messages,
    isLoading,
    hasRagContext,
    sendQuery,
    clearHistory,
    addUserMessage,
    addAssistantMessage,
    updateMessage,
  };
};

export default useChatHistory;
