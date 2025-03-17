import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaPause, FaVolumeUp, FaMusic, FaSpinner, FaStar, FaTree, FaYinYang, FaCloudRain, FaWater, FaLeaf, FaSpaceShuttle, FaBell, FaGuitar } from 'react-icons/fa';
import { LuBrainCircuit } from "react-icons/lu";
import { searchSounds, getProxiedAudioUrl } from '../../services/freesoundService';
import SoundFilters from './SoundFilters';
import { debounce } from 'lodash';
import categoryBackgrounds from './SoundBackgrounds';

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
    const [filters, setFilters] = useState({});
    const [hasMore, setHasMore] = useState(true);

    const categories = {
        nature: { label: 'Forest & Nature', icon: <FaTree /> },
        meditation: { label: 'Tibetan Bowls', icon: <FaYinYang /> },
        rain: { label: 'Gentle Rain', icon: <FaCloudRain /> },
        ocean: { label: 'Ocean Waves', icon: <FaWater /> },
        forest: { label: 'Forest Ambience', icon: <FaLeaf /> },
        space: { label: 'Space Ambience', icon: <FaSpaceShuttle /> },
        bowls: { label: 'Crystal Bowls', icon: <FaBell /> },
        binaural: { label: 'Binaural Beats', icon: <LuBrainCircuit /> },
        flute: { label: 'Native Flute', icon: <FaGuitar /> }
    };

    const fetchSounds = useCallback(
        debounce(async (resetPage = false) => {
            if (resetPage) setPage(1);
            setLoading(true);
            try {
                const data = await searchSounds(
                    activeCategory, 
                    resetPage ? 1 : page,
                    filters
                );
                setSounds(prev => resetPage ? data.results : [...prev, ...data.results]);
                setHasMore(data.next !== null);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        }, 500),
        [activeCategory, page, filters]
    );

    useEffect(() => {
        fetchSounds(true);
    }, [activeCategory, filters]);

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
                try {
                    const proxiedUrl = await getProxiedAudioUrl(sound.previews['preview-hq-mp3']);
                    audioRef.current.src = proxiedUrl;
                    audioRef.current.load();
                    await audioRef.current.play();
                    setCurrentSound(sound.name);
                    setIsPlaying(true);
                } catch (error) {
                    console.error('Error playing audio:', error);
                }
            }
        }
    };

    const getBackgroundStyle = (sound) => {
        const bg = categoryBackgrounds[activeCategory] || categoryBackgrounds.nature;
        return {
            backgroundImage: `${bg.gradient}, url(${bg.image}?auto=format&fit=crop&w=600&q=80)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        };
    };

    return (
        <motion.div className={`sounds-section ${isDarkMode ? 'dark' : ''}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h2>Mindful Soundscapes</h2>
            
            <div className="sound-categories">
                {Object.entries(categories).map(([key, { label, icon }]) => (
                    <motion.button
                        key={key}
                        className={`category-btn ${activeCategory === key ? 'active' : ''}`}
                        onClick={() => {
                            setActiveCategory(key);
                            setPage(1);
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="category-icon">{icon}</span>
                        {label}
                    </motion.button>
                ))}
            </div>

            <SoundFilters
                filters={filters}
                setFilters={setFilters}
                onSearch={() => fetchSounds(true)}
                isDarkMode={isDarkMode}
            />

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
                                style={getBackgroundStyle(sound)}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <div className="sound-overlay" />
                                <div className="sound-content">
                                    <div className="sound-rating">
                                        <FaStar className="text-yellow-400" />
                                        <span>{sound.avg_rating?.toFixed(1) || '4.0'}</span>
                                    </div>
                                    <h3 className="sound-title">{sound.name}</h3>
                                    <p className="sound-duration">
                                        {Math.floor(sound.duration)}s
                                    </p>
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
