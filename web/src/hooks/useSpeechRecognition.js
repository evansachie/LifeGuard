import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const speechRecognitionRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      speechRecognitionRef.current = new SpeechRecognition();
      speechRecognitionRef.current.continuous = false;
      speechRecognitionRef.current.interimResults = false;
      speechRecognitionRef.current.lang = 'en-US';
      
      speechRecognitionRef.current.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        setIsListening(false);
      };
      
      speechRecognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        toast.error('Voice input failed. Please try again or type your question.');
        setIsListening(false);
      };
      
      speechRecognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
    
    return () => {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.abort();
      }
    };
  }, []);

  const toggleListening = () => {
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
