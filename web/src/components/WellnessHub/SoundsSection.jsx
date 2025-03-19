import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaPause, FaVolumeUp, FaMusic, FaSpinner, FaStar, FaTree, FaYinYang, FaCloudRain, FaWater, FaLeaf, FaSpaceShuttle, FaBell, FaGuitar, FaKeyboard, FaExpand, FaCompress, FaHeart } from 'react-icons/fa';
import { LuBrainCircuit } from "react-icons/lu";
import { searchSounds, getProxiedAudioUrl } from '../../services/freesoundService';
import SoundFilters from './SoundFilters';
import { debounce } from 'lodash';
import categoryBackgrounds from './SoundBackgrounds';
import KeyboardShortcuts from './KeyboardShortcuts';
import { useAudioPlayer } from '../../contexts/AudioPlayerContext';
import { getFavorites, addToFavorites, removeFromFavorites } from '../../services/favoriteSoundsService';
import { toast } from 'react-toastify';

const SoundsSection = ({ isDarkMode }) => {
    const { currentSound, setCurrentSound, isPlaying, setIsPlaying, volume, setVolume, audioRef } = useAudioPlayer();
    const [sounds, setSounds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeCategory, setActiveCategory] = useState('nature');
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({});
    const [hasMore, setHasMore] = useState(true);
    const [showShortcuts, setShowShortcuts] = useState(false);
    const [prevVolume, setPrevVolume] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const userId = localStorage.getItem('userId');

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

    useEffect(() => {
        if (userId) {
            loadFavorites();
        }
    }, [userId]);

    const loadFavorites = async () => {
        try {
            const userFavorites = await getFavorites(userId);
            setFavorites(userFavorites);
        } catch (error) {
            console.error('Error loading favorites:', error);
        }
    };

    const handleToggleFavorite = async (sound) => {
        if (!userId) {
            toast.error('Please login to favorite sounds');
            return;
        }

        try {
            const isFavorite = favorites.some(fav => fav.sound_id === sound.id);
            
            if (isFavorite) {
                await removeFromFavorites(userId, sound.id);
                setFavorites(prev => prev.filter(fav => fav.sound_id !== sound.id));
                toast.success('Removed from favorites');
            } else {
                const newFavorite = await addToFavorites(userId, sound);
                setFavorites(prev => [...prev, newFavorite]);
                toast.success('Added to favorites');
            }
        } catch (error) {
            toast.error('Error updating favorites');
        }
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

    useEffect(() => {
        const handleKeyPress = (e) => {
            switch (e.key.toLowerCase()) {
                case ' ':
                    e.preventDefault();
                    setIsPlaying(prev => !prev);
                    break;
                case 'arrowleft':
                    const categories = Object.keys(categories);
                    const currentIndex = categories.indexOf(activeCategory);
                    if (currentIndex > 0) {
                        setActiveCategory(categories[currentIndex - 1]);
                    }
                    break;
                case 'arrowright':
                    const nextIndex = categories.indexOf(activeCategory) + 1;
                    if (nextIndex < categories.length) {
                        setActiveCategory(categories[nextIndex]);
                    }
                    break;
                case 'arrowup':
                    setVolume(prev => Math.min(1, prev + 0.1));
                    break;
                case 'arrowdown':
                    setVolume(prev => Math.max(0, prev - 0.1));
                    break;
                case 'm':
                    if (volume > 0) {
                        setPrevVolume(volume);
                        setVolume(0);
                    } else {
                        setVolume(prevVolume || 0.5);
                    }
                    break;
                case 'f':
                    toggleFullscreen();
                    break;
                case 'k':
                    setShowShortcuts(prev => !prev);
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [activeCategory, volume, isPlaying]);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

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
                <motion.button
                    className={`category-btn ${showFavoritesOnly ? 'active' : ''}`}
                    onClick={() => setShowFavoritesOnly(prev => !prev)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <span className="category-icon"><FaHeart /></span>
                    Favorites ({favorites.length})
                </motion.button>
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
                showFavoritesOnly={showFavoritesOnly}
                onToggleFavorites={() => setShowFavoritesOnly(prev => !prev)}
            />

            {loading ? (
                <div className="loading-container">
                    <FaSpinner className="spinner" />
                    <p>Loading sounds...</p>
                </div>
            ) : (
                <div className="sounds-grid">
                    <AnimatePresence>
                        {sounds
                            .filter(sound => !showFavoritesOnly || favorites.some(fav => fav.sound_id === sound.id))
                            .map((sound) => (
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
                                            <button
                                                className={`favorite-button ${favorites.some(fav => fav.sound_id === sound.id) ? 'active' : ''}`}
                                                onClick={() => handleToggleFavorite(sound)}
                                            >
                                                <FaHeart />
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
                    {/* <div className="now-playing">
                        <FaMusic className="music-icon" />
                        <span>Now Playing: {currentSound}</span>
                    </div> */}
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

            <div className="fixed bottom-4 right-4 space-x-2">
                <button
                    onClick={() => setShowShortcuts(true)}
                    className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                >
                    <FaKeyboard />
                </button>
                <button
                    onClick={toggleFullscreen}
                    className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                >
                    {isFullscreen ? <FaCompress /> : <FaExpand />}
                </button>
            </div>

            <KeyboardShortcuts 
                isOpen={showShortcuts} 
                onClose={() => setShowShortcuts(false)} 
            />
        </motion.div>
    );
};

export default SoundsSection;
