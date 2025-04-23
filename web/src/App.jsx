import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'intro.js/introjs.css';

import { AuthProvider } from './contexts/AuthContext';
import { BLEProvider } from './contexts/BLEContext';
import { AudioContextProvider } from './contexts/AudioContext';
import { AudioPlayerProvider } from './contexts/AudioPlayerContext';

import FloatingAudioPlayer from './components/Audio/FloatingAudioPlayer';
import { CommandPalette } from './components/CommandPalette/CommandPalette';

import AppRoutes from './routes/AppRoutes';
import { useTheme } from './hooks/useTheme';

import './App.css';

function App() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Router>
      <AudioPlayerProvider>
        <AudioContextProvider>
          <BLEProvider>
            <AuthProvider>
              <div className={isDarkMode ? 'dark-mode' : ''}>
                <ToastContainer position="top-right" theme={isDarkMode ? 'dark' : 'light'} />
                <AppRoutes isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                <FloatingAudioPlayer isDarkMode={isDarkMode} />
                <CommandPalette isDarkMode={isDarkMode} />
              </div>
            </AuthProvider>
          </BLEProvider>
        </AudioContextProvider>
      </AudioPlayerProvider>
    </Router>
  );
}

export default App;
