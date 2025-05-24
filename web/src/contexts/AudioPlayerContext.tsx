import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';

interface AudioPlayerContextType {
  currentSound: Sound | null;
  setCurrentSound: React.Dispatch<React.SetStateAction<Sound | null>>;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  volume: number;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
  audioRef: React.RefObject<HTMLAudioElement>;
}

interface Sound {
  id: string;
  name: string;
  url: string;
  [key: string]: any;
}

interface AudioPlayerProviderProps {
  children: ReactNode;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const AudioPlayerProvider: React.FC<AudioPlayerProviderProps> = ({ children }) => {
  const [currentSound, setCurrentSound] = useState<Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);
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
      <audio ref={audioRef} loop preload="auto">
        <track kind="captions" srcLang="en" label="English captions" />
        <p>
          Your browser does not support the audio element. This audio contains ambient sounds only,
          no speech content.
        </p>
      </audio>
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = (): AudioPlayerContextType => {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};
