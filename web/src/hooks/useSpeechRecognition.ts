import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
        confidence: number;
      };
    };
    length: number;
  };
}

interface SpeechRecognitionType extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((event: Event) => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: {
      new(): SpeechRecognitionType;
    };
    webkitSpeechRecognition?: {
      new(): SpeechRecognitionType;
    };
  }
}

interface SpeechRecognitionResult {
  transcript: string;
  isListening: boolean;
  toggleListening: () => void;
}

export function useSpeechRecognition(): SpeechRecognitionResult {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const speechRecognitionRef = useRef<SpeechRecognitionType | null>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognitionConstructor) {
        speechRecognitionRef.current = new SpeechRecognitionConstructor();
        speechRecognitionRef.current.continuous = false;
        speechRecognitionRef.current.interimResults = false;
        speechRecognitionRef.current.lang = 'en-US';

        speechRecognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const text = event.results[0][0].transcript;
          setTranscript(text);
          setIsListening(false);
        };

        speechRecognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);
          toast.error('Voice input failed. Please try again or type your question.');
          setIsListening(false);
        };

        speechRecognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }

    return () => {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.abort();
      }
    };
  }, []);

  const toggleListening = (): void => {
    if (!speechRecognitionRef.current) {
      toast.error('Voice input is not supported in your browser.');
      return;
    }

    if (isListening) {
      speechRecognitionRef.current.stop();
      setIsListening(false);
    } else {
      speechRecognitionRef.current.start();
      setIsListening(true);
      setTranscript('');
      toast.info('Listening... Speak now.');
    }
  };

  return { isListening, transcript, toggleListening };
}
