import React, { createContext, useState, useContext, useRef, ReactNode } from 'react';
import { AudioPlayerContextType } from '../types/wellnessHub.types';

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

interface AudioPlayerProviderProps {
  children: ReactNode;
}

export const AudioPlayerProvider = ({ children }: AudioPlayerProviderProps) => {
  const [currentSound, setCurrentSound] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.7);
  const audioRef = useRef<HTMLAudioElement>(null);

  const value: AudioPlayerContextType = {
    currentSound,
    setCurrentSound,
    isPlaying,
    setIsPlaying,
    volume,
    setVolume,
    audioRef,
  };

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
      <audio ref={audioRef}>
        <track kind="captions" src="" label="No captions available" default />
      </audio>
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = (): AudioPlayerContextType => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};
