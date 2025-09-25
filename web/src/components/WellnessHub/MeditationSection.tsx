import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaPause, FaRedo } from 'react-icons/fa';
import { meditationPresets } from '../../data/meditationPresets';
import { formatTime } from '../../utils/formatTime';
import { MeditationPreset } from '../../types/wellnessHub.types';

interface MeditationSectionProps {
  isDarkMode?: boolean;
}

const MeditationSection = ({ isDarkMode }: MeditationSectionProps) => {
  const [meditationTime, setMeditationTime] = useState<number>(600);
  const [currentTime, setCurrentTime] = useState<number>(600);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  // Clear interval on component unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const toggleTimer = (): void => {
    if (isTimerRunning) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    } else {
      timerRef.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (prev <= 1) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = (): void => {
    setCurrentTime(meditationTime);
    if (isTimerRunning) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setIsTimerRunning(false);
    }
  };

  const selectPreset = (preset: MeditationPreset): void => {
    setMeditationTime(preset.time);
    setCurrentTime(preset.time);
    if (isTimerRunning) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setIsTimerRunning(false);
    }
  };

  return (
    <motion.div
      className={`meditation-section ${isDarkMode ? 'dark' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2>Meditation Timer</h2>
      <div className="timer-display">
        <div className="time">{formatTime(currentTime)}</div>
        <div className="timer-controls">
          <button
            onClick={toggleTimer}
            aria-label={isTimerRunning ? 'Pause meditation timer' : 'Start meditation timer'}
            className={isDarkMode ? 'dark' : ''}
          >
            {isTimerRunning ? <FaPause /> : <FaPlay />}
          </button>
          <button
            onClick={resetTimer}
            aria-label="Reset meditation timer"
            className={isDarkMode ? 'dark' : ''}
          >
            <FaRedo />
          </button>
        </div>
      </div>
      <div className="meditation-presets">
        {meditationPresets.map((preset) => (
          <button
            key={preset.time}
            className={`preset-button ${meditationTime === preset.time ? 'active' : ''} ${isDarkMode ? 'dark' : ''}`}
            onClick={() => selectPreset(preset)}
            aria-label={`Select ${preset.label} meditation preset`}
          >
            {preset.icon}
            <span>{preset.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default MeditationSection;
