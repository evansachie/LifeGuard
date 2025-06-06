import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaSpinner,
  FaStar,
  FaTree,
  FaYinYang,
  FaCloudRain,
  FaWater,
  FaLeaf,
  FaSpaceShuttle,
  FaBell,
  FaGuitar,
  FaKeyboard,
  FaExpand,
  FaCompress,
  FaHeart,
} from 'react-icons/fa';
import { LuBrainCircuit } from 'react-icons/lu';
import { searchSounds, getProxiedAudioUrl } from '../../services/freesoundService';
import SoundFilters from './SoundFilters';
import { debounce } from 'lodash';
import getBackgroundStyle from '../../utils/getBackgroundStyle';
import KeyboardShortcuts from './KeyboardShortcuts';
import { useAudioPlayer } from '../../contexts/AudioPlayerContext';
import {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
} from '../../services/favoriteSoundsService';
import { toast } from 'react-toastify';
import NoMusicIcon from '../../assets/no-music.svg';
import AccessibleDropdown from '../AccessibleDropdown/AccessibleDropdown';
import {
  Sound,
  FavoriteSound,
  SearchFilters,
  AudioPlayerContextType,
} from '../../types/wellnessHub.types';

interface SoundsSectionProps {
  isDarkMode: boolean;
}

interface Category {
  label: string;
  icon: React.ReactNode;
}

interface Categories {
  [key: string]: Category;
}

