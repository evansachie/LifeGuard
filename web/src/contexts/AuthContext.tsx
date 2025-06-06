import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-toastify';
import type { AuthContextType, User } from '../types/auth.types';
import type { UserProfile } from '../types/api.types';
import {
  loginUser as loginUserAPI,
  registerUser as registerUserAPI,
  verifyOTP as verifyOTPAPI,
  resendOTP as resendOTPAPI,
  requestPasswordReset as requestPasswordResetAPI,
  resetUserPassword as resetUserPasswordAPI,
  getUserById,
  handleGoogleCallback,
} from '../utils/auth';
import { apiMethods } from '../utils/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isAuthenticated = Boolean(user && token);

  useEffect(() => {
    const initializeAuth = async (): Promise<void> => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId');
        const storedUserName = localStorage.getItem('userName');

        if (storedToken && storedUserId) {
          setToken(storedToken);

          // Try to get user data from localStorage first
          if (storedUserName) {
            const userData: User = {
              id: storedUserId,
              userName: storedUserName,
              email: localStorage.getItem('email') || '',
              isEmailVerified: true, // Assume verified if logged in
              createdAt: new Date().toISOString(),
            };
            setUser(userData);
          } else {
            // Fallback: fetch user data from API
            try {
              const userData = await getUserById(storedUserId);
              const user: User = {
                id: storedUserId,
                userName: userData.userName,
                email: userData.email,
                isEmailVerified: true,
                createdAt: new Date().toISOString(),
              };
              setUser(user);
            } catch (error) {
              console.error('Failed to fetch user data:', error);
              // Clear invalid auth data
              localStorage.removeItem('token');
              localStorage.removeItem('userId');
              localStorage.removeItem('userName');
              setToken(null);
            }
          }
        }

        // Handle Google OAuth callback
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('token') && window.location.pathname === '/signin-google') {
          try {
            const googleData = await handleGoogleCallback();
            setToken(googleData.token);
            const userData: User = {
              id: googleData.userId,
              userName: googleData.userName,
              email: googleData.email,
              isEmailVerified: true,
              createdAt: new Date().toISOString(),
            };
            setUser(userData);

            // Redirect to dashboard after successful Google login
            window.history.replaceState({}, document.title, '/dashboard');
            toast.success('Successfully logged in with Google!');
          } catch (error) {
            console.error('Google login callback error:', error);
            toast.error('Failed to complete Google login');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      const authData = await loginUserAPI(email, password);

      setToken(authData.token);
      const userData: User = {
        id: authData.id,
        userName: authData.userName,
        email: authData.email,
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
      };
      setUser(userData);

      toast.success('Login successful!');
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await registerUserAPI(name, email, password);

      if (response.userId) {
        localStorage.setItem('userId', response.userId);

        if (response.emailVerified) {
          toast.success('Registration successful! Please verify your email.');
        } else {
          toast.info(
            response.message ||
              'Account created! You can now log in while email verification is pending.'
          );
        }
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    // Clear all auth data
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('email');

    setUser(null);
    setToken(null);

    toast.info('You have been logged out');

    // Redirect to home page
    window.location.href = '/';
  };

  const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await verifyOTPAPI(email, otp);

      if (response.isSuccess) {
        toast.success('Email verified successfully!');
        return true;
      } else {
        toast.error(response.message || 'OTP verification failed');
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.message || 'OTP verification failed';
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async (email: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await resendOTPAPI(email);

      if (response.isSuccess) {
        toast.success('OTP sent successfully!');
        return true;
      } else {
        toast.error(response.message || 'Failed to resend OTP');
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to resend OTP';
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await requestPasswordResetAPI(email);

      if (response.isSuccess) {
        toast.success('Password reset email sent successfully!');
        return true;
      } else {
        toast.error(response.message || 'Failed to send password reset email');
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to send password reset email';
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (
    email: string,
    token: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await resetUserPasswordAPI(email, token, newPassword, confirmPassword);

      if (response.isSuccess) {
        toast.success('Password reset successfully!');
        return true;
      } else {
        toast.error(response.message || 'Failed to reset password');
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to reset password';
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData: Partial<UserProfile>): Promise<void> => {
    try {
      setIsLoading(true);
      await apiMethods.updateUserProfile(profileData);

      // Update user state if userName changed
      if (profileData.userName && user) {
        setUser({ ...user, userName: profileData.userName });
        localStorage.setItem('userName', profileData.userName);
      }

      toast.success('Profile updated successfully!');
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update profile';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    verifyOTP,
    resendOTP,
    forgotPassword,
    resetPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
