import React from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaPause, FaTimes } from 'react-icons/fa';

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

export default MiniPlayer;
