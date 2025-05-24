import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import type { AudioContextType, AudioTrack } from '../types/common.types';

const AudioContext = createContext<AudioContextType | undefined>(undefined);

interface AudioProviderProps {
  children: ReactNode;
}

export const AudioContextProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.7);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playlist, setPlaylist] = useState<AudioTrack[]>([]);
  const [repeatMode, setRepeatMode] = useState<'off' | 'one' | 'all'>('off');
  const [shuffleMode, setShuffleMode] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrackIndex = useRef<number>(-1);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;

    const audio = audioRef.current;

    const handleTimeUpdate = (): void => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = (): void => {
      setDuration(audio.duration);
    };

    const handleEnded = (): void => {
      handleTrackEnd();
    };

    const handleCanPlay = (): void => {
      setDuration(audio.duration);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.pause();
    };
  }, []);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Load and play track
  const loadTrack = useCallback((track: AudioTrack): void => {
    if (audioRef.current) {
      audioRef.current.src = track.url;
      setCurrentTrack(track);
      setCurrentTime(0);
      setDuration(0);
    }
  }, []);

  // Handle track end based on repeat/shuffle settings
  const handleTrackEnd = useCallback((): void => {
    if (repeatMode === 'one') {
      play(); // Replay current track
    } else if (repeatMode === 'all' || shuffleMode) {
      next(); // Play next track
    } else {
      setIsPlaying(false);
    }
  }, [repeatMode, shuffleMode]);

  // Get next track index based on shuffle mode
  const getNextTrackIndex = useCallback((): number => {
    if (playlist.length === 0) return -1;

    if (shuffleMode) {
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * playlist.length);
      } while (nextIndex === currentTrackIndex.current && playlist.length > 1);
      return nextIndex;
    } else {
      return (currentTrackIndex.current + 1) % playlist.length;
    }
  }, [playlist.length, shuffleMode]);

  // Get previous track index
  const getPreviousTrackIndex = useCallback((): number => {
    if (playlist.length === 0) return -1;

    if (shuffleMode) {
      let prevIndex;
      do {
        prevIndex = Math.floor(Math.random() * playlist.length);
      } while (prevIndex === currentTrackIndex.current && playlist.length > 1);
      return prevIndex;
    } else {
      return currentTrackIndex.current > 0 
        ? currentTrackIndex.current - 1 
        : playlist.length - 1;
    }
  }, [playlist.length, shuffleMode]);

  // Play function
  const play = useCallback((track?: AudioTrack): void => {
    if (track) {
      loadTrack(track);
      currentTrackIndex.current = playlist.findIndex(t => t.id === track.id);
    }

    if (audioRef.current) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
        });
    }
  }, [loadTrack, playlist]);

  // Pause function
  const pause = useCallback((): void => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  // Stop function
  const stop = useCallback((): void => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, []);

  // Next track function
  const next = useCallback((): void => {
    const nextIndex = getNextTrackIndex();
    if (nextIndex !== -1 && playlist[nextIndex]) {
      currentTrackIndex.current = nextIndex;
      play(playlist[nextIndex]);
    }
  }, [getNextTrackIndex, playlist, play]);

  // Previous track function
  const previous = useCallback((): void => {
    const prevIndex = getPreviousTrackIndex();
    if (prevIndex !== -1 && playlist[prevIndex]) {
      currentTrackIndex.current = prevIndex;
      play(playlist[prevIndex]);
    }
  }, [getPreviousTrackIndex, playlist, play]);

  // Set volume function
  const setVolumeLevel = useCallback((newVolume: number): void => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
  }, []);

  // Seek function
  const seek = useCallback((time: number): void => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  // Toggle repeat mode
  const toggleRepeat = useCallback((): void => {
    setRepeatMode(prev => {
      switch (prev) {
        case 'off': return 'all';
        case 'all': return 'one';
        case 'one': return 'off';
        default: return 'off';
      }
    });
  }, []);

  // Toggle shuffle mode
  const toggleShuffle = useCallback((): void => {
    setShuffleMode(prev => !prev);
  }, []);

  // Add track to playlist
  const addToPlaylist = useCallback((track: AudioTrack): void => {
    setPlaylist(prev => {
      const exists = prev.some(t => t.id === track.id);
      if (!exists) {
        return [...prev, track];
      }
      return prev;
    });
  }, []);

  // Remove track from playlist
  const removeFromPlaylist = useCallback((trackId: string): void => {
    setPlaylist(prev => {
      const newPlaylist = prev.filter(t => t.id !== trackId);
      
      // If currently playing track is removed, stop playback
      if (currentTrack?.id === trackId) {
        stop();
        setCurrentTrack(null);
        currentTrackIndex.current = -1;
      } else if (currentTrack) {
        // Update current track index
        currentTrackIndex.current = newPlaylist.findIndex(t => t.id === currentTrack.id);
      }
      
      return newPlaylist;
    });
  }, [currentTrack, stop]);

  const value: AudioContextType = {
    currentTrack,
    isPlaying,
    volume,
    currentTime,
    duration,
    playlist,
    repeatMode,
    shuffleMode,
    play,
    pause,
    stop,
    next,
    previous,
    setVolume: setVolumeLevel,
    seek,
    toggleRepeat,
    toggleShuffle,
    addToPlaylist,
    removeFromPlaylist,
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioContextProvider');
  }
  return context;
};

// Backward compatibility alias
export const useAudioContext = useAudio;

export default AudioContext;
