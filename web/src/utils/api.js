export const FRONTEND_URL = window.location.origin; // Gets the current frontend URL
export const BASE_URL = 'https://lifeguard-hiij.onrender.com';
export const API_BASE_URL = `${BASE_URL}/api`;
export const NODE_API_URL = 'https://lifeguard-node.onrender.com';
export const QUOTE_API_URL = 'https://api.allorigins.win/raw?url=https://zenquotes.io/api/random';

export const API_ENDPOINTS = {
  LOGIN: '/Account/login',
  REGISTER: '/Account/register',
  VERIFY_OTP: '/Account/VerifyOTP',
  RESEND_OTP: '/Account/ResendOTP',
  FORGOT_PASSWORD: '/Account/forgot-password',
  RESET_PASSWORD: '/Account/ResetPassword',
  COMPLETE_PROFILE: '/Account/CompleteProfile',

  GOOGLE_LOGIN: '/Account/google-login',
  GOOGLE_CALLBACK: '/signin-google',

  GET_USER: (id) => `/Account/${id}`,
  GET_PROFILE: (id) => `/Account/GetProfile/${id}`,

  GET_PHOTO: (id) => `${BASE_URL}/${id}/photo`,
  UPLOAD_PHOTO: (id) => `${BASE_URL}/${id}/photo`,
  DELETE_PHOTO: (id) => `${BASE_URL}/${id}/photo`,

  DELETE_USER: (id) => `/Account/${id}`,

  MEMOS: `${NODE_API_URL}/api/memos`,
  MEMOS_UNDONE_COUNT: `${NODE_API_URL}/api/memos/undone/count`,
  EMERGENCY_CONTACTS: `${NODE_API_URL}/api/emergency-contacts`,
  EMERGENCY_ALERTS: `${NODE_API_URL}/api/emergency-contacts/alert`,

  EMERGENCY_TEST_ALERT: (id) => `${NODE_API_URL}/api/emergency-contacts/test-alert/${id}`,
  EMERGENCY_CONTACT_VERIFY: (token) =>
    `${NODE_API_URL}/api/emergency-contacts/verify?token=${encodeURIComponent(token)}`,
  EMERGENCY_ALERTS_HISTORY: `${NODE_API_URL}/api/emergency-contacts/alerts`,

  FREESOUND_AUDIO_PROXY: `${NODE_API_URL}/api/freesound/audio-proxy`,
  FAVORITE_SOUNDS: `${NODE_API_URL}/api/favorite-sounds`,
  GET_USER_FAVORITES: (userId) => `${NODE_API_URL}/api/favorite-sounds/${userId}`,
  REMOVE_FAVORITE: (userId, soundId) => `${NODE_API_URL}/api/favorite-sounds/${userId}/${soundId}`,

  RAG_QUERY: `${NODE_API_URL}/api/rag/query`,
  RAG_INITIALIZE: `${NODE_API_URL}/api/rag/initialize`,
  RAG_PROCESS_HEALTH: `${NODE_API_URL}/api/rag/process/health`,
  RAG_PROCESS_ENVIRONMENTAL: `${NODE_API_URL}/api/rag/process/environmental`,
  RAG_PROCESS_MEDICAL: `${NODE_API_URL}/api/rag/process/medical`,
  RAG_PROCESS_PROFILES: `${NODE_API_URL}/api/rag/process/profiles`,

  EXERCISE_STATS: `${NODE_API_URL}/api/exercise/stats`,
  EXERCISE_COMPLETE: `${NODE_API_URL}/api/exercise/complete`,
  EXERCISE_GOALS: `${NODE_API_URL}/api/exercise/goals`,
  EXERCISE_WORKOUT_HISTORY: `${NODE_API_URL}/api/exercise/stats/history`,
  EXERCISE_CALORIES_HISTORY: `${NODE_API_URL}/api/exercise/stats/calories`,
  EXERCISE_STREAK_HISTORY: `${NODE_API_URL}/api/exercise/stats/streak`,

  HEALTH_METRICS: {
    LATEST: `${NODE_API_URL}/api/health-metrics/latest`,
    SAVE: `${NODE_API_URL}/api/health-metrics/save`,
    HISTORY: `${NODE_API_URL}/api/health-metrics/history`,
  },

  MEDICATIONS: {
    LIST: `${NODE_API_URL}/api/medications`,
    ADD: `${NODE_API_URL}/api/medications/add`,
    UPDATE: `${NODE_API_URL}/api/medications`,
    DELETE: `${NODE_API_URL}/api/medications`,
    SCHEDULE: `${NODE_API_URL}/api/medications/schedule`,
    TRACK: `${NODE_API_URL}/api/medications/track`,
    REMINDERS: `${NODE_API_URL}/api/medications/reminders`,
    COMPLIANCE: `${NODE_API_URL}/api/medications/compliance`,
    HISTORY: `${NODE_API_URL}/api/medications/history`,
    EMERGENCY: (userId) => `${NODE_API_URL}/api/medications/emergency/${userId}`,
  },

  USER_PREFERENCES: {
    NOTIFICATIONS: `${NODE_API_URL}/api/user-preferences/notifications`,
    SEND_TEST_EMAIL: '/user-preferences/send-test-email',
  },
};

