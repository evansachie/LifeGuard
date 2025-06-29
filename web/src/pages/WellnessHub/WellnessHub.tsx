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
import { WellnessSection, Sound } from '../../types/wellnessHub.types';
import './WellnessHub.css';

interface WellnessHubProps {
  isDarkMode: boolean;
}

interface LocalSound {
  title: string;
  location: string;
  imageName: string;
  audioURL: string;
}

const WellnessHub = ({ isDarkMode }: WellnessHubProps) => {
  const [activeSection, setActiveSection] = useState<WellnessSection>(() => {
    return (localStorage.getItem('wellnessSection') as WellnessSection) || 'breathing';
  });
  const [currentSound, setCurrentSound] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume] = useState<number>(0.5);

  const audioRef = useRef<HTMLAudioElement>(null);

  const handleSectionChange = (section: WellnessSection): void => {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
        audioRef.current.src = '';
      }
    };
  }, []);

  const mapLocalSoundToSound = (localSound: LocalSound): Sound => {
    return {
      id: localSound.title,
      name: localSound.title,
      duration: 0,
      url: localSound.audioURL,
      location: localSound.location,
      imageName: localSound.imageName,
    };
  };

  return (
    <div className={`wellness-hub ${isDarkMode ? 'dark' : ''}`}>
      <ParticleBackground isDarkMode={isDarkMode} />
      <SectionNavigation activeSection={activeSection} handleSectionChange={handleSectionChange} />

      <div className="content-area">
        <AnimatePresence mode="wait">
          {activeSection === 'breathing' && <BreathingSection isDarkMode={isDarkMode} />}

          {activeSection === 'meditation' && <MeditationSection isDarkMode={isDarkMode} />}

          {activeSection === 'sounds' && <SoundsSection isDarkMode={isDarkMode} />}
        </AnimatePresence>
      </div>

      {currentSound && (
        <>
          <AudioVisualizer audioRef={audioRef} isDarkMode={isDarkMode} />
          {activeSection !== 'sounds' && (
            <MiniPlayer
              sound={
                soundsData.find((s: LocalSound) => s.title === currentSound)
                  ? mapLocalSoundToSound(
                      soundsData.find((s: LocalSound) => s.title === currentSound) as LocalSound
                    )
                  : {
                      id: currentSound,
                      name: currentSound,
                      duration: 0,
                      url: '',
                    }
              }
              isPlaying={isPlaying}
              onPlayPause={() => setIsPlaying(!isPlaying)}
              onClose={() => {
                if (audioRef.current) {
                  audioRef.current.pause();
                }
                setCurrentSound(null);
                setIsPlaying(false);
              }}
            />
          )}
        </>
      )}
      <audio ref={audioRef} loop preload="auto">
        <track kind="captions" srcLang="en" label="English captions" />
        <p>
          Your browser does not support the audio element. This audio contains ambient sounds only,
          no speech content.
        </p>
      </audio>
    </div>
  );
};

export default WellnessHub;
