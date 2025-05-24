import { UserProfile } from "./api.types";

export interface User {
  id: string;
  userName: string;
  email: string;
  profileImage?: string;
  isEmailVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  verifyOTP: (email: string, otp: string) => Promise<boolean>;
  resendOTP: (email: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (email: string, token: string, newPassword: string, confirmPassword: string) => Promise<boolean>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthError {
  message: string;
  field?: string;
  code?: string;
}
