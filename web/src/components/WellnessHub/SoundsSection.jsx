import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaPause, FaVolumeUp, FaMusic } from 'react-icons/fa';
import soundsData from '../../data/sound-data.json';

const SoundsSection = ({ 
    isDarkMode, 
    currentSound, 
    setCurrentSound, 
    isPlaying, 
    setIsPlaying, 
    volume, 
    setVolume,
    audioRef 
}) => {
    const [soundCategories] = useState({
        nature: ['Summit Song', 'Blackbird Melody', 'River Serenity', 'Ocean Waves'],
        ambience: ['The Library', 'Cafe Study Session', 'Drizzle Drive', 'Flight'],
        meditation: ['ॐ', "Vishnu's Sanctuary", 'Flute of Love', 'Meditative Escape'],
        cinematic: ['Written On The Sky', 'Interstellar', 'Dreamscape', 'Cornfield Chase'],
        gaming: ['Emerald Ranch', 'Wild West', 'Midgard Serenity', 'Post Apocalypse']
    });
    const [activeCategory, setActiveCategory] = useState('nature');

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

    return (
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
    );
};

export default SoundsSection;
