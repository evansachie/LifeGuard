import React, { createContext, useContext, useState, useRef } from 'react';

const AudioPlayerContext = createContext();

export const AudioPlayerProvider = ({ children }) => {
  const [currentSound, setCurrentSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef(null);

  const value = {
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

export const useAudioPlayer = () => useContext(AudioPlayerContext);
