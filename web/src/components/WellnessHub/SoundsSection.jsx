import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaPause, FaVolumeUp, FaMusic, FaSpinner } from 'react-icons/fa';
import { searchSounds } from '../../services/freesoundService';

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
    const [sounds, setSounds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeCategory, setActiveCategory] = useState('nature');
    const [page, setPage] = useState(1);

    const categories = {
        nature: 'Nature Sounds',
        ambience: 'Ambient',
        meditation: 'Meditation',
        water: 'Water',
        birds: 'Birds'
    };

    useEffect(() => {
        const fetchSounds = async () => {
            setLoading(true);
            try {
                const data = await searchSounds(activeCategory, page);
                setSounds(data.results);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSounds();
    }, [activeCategory, page]);

    const handleSoundPlay = async (sound) => {
        if (audioRef.current) {
            if (currentSound === sound.name) {
                if (isPlaying) {
                    audioRef.current.pause();
                    setIsPlaying(false);
                } else {
                    await audioRef.current.play();
                    setIsPlaying(true);
                }
            } else {
                audioRef.current.src = sound.previews['preview-hq-mp3'];
                audioRef.current.load();
                try {
                    await audioRef.current.play();
                    setCurrentSound(sound.name);
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
                {Object.entries(categories).map(([key, label]) => (
                    <button
                        key={key}
                        className={`category-btn ${activeCategory === key ? 'active' : ''}`}
                        onClick={() => {
                            setActiveCategory(key);
                            setPage(1);
                        }}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="loading-container">
                    <FaSpinner className="spinner" />
                    <p>Loading sounds...</p>
                </div>
            ) : (
                <div className="sounds-grid">
                    <AnimatePresence>
                        {sounds.map((sound) => (
                            <motion.div
                                key={sound.id}
                                className={`sound-card ${currentSound === sound.name ? 'playing' : ''}`}
                                style={{
                                    backgroundImage: `url(${sound.images.waveform_m})`
                                }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <div className="sound-overlay" />
                                <div className="sound-content">
                                    <h3 className="sound-title">{sound.name}</h3>
                                    <p className="sound-location">By {sound.username}</p>
                                    <div className="sound-controls">
                                        <button
                                            className="play-button"
                                            onClick={() => handleSoundPlay(sound)}
                                        >
                                            {currentSound === sound.name && isPlaying ? 
                                                <FaPause /> : <FaPlay />}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

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