export const handleApiResponse = async (response) => {
  // Special handling for redirect responses
  if (response.status === 0 || response.type === 'opaqueredirect') {
    return { redirect: true };
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: `HTTP error! status: ${response.status}`,
    }));
    throw new Error(error.message || `Request failed with status ${response.status}`);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();
    return data;
  }

  return null;
};

export const fetchApi = async (endpoint, options = {}) => {
  const defaultHeaders =
    options.body instanceof FormData
      ? { Accept: 'application/json' }
      : {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        };

  try {
    let url;
    if (endpoint.startsWith('http')) {
      url = endpoint;
    } else if (endpoint.startsWith('/')) {
      url = `${API_BASE_URL}${endpoint}`;
    } else {
      url = `${API_BASE_URL}/${endpoint}`;
    }

    console.log('Making request to:', url);

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      mode: 'cors',
      redirect: options.redirect || 'follow',
      credentials: options.credentials || 'omit',
    });

    if (options.redirect === 'manual' && [301, 302, 307, 308].includes(response.status)) {
      return response; // Return the response with redirect information
    }

    const data = await handleApiResponse(response);
    return data;
  } catch (error) {
    console.error('API Error:', {
      endpoint,
      error,
      requestBody: options.body,
    });
    throw error;
  }
};

// List of endpoints that don't require authentication
const PUBLIC_ENDPOINTS = [
  API_ENDPOINTS.LOGIN,
  API_ENDPOINTS.REGISTER,
  API_ENDPOINTS.FORGOT_PASSWORD,
  API_ENDPOINTS.RESET_PASSWORD,
  API_ENDPOINTS.VERIFY_OTP,
  API_ENDPOINTS.RESEND_OTP,
  API_ENDPOINTS.GOOGLE_LOGIN,
  API_ENDPOINTS.GOOGLE_CALLBACK,
];

export const fetchWithAuth = async (endpoint, options = {}) => {
  const isPublicEndpoint = PUBLIC_ENDPOINTS.some((publicEndpoint) =>
    endpoint.includes(publicEndpoint)
  );

  const token = localStorage.getItem('token');

  // For non-public endpoints, require token
  if (!token && !isPublicEndpoint) {
    console.error('No auth token found for protected endpoint:', endpoint);
    throw new Error('Authentication required');
  }

  // Add authorization header for authenticated requests
  const headers = {
    ...options.headers,
    ...(token &&
      !isPublicEndpoint && {
        Authorization: `Bearer ${token}`,
      }),
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    const result = await fetchApi(endpoint, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return result;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Request timed out:', endpoint);
      throw new Error('Request timed out. Please try again.');
    }

    if (error.message && error.message.includes('401')) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      window.location.href = '/log-in';
    }
    throw error;
  }
};

export const getResetPasswordUrl = (email, token) => {
  return `${FRONTEND_URL}/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;
};

export const extractPhotoUrl = (response) => {
  if (!response) return null;

  if (response.isSuccess && response.data) {
    return response.data.url || null;
  }

  return null;
};
