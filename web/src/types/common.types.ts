// Common UI Types
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface TableColumn<T = any> {
  key: string;
  title: string;
  dataIndex: keyof T;
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, record: T, index: number) => React.ReactNode;
}

export interface PaginationConfig {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
}

// Theme Types
export interface ThemeConfig {
  isDarkMode: boolean;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'date' | 'file';
  required?: boolean;
  placeholder?: string;
  options?: SelectOption[];
  validation?: {
    pattern?: RegExp;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    custom?: (value: any) => string | null;
  };
}

export interface FormErrors {
  [key: string]: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  variant?: 'primary' | 'secondary';
}

// Location Types
export interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  heading?: number;
  speed?: number;
  timestamp: string;
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  formatted?: string;
}

// Audio Types
export interface AudioTrack {
  id: string;
  title: string;
  artist?: string;
  duration: number;
  url: string;
  thumbnail?: string;
  category: 'meditation' | 'nature' | 'focus' | 'sleep';
  isFavorite: boolean;
}

export interface AudioContextType {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  playlist: AudioTrack[];
  repeatMode: 'off' | 'one' | 'all';
  shuffleMode: boolean;
  play: (track?: AudioTrack) => void;
  pause: () => void;
  stop: () => void;
  next: () => void;
  previous: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  addToPlaylist: (track: AudioTrack) => void;
  removeFromPlaylist: (trackId: string) => void;
}

// Chart/Analytics Types
export interface ChartDataPoint {
  x: string | number;
  y: number;
  label?: string;
  color?: string;
}

export interface ChartSeries {
  name: string;
  data: ChartDataPoint[];
  color?: string;
  type?: 'line' | 'bar' | 'area' | 'scatter';
}

export interface ChartConfig {
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  showLegend?: boolean;
  showGrid?: boolean;
  height?: number;
  responsive?: boolean;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
  stack?: string;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  isDarkMode?: boolean;
}

export interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

// Navigation and User Data Types
export interface NavigationItem {
  path: string;
  icon: React.ReactElement;
  label: string;
}

export interface UserData {
  userName?: string;
  email?: string;
}

export interface UseUserDataReturn {
  userData: UserData | null;
  profilePhotoUrl: string | null;
  isLoading: boolean;
  error: string | null;
  getDisplayName: () => string;
}
