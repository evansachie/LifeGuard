import type {
  ApiResponse,
  AuthRequest,
  AuthResponse,
  RegistrationRequest,
  RegistrationResponse,
  VerifyOTPRequest,
  ResendOTPRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  UserProfile,
  HealthMetrics,
} from '../types/api.types';

export const FRONTEND_URL = window.location.origin;
export const BASE_URL = 'https://lifeguard-hiij.onrender.com';
export const API_BASE_URL = `${BASE_URL}/api`;
export const NODE_API_URL = 'https://lifeguard-node.onrender.com';
export const QUOTE_API_URL = 'https://api.allorigins.win/raw?url=https://zenquotes.io/api/random';
export const RAG_BASE_URL = 'https://lifeguard-rag.onrender.com';

export const API_ENDPOINTS = {
  LOGIN: '/Account/login',
  REGISTER: '/Account/register',
  VERIFY_OTP: '/Account/VerifyOTP',
  RESEND_OTP: '/Account/ResendOTP',
  FORGOT_PASSWORD: '/Account/forgot-password',
  RESET_PASSWORD: '/Account/ResetPassword',
  COMPLETE_PROFILE: '/Account/CompleteProfile',

  GOOGLE_LOGIN: '/Account/google-login',
  GOOGLE_CALLBACK: '/Account/signin-google',

  GET_USER: (id: string): string => `/Account/${id}`,
  GET_PROFILE: (id: string): string => `/Account/GetProfile/${id}`,

  GET_PHOTO: (id: string): string => `${BASE_URL}/${id}/photo`,
  UPLOAD_PHOTO: (id: string): string => `${BASE_URL}/${id}/photo`,
  DELETE_PHOTO: (id: string): string => `${BASE_URL}/${id}/photo`,

  DELETE_USER: (id: string): string => `/Account/${id}`,

  MEMOS: `${NODE_API_URL}/api/memos`,
  MEMOS_UNDONE_COUNT: `${NODE_API_URL}/api/memos/undone/count`,

  EMERGENCY_CONTACTS: `${NODE_API_URL}/api/emergency-contacts`,
  SEND_EMERGENCY_ALERT: `${NODE_API_URL}/api/emergency-contacts/alert`,
  SEND_TEST_ALERT: (id: string): string =>
    `${NODE_API_URL}/api/emergency-contacts/test-alert/${id}`,

  EMERGENCY_TEST_ALERT: (id: string): string =>
    `${NODE_API_URL}/api/emergency-contacts/test-alert/${id}`,
  EMERGENCY_CONTACT_VERIFY: (token: string): string =>
    `${NODE_API_URL}/api/emergency-contacts/verify?token=${encodeURIComponent(token)}`,
  EMERGENCY_ALERTS_HISTORY: `${NODE_API_URL}/api/emergency-contacts/alerts`,

  FREESOUND_AUDIO_PROXY: `${NODE_API_URL}/api/freesound/audio-proxy`,
  FAVORITE_SOUNDS: `${NODE_API_URL}/api/favorite-sounds`,
  GET_USER_FAVORITES: (userId: string): string => `${NODE_API_URL}/api/favorite-sounds/${userId}`,
  REMOVE_FAVORITE: (userId: string, soundId: string): string =>
    `${NODE_API_URL}/api/favorite-sounds/${userId}/${soundId}`,

  RAG_QUERY: `${NODE_API_URL}/api/rag/query`,
  RAG_INITIALIZE: `${NODE_API_URL}/api/rag/initialize`,
  RAG_PROCESS_HEALTH: `${NODE_API_URL}/api/rag/process/health`,
  RAG_PROCESS_ENVIRONMENTAL: `${NODE_API_URL}/api/rag/process/environmental`,
  RAG_PROCESS_MEDICAL: `${NODE_API_URL}/api/rag/process/medical`,
  RAG_PROCESS_PROFILES: `${NODE_API_URL}/api/rag/process/profiles`,

  RAG_UPLOAD_PDF: `${RAG_BASE_URL}/api/upload`,
  RAG_ASK_QUESTION: `${RAG_BASE_URL}/api/ask`,

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
    EMERGENCY: (userId: string): string => `${NODE_API_URL}/api/medications/emergency/${userId}`,
  },

  USER_PREFERENCES: {
    NOTIFICATIONS: `${NODE_API_URL}/api/user-preferences/notifications`,
    SEND_TEST_EMAIL: '/user-preferences/send-test-email',
  },
} as const;

// Request options interface
interface RequestOptions extends RequestInit {
  body?: string | FormData;
  timeout?: number;
}

// Error handling interface
interface ApiError extends Error {
  status?: number;
  response?: Response;
}

