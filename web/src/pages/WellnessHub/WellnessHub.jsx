import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaPause, FaVolumeUp, FaRedo, FaMusic, FaTimes } from 'react-icons/fa';
import { GiMeditation } from 'react-icons/gi';
import { BsClock } from 'react-icons/bs';
import BreathingCircle from '../../components/BreathingCircle/BreathingCircle';
import soundsData from '../../data/sound-data.json';
import { breathingPatterns } from '../../data/breathing-data';
import './WellnessHub.css';

const WellnessHub = ({ isDarkMode }) => {
    const [activeSection, setActiveSection] = useState(() => {
        return localStorage.getItem('wellnessSection') || 'breathing';
    });
    const [isBreathing, setIsBreathing] = useState(false);
    const [breathingPhase, setBreathingPhase] = useState('inhale');
    const [meditationTime, setMeditationTime] = useState(600);
    const [currentTime, setCurrentTime] = useState(600);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [currentSound, setCurrentSound] = useState(null);
    const [volume, setVolume] = useState(0.5);
    const [selectedPattern, setSelectedPattern] = useState(null);
    const [soundCategories] = useState({
        nature: ['Summit Song', 'Blackbird Melody', 'River Serenity', 'Ocean Waves'],
        ambience: ['The Library', 'Cafe Study Session', 'Drizzle Drive', 'Flight'],
        meditation: ['ॐ', "Vishnu's Sanctuary", 'Flute of Love', 'Meditative Escape'],
        cinematic: ['Written On The Sky', 'Interstellar', 'Dreamscape', 'Cornfield Chase'],
        gaming: ['Emerald Ranch', 'Wild West', 'Midgard Serenity', 'Post Apocalypse']
    });
    const [activeCategory, setActiveCategory] = useState('nature');
    const [isPlaying, setIsPlaying] = useState(false);

    const audioRef = useRef(null);
    const timerRef = useRef(null);
    const breathingRef = useRef(null);

    const meditationPresets = [
        { time: 300, label: '5 minutes', icon: <BsClock /> },
        { time: 600, label: '10 minutes', icon: <BsClock /> },
        { time: 900, label: '15 minutes', icon: <BsClock /> },
        { time: 1200, label: '20 minutes', icon: <BsClock /> }
    ];

    // Breathing Exercise Logic
    const startBreathing = (pattern) => {
        setSelectedPattern(pattern);
        setIsBreathing(true);
        setBreathingPhase('inhale');
        
        // Clear any existing interval
        if (breathingRef.current) {
            clearInterval(breathingRef.current);
        }
    };

    const handlePhaseComplete = () => {
        setBreathingPhase(current => {
            const phases = selectedPattern.pattern.holdAfterExhale 
                ? ['inhale', 'hold', 'exhale', 'holdAfterExhale']
                : ['inhale', 'hold', 'exhale'];
            
            const currentIndex = phases.indexOf(current);
            return phases[(currentIndex + 1) % phases.length];
        });
    };

    // Meditation Timer Logic
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const toggleTimer = () => {
        if (isTimerRunning) {
            clearInterval(timerRef.current);
        } else {
            timerRef.current = setInterval(() => {
                setCurrentTime((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        setIsTimerRunning(!isTimerRunning);
    };

    // Sound Management
    const handleSoundPlay = async (sound) => {
        if (audioRef.current) {
            if (currentSound === sound.title) {
                if (isPlaying) {
                    audioRef.current.pause();
                    setIsPlaying(false);
                } else {
                    await audioRef.current.play();
                    setIsPlaying(true);
                }
            } else {
                // Preload the new audio
                audioRef.current.src = sound.audioURL;
                audioRef.current.load();
                try {
                    await audioRef.current.play();
                    setCurrentSound(sound.title);
                    setIsPlaying(true);
                } catch (error) {
                    console.error('Error playing audio:', error);
                }
            }
        }
    };

    const handleSectionChange = (section) => {
        setActiveSection(section);
        localStorage.setItem('wellnessSection', section);
    };

    // Add new component for mini player
    const MiniPlayer = ({ sound, isPlaying, onPlayPause, onClose }) => (
        <motion.div 
            className="mini-player"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
        >
            <div className="mini-player-content">
                <img 
                    src={`/images/sounds/${sound.imageName}.jpg`} 
                    alt={sound.title} 
                    className="mini-player-image"
                />
                <div className="mini-player-info">
                    <h4>{sound.title}</h4>
                    <p>{sound.location}</p>
                </div>
                <div className="mini-player-controls">
                    <button onClick={onPlayPause}>
                        {isPlaying ? <FaPause /> : <FaPlay />}
                    </button>
                    <button onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>
            </div>
        </motion.div>
    );

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play();
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, activeSection]);

    // Add cleanup effect
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
            <div className="section-navigation">
                <motion.div className="nav-buttons">
                    {['breathing', 'meditation', 'sounds'].map((section) => (
                        <motion.button
                            key={section}
                            onClick={() => handleSectionChange(section)}
                            className={`nav-button ${activeSection === section ? 'active' : ''}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {section === 'breathing' && <GiMeditation />}
                            {section === 'meditation' && <GiMeditation />}
                            {section === 'sounds' && <FaVolumeUp />}
                            <span>{section.charAt(0).toUpperCase() + section.slice(1)}</span>
                        </motion.button>
                    ))}
                </motion.div>
            </div>

            <div className="content-area">
                <AnimatePresence mode="wait">
                    {activeSection === 'breathing' && (
                        <motion.div
                            className="breathing-section"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <h2>Breathing Exercises</h2>
                            <div className="breathing-patterns">
                                {breathingPatterns.map((pattern) => (
                                    <motion.div
                                        key={pattern.id}
                                        className={`pattern-card ${selectedPattern?.id === pattern.id ? 'active' : ''}`}
                                        style={{ '--pattern-color': pattern.color }}
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <div className="pattern-icon">{pattern.icon}</div>
                                        <h3>{pattern.name}</h3>
                                        <p>{pattern.description}</p>
                                        <button 
                                            className="start-button"
                                            onClick={() => startBreathing(pattern)}
                                        >
                                            Start
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                            {isBreathing && (
                                <AnimatePresence>
                                    <BreathingCircle
                                        phase={breathingPhase}
                                        pattern={selectedPattern.pattern}
                                        onComplete={handlePhaseComplete}
                                        onClose={() => setIsBreathing(false)}
                                    />
                                </AnimatePresence>
                            )}
                        </motion.div>
                    )}

                    {activeSection === 'meditation' && (
                        <motion.div
                            className="meditation-section"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <h2>Meditation Timer</h2>
                            <div className="timer-display">
                                <div className="time">{formatTime(currentTime)}</div>
                                <div className="timer-controls">
                                    <button onClick={toggleTimer}>
                                        {isTimerRunning ? <FaPause /> : <FaPlay />}
                                    </button>
                                    <button onClick={() => setCurrentTime(meditationTime)}>
                                        <FaRedo />
                                    </button>
                                </div>
                            </div>
                            <div className="meditation-presets">
                                {meditationPresets.map((preset) => (
                                    <button
                                        key={preset.time}
                                        className={`preset-button ${meditationTime === preset.time ? 'active' : ''}`}
                                        onClick={() => {
                                            setMeditationTime(preset.time);
                                            setCurrentTime(preset.time);
                                        }}
                                    >
                                        {preset.icon}
                                        <span>{preset.label}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeSection === 'sounds' && (
                        <motion.div
                            className="sounds-section"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <h2>Zen Sounds</h2>
                            
                            <div className="sound-categories">
                                {Object.keys(soundCategories).map((category) => (
                                    <button
                                        key={category}
                                        className={`category-btn ${activeCategory === category ? 'active' : ''}`}
                                        onClick={() => setActiveCategory(category)}
                                    >
                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                    </button>
                                ))}
                            </div>

                            <div className="sounds-grid">
                                {soundsData
                                    .filter(sound => soundCategories[activeCategory].includes(sound.title))
                                    .map((sound) => (
                                        <motion.div
                                            key={sound.title}
                                            className={`sound-card ${currentSound === sound.title ? 'playing' : ''}`}
                                            style={{
                                                backgroundImage: `url(/images/sounds/${sound.imageName}.jpg)`
                                            }}
                                            whileHover={{ scale: 1.02 }}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            <div className="sound-overlay" />
                                            <div className="sound-content">
                                                <h3 className="sound-title">{sound.title}</h3>
                                                <p className="sound-location">{sound.location}</p>
                                                <div className="sound-controls">
                                                    <button
                                                        className="play-button"
                                                        onClick={() => handleSoundPlay(sound)}
                                                    >
                                                        {currentSound === sound.title && isPlaying ? 
                                                            <FaPause /> : <FaPlay />}
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                            </div>

                            {currentSound && (
                                <motion.div 
                                    className="volume-control"
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                >
                                    <div className="now-playing">
                                        <FaMusic className="music-icon" />
                                        <span>Now Playing: {currentSound}</span>
                                    </div>
                                    <div className="volume-slider">
                                        <FaVolumeUp />
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.01"
                                            value={volume}
                                            onChange={(e) => {
                                                setVolume(e.target.value);
                                                if (audioRef.current) {
                                                    audioRef.current.volume = e.target.value;
                                                }
                                            }}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            {currentSound && activeSection !== 'sounds' && (
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
            <audio ref={audioRef} loop preload="auto" />
        </div>
    );
};

export default WellnessHub; 