
interface ChatInputFormProps {
  query: string;
  onQueryChange: (value: string) => void;
  onSubmit: (query?: string) => void;
  isLoading: boolean;
  isListening: boolean;
  toggleListening: () => void;
  inputRef: RefObject<HTMLInputElement>;
}

const ChatInputForm = ({
  query,
  onQueryChange,
  onSubmit,
  isLoading,
  isListening,
  toggleListening,
  inputRef,
}: ChatInputFormProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onQueryChange(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading && !isListening) {
      onSubmit(query);
    }
  };

  return (
      <input
        ref={inputRef}
        type="text"
        placeholder="Ask about your health..."
        disabled={isLoading || isListening}
        ref={inputRef}
        className="flex-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm border-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70"
      />
      <div className="flex ml-2 gap-2">
        {!isLoading && (
          <>
      <button
        type="button"
        onClick={toggleListening}
              className={`flex items-center justify-center w-9 h-9 rounded-full transition-all ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                  : 'bg-indigo-500 hover:bg-indigo-600'
              } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label={isListening ? 'Stop listening' : 'Start voice input'}
        disabled={isLoading}
        className={`voice-button ${isListening ? 'listening' : ''}`}
        aria-label={isListening ? 'Stop listening' : 'Start voice input'}
        title={isListening ? 'Stop listening' : 'Start voice input'}
      >
      </button>
      <button
        type="submit"
        aria-label="Send message"
        title="Send message"
      >
      </button>
          </>
        )}
        {isLoading && (
          <div className="w-6 h-6 rounded-full border-2 border-gray-300 border-t-blue-500 animate-spin mx-2"></div>
        )}
      </div>
    </form>
  );
};

export default ChatInputForm;
