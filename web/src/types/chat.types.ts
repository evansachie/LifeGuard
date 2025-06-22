export interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  isLoading?: boolean;
  source?: 'with-context' | 'no-context';
  isError?: boolean;
}

export interface ChatHistoryHook {
  messages: Message[];
  isLoading: boolean;
  hasRagContext: boolean | null;
  sendQuery: (query: string) => Promise<void>;
  clearHistory: () => void;
  addUserMessage: (text: string) => Message;
  addAssistantMessage: (
    text: string,
    isLoading?: boolean,
    source?: 'with-context' | 'no-context'
  ) => Message;
  updateMessage: (id: string, updates: Partial<Message>) => void;
}

export interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  isDarkMode?: boolean;
  hasRagContext?: boolean | null;
  onExampleClick: (question: string) => void;
}
