import { API_BASE_URL, API_ENDPOINTS, fetchWithAuth, apiMethods } from './api';
import type { AuthResponse, RegistrationResponse, ApiResponse } from '../types/api.types';

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  return !!(token && userId);
};

export async function requestPasswordReset(email: string): Promise<ApiResponse<void>> {
  return apiMethods.forgotPassword({ email });
}

export async function resetUserPassword(
  email: string,
  token: string,
  newPassword: string,
  confirmPassword: string
): Promise<ApiResponse<void>> {
  const decodedToken = decodeURIComponent(token).replace(/ /g, '+');

  return apiMethods.resetPassword({
    email,
    token: decodedToken,
    newPassword,
    confirmPassword,
  });
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const response = await apiMethods.login({ email, password });

  if (!response.isSuccess || !response.data) {
    throw new Error(response.message || 'Login failed');
  }

  const { data } = response;

  if (!data.token || !data.id || !data.userName) {
    throw new Error('Invalid login response data');
  }

  localStorage.setItem('token', data.token);
  localStorage.setItem('userId', data.id);
  localStorage.setItem('userName', data.userName);

  return data;
}

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<RegistrationResponse> => {
  try {
    const response = await apiMethods.register({ name, email, password });

    if (response?.data?.userId) {
      return response.data;
    }
    throw new Error(response?.message || 'Registration failed');
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { userId?: string } } };
      if (axiosError.response?.data?.userId) {
        return axiosError.response.data as RegistrationResponse;
      }
    }
    throw error;
  }
};

export async function verifyOTP(email: string, otp: string): Promise<ApiResponse<void>> {
  return apiMethods.verifyOTP({ email, otp });
}

export async function resendOTP(email: string): Promise<ApiResponse<void>> {
  return apiMethods.resendOTP({ email });
}

export async function getUserById(id: string): Promise<{ userName: string; email: string }> {
  if (!id) {
    throw new Error('User ID is required');
  }

  const response = await fetchWithAuth<{ userName: string; email: string }>(
    API_ENDPOINTS.GET_USER(id)
  );

  return {
    userName: response.userName,
    email: response.email,
  };
}

export const initiateGoogleLogin = async (): Promise<void> => {
  try {
    const returnUrl = `${window.location.origin}/signin-google`;
    const googleLoginUrl = `${API_BASE_URL}${API_ENDPOINTS.GOOGLE_LOGIN}?returnUrl=${encodeURIComponent(returnUrl)}`;
    window.location.href = googleLoginUrl;
  } catch (error: any) {
    throw new Error('Failed to initiate Google login: ' + error.message);
  }
};

interface GoogleCallbackData {
  token: string;
  userId: string;
  email: string;
  userName: string;
}

export const handleGoogleCallback = async (): Promise<GoogleCallbackData> => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userId = urlParams.get('userId');
    const email = urlParams.get('email');
    const userName = urlParams.get('userName');

    if (!token || !userId || !email) {
      throw new Error('Invalid authentication data received');
    }

    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('userName', userName || email);
    localStorage.setItem('email', email);

    return { token, userId, email, userName: userName || email };
  } catch (error) {
    console.error('Google auth callback error:', error);
    throw new Error('Failed to complete Google authentication');
  }
};
