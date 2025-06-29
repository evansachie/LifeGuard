import { ReactNode } from 'react';

// Audio Visualizer Types
export interface AudioVisualizerProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  isDarkMode: boolean;
}

// Audio Context Type
export interface AudioContextType {
  setupAudioContext: (audioElement: HTMLAudioElement) => AnalyserNode;
}

// General wellness types
export type WellnessSection = 'breathing' | 'meditation' | 'sounds';

// Sound-related types
export interface Sound {
  id: string | number;
  name: string;
  description?: string;
  tags?: string[];
  duration: number;
  url?: string;
  waveformUrl?: string;
  previews?: {
    [key: string]: string;
  };
  avg_rating?: number;
  imageUrl?: string;
  imageAlt?: string;
  imageName?: string;
  location?: string;
  type?: string;
}

export interface FavoriteSound {
  sound_id: string;
  name: string;
  url: string;
}

export interface FavoriteResponse {
  soundId: string;
  id?: string;
  userId: string;
  url: string;
  name: string;
  createdAt: string;
}

export interface CategoryBackground {
  image: string;
  gradient: string;
}

export interface CategoryBackgrounds {
  [key: string]: CategoryBackground;
}

// Search filters
export interface SearchFilters {
  tags?: string;
  duration?: string;
  rating?: string;
  [key: string]: string | undefined;
}

// Service return types
export interface SearchResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Sound[];
}

// Meditation types
export interface MeditationPreset {
  time: number;
  label: string;
  icon: ReactNode;
}

// Breathing types
export interface BreathingPattern {
  id: string;
  name: string;
  description: string;
  pattern: {
    inhale: number;
    hold1?: number;
    exhale: number;
    hold2?: number;
  };
  icon: ReactNode;
  color: string;
}

// Sound filter types
export interface SoundFiltersProps {
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  onSearch: () => void;
  isDarkMode: boolean;
  showFavoritesOnly?: boolean;
  onToggleFavorites?: () => void;
}

// Keyboard shortcuts types
export interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

// Audio Player Context Types
export interface AudioPlayerContextType {
  currentSound: string | null;
  setCurrentSound: React.Dispatch<React.SetStateAction<string | null>>;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  volume: number;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
  audioRef: React.RefObject<HTMLAudioElement>;
}
