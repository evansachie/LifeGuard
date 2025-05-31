import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaPause, FaStar, FaInfoCircle } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import { Sound } from '../../types/wellnessHub.types';

interface SoundCardProps {
  sound: Sound;
  isPlaying: boolean;
  onPlay: (sound: Sound) => void;
  background: React.CSSProperties;
}

const SoundCard: React.FC<SoundCardProps> = ({ sound, isPlaying, onPlay, background }) => {
  const [showInfo, setShowInfo] = useState<boolean>(false);

  return (
    <motion.div
      className={`sound-card ${isPlaying ? 'playing' : ''}`}
      style={background}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      onKeyPress={(e: React.KeyboardEvent) => e.key === 'Enter' && onPlay(sound)}
      tabIndex={0}
      role="button"
      aria-label={`Play ${sound.name}`}
    >
      <div className="sound-overlay" />
      <div className="sound-content">
        <div className="sound-rating" data-tooltip-id={`rating-${sound.id}`}>
          <FaStar className="text-yellow-400" />
          <span>{sound.avg_rating?.toFixed(1) || '4.0'}</span>
        </div>
        <Tooltip id={`rating-${sound.id}`} place="top">
          Average user rating
        </Tooltip>

        <h3 className="sound-title">{sound.name}</h3>
        <p className="sound-duration">{Math.floor(sound.duration)}s</p>

        <div className="sound-controls">
          <motion.button
            className="play-button"
            onClick={() => onPlay(sound)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </motion.button>

          <button
            className="info-button"
            onClick={() => setShowInfo(!showInfo)}
            data-tooltip-id={`info-${sound.id}`}
          >
            <FaInfoCircle />
          </button>
        </div>

        {showInfo && (
          <motion.div
            className="sound-info"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p>{sound.description}</p>
            <div className="tags">
              {sound.tags?.slice(0, 3).map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default SoundCard;