const SoundsSection: React.FC<SoundsSectionProps> = ({ isDarkMode }) => {
  const { currentSound, setCurrentSound, isPlaying, setIsPlaying, volume, setVolume, audioRef } =
    useAudioPlayer() as AudioPlayerContextType;
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>('nature');
  const [page, setPage] = useState<number>(1);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [, setHasMore] = useState<boolean>(true);
  const [showShortcuts, setShowShortcuts] = useState<boolean>(false);
  const [prevVolume, setPrevVolume] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<FavoriteSound[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  const userId = localStorage.getItem('userId');

  const categories: Categories = useMemo(
    () => ({
      nature: { label: 'Forest & Nature', icon: <FaTree /> },
      meditation: { label: 'Tibetan Bowls', icon: <FaYinYang /> },
      rain: { label: 'Gentle Rain', icon: <FaCloudRain /> },
      ocean: { label: 'Ocean Waves', icon: <FaWater /> },
      forest: { label: 'Forest Ambience', icon: <FaLeaf /> },
      space: { label: 'Space Ambience', icon: <FaSpaceShuttle /> },
      bowls: { label: 'Crystal Bowls', icon: <FaBell /> },
      binaural: { label: 'Binaural Beats', icon: <LuBrainCircuit /> },
      flute: { label: 'Native Flute', icon: <FaGuitar /> },
    }),
    []
  );

  const loadFavorites = useCallback(async (): Promise<void> => {
    if (!userId) return;

    try {
      const userFavorites = await getFavorites(userId);

      // The getFavorites function now returns properly mapped FavoriteSound objects
      // Filter out any favorites that don't have required fields
      const convertedFavorites: FavoriteSound[] = userFavorites.filter(
        (fav) => fav.sound_id && fav.name
      );

      setFavorites(convertedFavorites);

      if (showFavoritesOnly) {
        const favoriteIds = convertedFavorites.map((fav) => fav.sound_id);
        setSounds((prevSounds) =>
          prevSounds.filter((sound) => favoriteIds.includes(String(sound.id)))
        );
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      toast.error('Failed to load favorites');
    }
  }, [userId, showFavoritesOnly]);

  useEffect(() => {
    if (userId) {
      loadFavorites();
    }
  }, [userId, loadFavorites]);

  const fetchSounds = useCallback(
    async (resetPage = false): Promise<void> => {
      if (resetPage) setPage(1);
      setLoading(true);
      try {
        const data = await searchSounds(activeCategory, resetPage ? 1 : page, filters);
        setSounds((prev) => (resetPage ? data.results : [...prev, ...data.results]));
        setHasMore(data.next !== null);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    },
    [activeCategory, page, filters]
  );

  const debouncedFetchSounds = useCallback(
    debounce((resetPage: boolean) => {
      fetchSounds(resetPage);
    }, 500),
    [fetchSounds]
  );

  useEffect(() => {
    if (showFavoritesOnly) {
      const favoriteIds = favorites.map((fav) => fav.sound_id);
      setSounds((prev) => prev.filter((sound) => favoriteIds.includes(String(sound.id))));
    } else {
      debouncedFetchSounds(true);
    }
  }, [showFavoritesOnly, favorites, debouncedFetchSounds]);

  useEffect(() => {
    debouncedFetchSounds(true);
  }, [activeCategory, filters, debouncedFetchSounds]);

  const handleToggleFavorite = async (sound: Sound): Promise<void> => {
    if (!userId) {
      toast.error('Please login to favorite sounds');
      return;
    }

    try {
      const isFavorite = favorites.some((fav) => fav.sound_id === String(sound.id));

      if (isFavorite) {
        // Remove from favorites
        await removeFromFavorites(userId, String(sound.id));
        setFavorites((prev) => prev.filter((fav) => fav.sound_id !== String(sound.id)));
        toast.success('Removed from favorites');
      } else {
        // Add to favorites
        const result = await addToFavorites(userId, sound);

        if ('error' in result) {
          if (result.error === 'Already favorited') {
            // Handle the case where backend says it's already favorited but UI doesn't show it
            const favSound: FavoriteSound = {
              sound_id: String(sound.id),
              name: sound.name,
              url: sound.url || (sound.previews && sound.previews['preview-hq-mp3']) || '',
            };

            setFavorites((prev) => {
              const exists = prev.some((fav) => fav.sound_id === String(sound.id));
              if (!exists) {
                return [...prev, favSound];
              }
              return prev;
            });

            toast.success('Added to favorites');
          } else {
            const errorMessage = result.message || result.error || 'Error adding to favorites';
            toast.error(errorMessage);
          }
        } else {
          // Handle successful add
          const newFavorite: FavoriteSound = {
            sound_id: String(sound.id),
            name: sound.name,
            url: sound.url || (sound.previews && sound.previews['preview-hq-mp3']) || '',
          };

          setFavorites((prev) => [...prev, newFavorite]);
          toast.success('Added to favorites');
        }
      }
    } catch (error: any) {
      console.error('Unexpected error in handleToggleFavorite:', error);

      if (error?.status === 409) {
        // Handle 409 conflicts - the sound is already favorited on the backend
        const favSound: FavoriteSound = {
          sound_id: String(sound.id),
          name: sound.name,
          url: sound.url || (sound.previews && sound.previews['preview-hq-mp3']) || '',
        };

        setFavorites((prev) => {
          const exists = prev.some((fav) => fav.sound_id === String(sound.id));
          if (!exists) {
            return [...prev, favSound];
          }
          return prev;
        });

        toast.success('Added to favorites');
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  const toggleFullscreen = (): void => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => {
          setIsFullscreen(true);
        })
        .catch((err) => {
          console.error('Error attempting to enable fullscreen:', err);
        });
    } else {
      if (document.exitFullscreen) {
        document
          .exitFullscreen()
          .then(() => {
            setIsFullscreen(false);
          })
          .catch((err) => {
            console.error('Error attempting to exit fullscreen:', err);
          });
      }
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent): void => {
      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          setIsPlaying((prev) => !prev);
          break;
        case 'arrowleft': {
          const categoryKeys = Object.keys(categories);
          const currentIndex = categoryKeys.indexOf(activeCategory);
          if (currentIndex > 0) {
            setActiveCategory(categoryKeys[currentIndex - 1]);
          }
          break;
        }
        case 'arrowright': {
          const categoryKeys = Object.keys(categories);
          const nextIndex = categoryKeys.indexOf(activeCategory) + 1;
          if (nextIndex < categoryKeys.length) {
            setActiveCategory(categoryKeys[nextIndex]);
          }
          break;
        }
        case 'arrowup':
          setVolume((prev) => Math.min(1, prev + 0.1));
          break;
        case 'arrowdown':
          setVolume((prev) => Math.max(0, prev - 0.1));
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
          setShowShortcuts((prev) => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [activeCategory, volume, isPlaying, setIsPlaying, setVolume, prevVolume, categories]);

  const handleSoundPlay = async (sound: Sound): Promise<void> => {
    if (audioRef.current) {
      if (currentSound === sound.name) {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          try {
            await audioRef.current.play();
            setIsPlaying(true);
          } catch (error) {
            console.error('Error playing audio:', error);
          }
        }
      } else {
        try {
          const previewUrl = sound.previews && sound.previews['preview-hq-mp3'];
          if (!previewUrl) {
            toast.error('No preview available for this sound');
            return;
          }

          const proxiedUrl = await getProxiedAudioUrl(previewUrl);
          audioRef.current.src = proxiedUrl;
          audioRef.current.load();
          await audioRef.current.play();
          setCurrentSound(sound.name);
          setIsPlaying(true);
        } catch (error) {
          console.error('Error playing audio:', error);
          toast.error('Failed to play audio. Please try again.');
        }
      }
    }
  };

  useEffect(() => {
    if (showFavoritesOnly) {
      const favoriteIds = favorites.map((fav) => fav.sound_id);
      setSounds((prev) => prev.filter((sound) => favoriteIds.includes(String(sound.id))));
    } else {
      debouncedFetchSounds(true);
    }
  }, [showFavoritesOnly, favorites, debouncedFetchSounds]);

  useEffect(() => {
    if (userId) {
      const timer = setTimeout(() => {
        loadFavorites();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [activeCategory, userId]);

  const renderContent = (): React.ReactNode => {
    if (loading) {
      return (
        <div className="loading-container">
          <FaSpinner className="spinner" />
          <p>Loading sounds...</p>
        </div>
      );
    }

    const filteredSounds = sounds.filter(
      (sound) => !showFavoritesOnly || favorites.some((fav) => fav.sound_id === sound.id.toString())
    );

    if (filteredSounds.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <img src={NoMusicIcon} alt="No Music Icon" className="w-64 h-64" />
          <h3
            className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}
          >
            {showFavoritesOnly ? 'No favorite sounds yet' : 'No sounds found for this category'}
          </h3>
          <p className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {showFavoritesOnly
              ? 'Start adding some sounds to your favorites!'
              : 'Try adjusting your filters or try another category'}
          </p>
        </div>
      );
    }

    return (
      <div className="sounds-grid">
        <AnimatePresence>
          {filteredSounds.map((sound) => {
            // Check if this sound is favorited
            const isFavorited = favorites.some((fav) => fav.sound_id === sound.id.toString());

            return (
              <motion.div
                key={sound.id}
                className={`sound-card ${currentSound === sound.name ? 'playing' : ''}`}
                style={getBackgroundStyle(sound, activeCategory as any)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ scale: 1.02 }}
                tabIndex={0}
                role="button"
                aria-label={`Play ${sound.name}`}
              >
                <div className="sound-overlay" />
                <div className="sound-content">
                  <div className="sound-rating">
                    <FaStar className="text-yellow-400" />
                    <span>{sound.avg_rating?.toFixed(1) || '4.0'}</span>
                  </div>
                  <h3 className="sound-title">{sound.name}</h3>
                  <p className="sound-duration">
                    {Math.floor(
                      typeof sound.duration === 'string'
                        ? parseFloat(sound.duration)
                        : sound.duration
                    )}
                    s
                  </p>
                  <div className="sound-controls">
                    <AccessibleDropdown
                      isOpen={currentSound === sound.name && isPlaying}
                      onToggle={() => handleSoundPlay(sound)}
                      ariaLabel={
                        currentSound === sound.name && isPlaying ? 'Pause sound' : 'Play sound'
                      }
                      className="play-button"
                    >
                      {currentSound === sound.name && isPlaying ? <FaPause /> : <FaPlay />}
                    </AccessibleDropdown>

                    <AccessibleDropdown
                      isOpen={isFavorited}
                      onToggle={() => handleToggleFavorite(sound)}
                      ariaLabel={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                      className={`favorite-button ${
                        isFavorited
                          ? 'active bg-red-500 border-red-500 hover:bg-red-600'
                          : 'bg-gray-600/50 border-gray-500 hover:bg-gray-500/60'
                      } transition-all duration-200`}
                    >
                      <FaHeart className={isFavorited ? 'text-white' : 'text-gray-300'} />
                    </AccessibleDropdown>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <motion.div
      className={`sounds-section ${isDarkMode ? 'dark' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h2>Mindful Soundscapes</h2>

      <div className="sound-categories">
        <AccessibleDropdown
          isOpen={showFavoritesOnly}
          onToggle={() => setShowFavoritesOnly((prev) => !prev)}
          ariaLabel={showFavoritesOnly ? 'Hide favorites' : 'Show favorites only'}
          className={`category-btn ${showFavoritesOnly ? 'active' : ''}`}
        >
          <FaHeart />
          Favorites
        </AccessibleDropdown>

        {Object.entries(categories).map(([key, { label, icon }]) => (
          <AccessibleDropdown
            key={key}
            isOpen={activeCategory === key}
            onToggle={() => setActiveCategory(key)}
            ariaLabel={`Select ${label} category`}
            className={`category-btn ${activeCategory === key ? 'active' : ''}`}
          >
            {icon}
            <span>{label}</span>
          </AccessibleDropdown>
        ))}
      </div>

      <SoundFilters
        filters={filters}
        setFilters={setFilters}
        onSearch={() => debouncedFetchSounds(true)}
        isDarkMode={isDarkMode}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavorites={() => setShowFavoritesOnly((prev) => !prev)}
      />

      {renderContent()}

      {currentSound && (
        <motion.div
          className="volume-control"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="volume-slider">
            <FaVolumeUp />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setVolume(parseFloat(e.target.value));
              }}
              aria-label="Volume control"
            />
          </div>
        </motion.div>
      )}

      <div className="fixed bottom-4 right-4 space-x-2">
        <AccessibleDropdown
          isOpen={false}
          onToggle={() => setShowShortcuts(true)}
          ariaLabel="Show keyboard shortcuts"
          className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
        >
          <FaKeyboard />
        </AccessibleDropdown>

        <AccessibleDropdown
          isOpen={isFullscreen}
          onToggle={toggleFullscreen}
          ariaLabel={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
        >
          {isFullscreen ? <FaCompress /> : <FaExpand />}
        </AccessibleDropdown>
      </div>

      <KeyboardShortcuts isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </motion.div>
  );
};

export default SoundsSection;
