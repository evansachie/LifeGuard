import { useEffect, useState } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import 'intro.js/introjs.css';

import { AuthProvider } from './contexts/AuthContext';
import { BLEProvider } from './contexts/BLEContext';
import { AudioContextProvider } from './contexts/AudioContext';
import { AudioPlayerProvider } from './contexts/AudioPlayerContext';
import { FirebaseProvider } from './contexts/FirebaseContext';
import { EmergencyPreferenceProvider } from './contexts/EmergencyPreferenceContext';

import FloatingAudioPlayer from './components/Audio/FloatingAudioPlayer';
import { CommandPalette } from './components/CommandPalette/CommandPalette';
import VoiceCommandsButton from './components/VoiceCommands/VoiceCommandsButton';
import AppRoutes from './routes/AppRoutes';
import { useTheme } from './hooks/useTheme';

import './App.css';
import { isAuthenticated } from './utils/auth';

const App = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
    document.documentElement.classList.toggle('dark-mode', isDarkMode);
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    const down = (e: KeyboardEvent): void => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen((open) => !open);
      }
      if (e.key === 'Escape' && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [commandPaletteOpen]);

  const VoiceCommandsWrapper = ({ isDarkMode }: { isDarkMode: boolean }) => {
    const location = useLocation();
    if (location.pathname === '/' || !isAuthenticated()) {
      return null;
    }
    return (
      <VoiceCommandsButton isDarkMode={isDarkMode} className="!fixed !top-16 !right-4 !z-50" />
    );
  };

  return (
    <Router>
      <FirebaseProvider>
        <AudioPlayerProvider>
          <AudioContextProvider>
            <BLEProvider>
              <AuthProvider>
                <EmergencyPreferenceProvider>
                  <div className={isDarkMode ? 'dark-mode' : ''}>
                    <ToastContainer position="top-right" theme={isDarkMode ? 'dark' : 'light'} />
                    <AppRoutes isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                    <FloatingAudioPlayer isDarkMode={isDarkMode} />
                    <VoiceCommandsWrapper isDarkMode={isDarkMode} />
                    <CommandPalette
                      isDarkMode={isDarkMode}
                      toggleTheme={toggleTheme}
                      open={commandPaletteOpen}
                      setOpen={setCommandPaletteOpen}
                    />
                  </div>
                </EmergencyPreferenceProvider>
              </AuthProvider>
            </BLEProvider>
          </AudioContextProvider>
        </AudioPlayerProvider>
      </FirebaseProvider>
    </Router>
  );
};

export default App;
