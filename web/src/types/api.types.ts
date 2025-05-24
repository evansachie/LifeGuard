// Core API Response Types
export interface ApiResponse<T = any> {
  isSuccess: boolean;
  statusCode: number;
  message?: string;
  requestId?: string;
  data?: T;
}

// Authentication Types
export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  id: string;
  userName: string;
  email: string;
  token: string;
  refreshToken?: string;
}

export interface RegistrationRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegistrationResponse {
  userId: string;
  emailVerified: boolean;
  message?: string;
  accountCreated: boolean;
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export interface ResendOTPRequest {
  email: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// User Profile Types
export interface UserProfile {
  userName: string;
  email: string;
  age?: number;
  gender?: string;
  weight?: number;
  height?: number;
  phoneNumber?: string;
  bio?: string;
  profileImage?: string;
}

export interface CompleteProfileRequest {
  email: string;
  age: number;
  gender: string;
  weight: number;
  height: number;
  phoneNumber: string;
  bio: string;
}

// Health Metrics Types
export interface HealthMetrics {
  id?: string;
  userId: string;
  heartRate?: number;
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  temperature?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
  bmi?: number;
  timestamp: string;
}

export interface HealthMetricsHistory {
  metrics: HealthMetrics[];
  totalCount: number;
  page: number;
  pageSize: number;
}
