import { API_BASE_URL, API_ENDPOINTS, fetchApi, fetchWithAuth } from '../utils/api';

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  return !!(token && userId);
};

export async function requestPasswordReset(email) {
  return fetchApi(API_ENDPOINTS.FORGOT_PASSWORD, {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function resetUserPassword(email, token, newPassword, confirmPassword) {
  const decodedToken = decodeURIComponent(token).replace(/ /g, '+');

  return fetchApi(API_ENDPOINTS.RESET_PASSWORD, {
    method: 'POST',
    body: JSON.stringify({
      Email: email,
      Token: decodedToken,
      NewPassword: newPassword,
      ConfirmPassword: confirmPassword,
    }),
  });
}

export async function loginUser(email, password) {
  const response = await fetchApi(API_ENDPOINTS.LOGIN, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  // Check if response is in the Result wrapper format
  if (!response.isSuccess || !response.data) {
    throw new Error(response.message || 'Login failed');
  }

  const { data } = response;

  // Validate auth data
  if (!data.token || !data.id || !data.userName) {
    throw new Error('Invalid login response data');
  }

  // Save auth data
  localStorage.setItem('token', data.token);
  localStorage.setItem('userId', data.id);
  localStorage.setItem('userName', data.userName);

  return data;
}

export const registerUser = async (name, email, password) => {
  try {
    const response = await fetchWithAuth(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });

    if (response?.data?.userId) {
      return response.data;
    }
    throw new Error(response?.message || 'Registration failed');
  } catch (error) {
    if (error.response?.data?.userId) {
      return error.response.data;
    }
    throw error;
  }
};

export async function verifyOTP(email, otp) {
  return fetchWithAuth(API_ENDPOINTS.VERIFY_OTP, {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
  });
}

export async function resendOTP(email) {
  return fetchWithAuth(API_ENDPOINTS.RESEND_OTP, {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function getUserById(id) {
  if (!id) {
    throw new Error('User ID is required');
  }

  const response = await fetchWithAuth(API_ENDPOINTS.GET_USER(id));
  return {
    userName: response.userName,
    email: response.email,
  };
}

export const initiateGoogleLogin = async () => {
  try {
    // Add returnUrl parameter to tell the backend where to redirect after successful auth
    const returnUrl = `${window.location.origin}/signin-google`;
    const googleLoginUrl = `${API_BASE_URL}${API_ENDPOINTS.GOOGLE_LOGIN}?returnUrl=${encodeURIComponent(returnUrl)}`;
    window.location.href = googleLoginUrl;
  } catch (error) {
    throw new Error('Failed to initiate Google login: ' + error.message);
  }
};

export const handleGoogleCallback = async (code) => {
  try {
    // Get the authentication data from URL parameters instead of fetching the current URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userId = urlParams.get('userId');
    const email = urlParams.get('email');
    const userName = urlParams.get('userName');

    if (!token || !userId || !email) {
      throw new Error('Invalid authentication data received');
    }

    // Store auth data
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('userName', userName || email);
    localStorage.setItem('email', email);

    return { token, userId, email, userName };
  } catch (error) {
    console.error('Google auth callback error:', error);
    throw new Error('Failed to complete Google authentication');
  }
};
