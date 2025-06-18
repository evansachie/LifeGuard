import { API_BASE_URL, FRONTEND_URL, API_ENDPOINTS, fetchWithAuth, apiMethods } from './api';
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
  try {
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
  } catch (error) {
    console.error('Login error:', error);

    // Provide more helpful error messages for timeout issues
    if (error instanceof Error && error.message.includes('timed out')) {
      throw new Error(
        'Login is taking longer than usual. The server may be starting up, please try again.'
      );
    }

    throw error;
  }
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
    console.error('Registration error:', error);

    // Provide more helpful error messages for timeout issues
    if (error instanceof Error && error.message.includes('timed out')) {
      throw new Error(
        'Registration is taking longer than usual. The server may be starting up, please try again.'
      );
    }

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
    console.log('🔄 Initiating Google login with returnUrl:', FRONTEND_URL);

    // Build the complete backend URL for Google login
    const googleLoginUrl = `${API_BASE_URL}${API_ENDPOINTS.GOOGLE_LOGIN}?returnUrl=${encodeURIComponent(FRONTEND_URL)}`;

    // This will create: https://lifeguard-hiij.onrender.com/api/Account/google-login?returnUrl=http://localhost:3000
    console.log('🔗 Redirecting to backend Google login URL:', googleLoginUrl);

    // Show a loading message for slow connections
    const toastId = setTimeout(() => {
      console.log('⏳ Google login is taking longer than usual, please wait...');
    }, 3000);

    // Redirect to backend Google login endpoint with returnUrl
    window.location.href = googleLoginUrl;

    // Clear the timeout if redirect happens quickly
    clearTimeout(toastId);
  } catch (error) {
    console.error('❌ Error initiating Google login:', error);
    throw error;
  }
};

export const handleGoogleCallback = async (): Promise<{
  token: string;
  userId: string;
  email: string;
  userName: string;
}> => {
  try {
    // Extract authentication data from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userId = urlParams.get('userId');
    const email = urlParams.get('email');
    const userName = urlParams.get('userName');

    if (!token || !userId || !email || !userName) {
      throw new Error('Missing authentication data in callback URL');
    }

    console.log('✅ Google callback data received:', {
      userId,
      email,
      userName,
      hasToken: !!token,
    });

    // Store authentication data in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('email', email);
    localStorage.setItem('userName', userName);

    // Clean up URL parameters
    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);

    return {
      token,
      userId,
      email,
      userName,
    };
  } catch (error) {
    console.error('❌ Error handling Google callback:', error);
    throw error;
  }
};
