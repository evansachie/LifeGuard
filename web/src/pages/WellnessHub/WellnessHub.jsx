import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import SectionNavigation from '../../components/WellnessHub/SectionNavigation';
import MiniPlayer from '../../components/WellnessHub/MiniPlayer';
import BreathingSection from '../../components/WellnessHub/BreathingSection';
import MeditationSection from '../../components/WellnessHub/MeditationSection';
import SoundsSection from '../../components/WellnessHub/SoundsSection';
import soundsData from '../../data/sound-data.json';
import ParticleBackground from '../../components/WellnessHub/ParticleBackground';
import AudioVisualizer from '../../components/WellnessHub/AudioVisualizer';
import './WellnessHub.css';

const WellnessHub = ({ isDarkMode }) => {
    const [activeSection, setActiveSection] = useState(() => {
        return localStorage.getItem('wellnessSection') || 'breathing';
    });
    const [currentSound, setCurrentSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    
    const audioRef = useRef(null);

    const handleSectionChange = (section) => {
        setActiveSection(section);
        localStorage.setItem('wellnessSection', section);
    };

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = '';
            }
        };
    }, []);

    return (
        <div className={`wellness-hub ${isDarkMode ? 'dark' : ''}`}>
            <ParticleBackground isDarkMode={isDarkMode} />
            <SectionNavigation 
                activeSection={activeSection} 
                handleSectionChange={handleSectionChange} 
            />

            <div className="content-area">
                <AnimatePresence mode="wait">
                    {activeSection === 'breathing' && (
                        <BreathingSection isDarkMode={isDarkMode} />
                    )}

                    {activeSection === 'meditation' && (
                        <MeditationSection isDarkMode={isDarkMode} />
                    )}

                    {activeSection === 'sounds' && (
                        <SoundsSection 
                            isDarkMode={isDarkMode}
                            currentSound={currentSound}
                            setCurrentSound={setCurrentSound}
                            isPlaying={isPlaying}
                            setIsPlaying={setIsPlaying}
                            volume={volume}
                            setVolume={setVolume}
                            audioRef={audioRef}
                        />
                    )}
                </AnimatePresence>
            </div>

            {currentSound && (
                <>
                    <AudioVisualizer audioRef={audioRef} isDarkMode={isDarkMode} />
                    {activeSection !== 'sounds' && (
                        <MiniPlayer 
                            sound={soundsData.find(s => s.title === currentSound)}
                            isPlaying={isPlaying}
                            onPlayPause={() => setIsPlaying(!isPlaying)}
                            onClose={() => {
                                audioRef.current.pause();
                                setCurrentSound(null);
                                setIsPlaying(false);
                            }}
                        />
                    )}
                </>
            )}
            <audio ref={audioRef} loop preload="auto" />
        </div>
    );
};

export default WellnessHub;