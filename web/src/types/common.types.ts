export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface TableColumn<T = unknown> {
  key: string;
  title: string;
  dataIndex: keyof T;
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: unknown, record: T, index: number) => React.ReactNode;
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
  type:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'select'
    | 'textarea'
    | 'checkbox'
    | 'radio'
    | 'date'
    | 'file';
  required?: boolean;
  placeholder?: string;
  options?: SelectOption[];
  validation?: {
    pattern?: RegExp;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    custom?: (value: unknown) => string | null;
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

// Alert Types
export interface Alert {
  id: number;
  type: 'warning' | 'info' | 'error' | 'success';
  message: string;
  time: string;
  timestamp: string;
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
  details?: unknown;
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
export interface NavItem {
  path: string;
  icon: React.ReactNode;
  label: string;
  subItems?: SubNavItem[];
}

export interface SubNavItem {
  path: string;
  icon: React.ReactNode;
  label: string;
}

// Dashboard Types
export interface DashboardProps {
  isDarkMode: boolean;
}

export interface FilterOptions {
  temperature: boolean;
  humidity: boolean;
  airQuality: boolean;
  alerts: boolean;
}

export interface VisibleCards {
  temperature: boolean;
  humidity: boolean;
  pressure: boolean;
  activities: boolean;
  quote: boolean;
  reminders: boolean;
  aqi: boolean;
  co2: boolean;
  pollutants: boolean;
}

export interface StatsData {
  readings: number;
  alerts: number;
  notifications: number;
  tasks: number;
}

export type ViewMode = 'grid' | 'list';
export type SortOption = 'newest' | 'oldest' | 'priority';
export type Timeframe = 'today' | 'week' | 'month' | 'quarter' | 'year';

export interface TimeframeData {
  id: Timeframe;
  label: string;
}

// Dashboard Controls Types
export interface DashboardControlsRef {
  focusSearch: () => void;
  toggleFilter: () => void;
  toggleSort: () => void;
}

export interface DashboardControlsProps {
  isDarkMode: boolean;
  onSearchChange?: (query: string) => void;
  onViewChange?: (view: ViewMode) => void;
  onFilterChange?: (filterType: string, isChecked: boolean) => void;
  onSortChange?: (sortType: SortOption) => void;
  onShowShortcuts?: () => void;
  filterOptions?: FilterOptions;
  sortOption?: SortOption;
  viewMode?: ViewMode;
}

// Data Types
export interface Quote {
  author: string;
  text: string;
}

// Pollution Data Types
export interface PollutionData {
  temperature: number;
  humidity: number;
  pressure: number;
  steps: number;
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  co2: number;
  gas: number;
}

// Memo/Reminder Types
export interface Memo {
  Id: number;
  id?: number;
  Text: string;
  text?: string;
  Done: boolean;
  done?: boolean;
  CreatedAt: string;
  createdAt?: string;
}

// Timeframe Types
export type CardId =
  | 'temperature'
  | 'humidity'
  | 'pressure'
  | 'activities'
  | 'quote'
  | 'reminders'
  | 'aqi'
  | 'co2'
  | 'pollutants';

// Keyboard Shortcuts Types
export interface KeyboardShortcut {
  key: string;
  description: string;
  withModifier: boolean;
}

// Theme Toggle Component Props
export interface ThemeToggleProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

// Common Auth Page Props
export interface AuthPageProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

// Form Hook Return Types
export interface ForgotPasswordFormHook {
  email: string;
  setEmail: (email: string) => void;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export interface OTPVerificationFormHook {
  otp: string[];
  setOtp: (otp: string[]) => void;
  error: string;
  isLoading: boolean;
  timeLeft: number;
  handleResendOTP: () => Promise<void>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export interface ResetPasswordFormHook {
  formData: {
    newPassword: string;
    confirmPassword: string;
  };
  passwordError: string;
  isLoading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export interface LoginFormHook {
  formData: {
    email: string;
    password: string;
  };
  isLoading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleGoogleLogin: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
}

export interface SignUpFormHook {
  formData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  errors: Record<string, string>;
  isLoading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleGoogleLogin: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
}

export interface UserData {
  id: string;
  userName?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  preferences?: Record<string, unknown>;
  createdAt?: string;
  lastLoginAt?: string;
}

// useUserData Hook Return Type
export interface UseUserDataReturn {
  profilePhotoUrl: string | null;
  getDisplayName: () => string;
  uploadPhoto?: (file: File) => Promise<{ previewUrl: string; cloudinaryUrl: string }>;
}
