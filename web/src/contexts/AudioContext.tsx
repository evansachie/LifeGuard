import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { AudioContextType } from '../types/wellnessHub.types';

const AudioContext = createContext<AudioContextType | null>(null);

interface AudioContextProviderProps {
  children: ReactNode;
}

export const AudioContextProvider: React.FC<AudioContextProviderProps> = ({ children }) => {
  const setupAudioContext = (audioElement: HTMLAudioElement): AnalyserNode => {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioCtx.createAnalyser();

    // Connect audio element to the analyser
    const source = audioCtx.createMediaElementSource(audioElement);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);

    // Configure analyser
    analyser.fftSize = 256;

    return analyser;
  };

  const value = useMemo(
    () => ({
      setupAudioContext,
    }),
    []
  );

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};

export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);

  if (!context) {
    throw new Error('useAudio must be used within an AudioContextProvider');
  }

  return context;
};
