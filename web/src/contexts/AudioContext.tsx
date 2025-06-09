import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';
import { handleError } from '../utils/errorHandler';

interface AudioContextType {
  isPlaying: boolean;
  currentTrack: string | null;
  volume: number;
  duration: number;
  currentTime: number;
  playSound: (url: string, title: string) => Promise<void>;
  pauseSound: () => void;
  resumeSound: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
}

interface AudioProviderProps {
  children: ReactNode;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioContextProvider = ({ children }: AudioProviderProps) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [volume, setVolumeState] = useState<number>(0.5);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = async (url: string, title: string): Promise<void> => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
      }

      audioRef.current = new Audio(url);
      audioRef.current.volume = volume;

      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0);
      });

      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      });

      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTrack(null);
        setCurrentTime(0);
      });

      audioRef.current.addEventListener('error', (error: unknown) => {
        handleError(error, 'Audio playback', true, 'Failed to play audio');
        setIsPlaying(false);
        setCurrentTrack(null);
      });

      await audioRef.current.play();
      setIsPlaying(true);
      setCurrentTrack(title);
    } catch (error: unknown) {
      handleError(error, 'Play sound', true, 'Failed to play sound');
      setIsPlaying(false);
      setCurrentTrack(null);
    }
  };

  const pauseSound = (): void => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resumeSound = (): void => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch((error: unknown) => {
        handleError(error, 'Resume sound', true, 'Failed to resume sound');
      });
      setIsPlaying(true);
    }
  };

  const setVolume = (newVolume: number): void => {
    setVolumeState(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const seekTo = (time: number): void => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const value: AudioContextType = {
    isPlaying,
    currentTrack,
    volume,
    duration,
    currentTime,
    playSound,
    pauseSound,
    resumeSound,
    setVolume,
    seekTo,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};

export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioContextProvider');
  }
  return context;
};

export default AudioContext;