export const handleApiResponse = async <T = any>(response: Response): Promise<T> => {
  // Special handling for redirect responses
  if (response.status === 0 || response.type === 'opaqueredirect') {
    return { redirect: true } as T;
  }

  if (!response.ok) {
    const error: ApiError = new Error(`HTTP error! status: ${response.status}`);
    error.status = response.status;
    error.response = response;

    try {
      const errorData = await response.json();
      error.message = errorData.message || errorData.error || error.message;

      // For 409 conflicts, include additional data that might be in the response
      if (response.status === 409 && errorData) {
        (error as any).data = errorData;
        // Preserve original error details for better debugging
        if (errorData.details || errorData.favorite) {
          (error as any).details = errorData.details || errorData.favorite;
        }
      }
    } catch {
      // If JSON parsing fails, keep the default error message
    }

    throw error;
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();
    return data as T;
  }

  return null as T;
};

export const fetchApi = async <T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> => {
  const defaultHeaders: HeadersInit =
    options.body instanceof FormData
      ? { Accept: 'application/json' }
      : {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        };

  try {
    let url: string;
    if (endpoint.startsWith('http')) {
      url = endpoint;
    } else if (endpoint.startsWith('/')) {
      url = `${API_BASE_URL}${endpoint}`;
    } else {
      url = `${API_BASE_URL}/${endpoint}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || 20000);

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      mode: 'cors',
      redirect: options.redirect || 'follow',
      credentials: options.credentials || 'omit',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (options.redirect === 'manual' && [301, 302, 307, 308].includes(response.status)) {
      return response as unknown as T;
    }

    const data = await handleApiResponse<T>(response);
    return data;
  } catch (error) {
    console.error('API Error:', {
      endpoint,
      error,
      requestBody: options.body,
    });

    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }

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
] as const;

export const fetchWithAuth = async <T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> => {
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
  const headers: HeadersInit = {
    ...options.headers,
    ...(token &&
      !isPublicEndpoint && {
        Authorization: `Bearer ${token}`,
      }),
  };

  try {
    const result = await fetchApi<T>(endpoint, {
      ...options,
      headers,
    });

    return result;
  } catch (error) {
    if (error instanceof Error && error.message.includes('401')) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      window.location.href = '/log-in';
    }
    throw error;
  }
};

// Typed API helper functions
export const getResetPasswordUrl = (email: string, token: string): string => {
  return `${FRONTEND_URL}/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;
};

export const extractPhotoUrl = (response: ApiResponse<{ url?: string }>): string | null => {
  if (!response) return null;

  if (response.isSuccess && response.data) {
    return response.data.url || null;
  }

  return null;
};

// Typed API methods for common operations
export const apiMethods = {
  // Authentication
  login: (credentials: AuthRequest): Promise<ApiResponse<AuthResponse>> =>
    fetchApi<ApiResponse<AuthResponse>>(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (userData: RegistrationRequest): Promise<ApiResponse<RegistrationResponse>> =>
    fetchWithAuth<ApiResponse<RegistrationResponse>>(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  verifyOTP: (data: VerifyOTPRequest): Promise<ApiResponse<void>> =>
    fetchWithAuth<ApiResponse<void>>(API_ENDPOINTS.VERIFY_OTP, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  resendOTP: (data: ResendOTPRequest): Promise<ApiResponse<void>> =>
    fetchWithAuth<ApiResponse<void>>(API_ENDPOINTS.RESEND_OTP, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  forgotPassword: (data: ForgotPasswordRequest): Promise<ApiResponse<void>> =>
    fetchApi<ApiResponse<void>>(API_ENDPOINTS.FORGOT_PASSWORD, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  resetPassword: (data: ResetPasswordRequest): Promise<ApiResponse<void>> =>
    fetchApi<ApiResponse<void>>(API_ENDPOINTS.RESET_PASSWORD, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // User Profile
  getUserProfile: (userId: string): Promise<ApiResponse<UserProfile>> =>
    fetchWithAuth<ApiResponse<UserProfile>>(API_ENDPOINTS.GET_PROFILE(userId)),

  updateUserProfile: (profileData: Partial<UserProfile>): Promise<ApiResponse<void>> =>
    fetchWithAuth<ApiResponse<void>>(API_ENDPOINTS.COMPLETE_PROFILE, {
      method: 'POST',
      body: JSON.stringify(profileData),
    }),

  // Health Metrics
  getLatestHealthMetrics: (): Promise<ApiResponse<HealthMetrics>> =>
    fetchWithAuth<ApiResponse<HealthMetrics>>(API_ENDPOINTS.HEALTH_METRICS.LATEST),

  saveHealthMetrics: (metrics: Partial<HealthMetrics>): Promise<ApiResponse<void>> =>
    fetchWithAuth<ApiResponse<void>>(API_ENDPOINTS.HEALTH_METRICS.SAVE, {
      method: 'POST',
      body: JSON.stringify(metrics),
    }),
};
