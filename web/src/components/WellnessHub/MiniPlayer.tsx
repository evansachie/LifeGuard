import React from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaPause, FaTimes } from 'react-icons/fa';
import { Sound } from '../../types/wellnessHub.types';

interface MiniPlayerProps {
  sound: Sound;
  isPlaying: boolean;
  onPlayPause: () => void;
  onClose: () => void;
}

const MiniPlayer: React.FC<MiniPlayerProps> = ({ sound, isPlaying, onPlayPause, onClose }) => (
  <motion.div
    className="mini-player"
    initial={{ x: 100, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: 100, opacity: 0 }}
  >
    <div className="mini-player-content">
      <img
        src={`/images/sounds/${sound.imageName || 'default'}.jpg`}
        alt={sound.name || 'Sound'}
        className="mini-player-image"
      />
      <div className="mini-player-info">
        <h4>{sound.name}</h4>
        <p>{sound.location || 'Unknown location'}</p>
      </div>
      <div className="mini-player-controls">
        <button 
          onClick={onPlayPause}
          aria-label={isPlaying ? 'Pause sound' : 'Play sound'}
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <button 
          onClick={onClose}
          aria-label="Close player"
        >
          <FaTimes />
        </button>
      </div>
    </div>
  </motion.div>
);

export default MiniPlayer;
