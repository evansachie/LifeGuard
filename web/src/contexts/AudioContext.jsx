import React, { createContext, useContext, useRef, useEffect } from 'react';

const AudioContextContext = createContext(null);

export function AudioContextProvider({ children }) {
    const audioContextRef = useRef(null);
    const sourceNodeRef = useRef(null);
    const analyserRef = useRef(null);

    useEffect(() => {
        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    const setupAudioContext = (audioElement) => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }

        if (!analyserRef.current) {
            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 256;
        }

        // Disconnect previous source if it exists
        if (sourceNodeRef.current) {
            sourceNodeRef.current.disconnect();
        }

        // Create and connect new source
        sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audioElement);
        sourceNodeRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);

        return analyserRef.current;
    };

    return (
        <AudioContextContext.Provider value={{ setupAudioContext }}>
            {children}
        </AudioContextContext.Provider>
    );
};

export const useAudioContext = () => useContext(AudioContextContext);
