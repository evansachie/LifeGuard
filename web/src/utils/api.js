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
    
    GET_USER: (id) => `/Account/${id}`,
    GET_PROFILE: (id) => `/Account/GetProfile/${id}`,
    GET_PHOTO: (id) => `${BASE_URL}/${id}/photo`,
    UPLOAD_PHOTO: (id) => `${BASE_URL}/${id}/photo`,
    DELETE_PHOTO: (id) => `${BASE_URL}/${id}/photo`,
    DELETE_USER: (id) => `/Account/${id}`,

    MEMOS: `${NODE_API_URL}/api/memos`,
    EMERGENCY_CONTACTS: `${NODE_API_URL}/api/emergency-contacts`,
    EMERGENCY_ALERTS: `${NODE_API_URL}/api/emergency-contacts/alert`,

    EMERGENCY_TEST_ALERT: (id) => `${NODE_API_URL}/api/emergency-contacts/test-alert/${id}`,
    EMERGENCY_CONTACT_VERIFY: (token) => `${NODE_API_URL}/api/emergency-contacts/verify?token=${encodeURIComponent(token)}`,
    EMERGENCY_ALERTS_HISTORY: `${NODE_API_URL}/api/emergency-contacts/alerts`,

    FREESOUND_AUDIO_PROXY: `${NODE_API_URL}/api/freesound/audio-proxy`,
    FAVORITE_SOUNDS: `${NODE_API_URL}/api/favorite-sounds`,
    GET_USER_FAVORITES: (userId) => `${NODE_API_URL}/api/favorite-sounds/${userId}`,
    REMOVE_FAVORITE: (userId, soundId) => `${NODE_API_URL}/api/favorite-sounds/${userId}/${soundId}`,

    // RAG API Endpoints
    RAG_QUERY: `${NODE_API_URL}/api/rag/query`,
    RAG_INITIALIZE: `${NODE_API_URL}/api/rag/initialize`,
    RAG_PROCESS_HEALTH: `${NODE_API_URL}/api/rag/process/health`,
    RAG_PROCESS_ENVIRONMENTAL: `${NODE_API_URL}/api/rag/process/environmental`,
    RAG_PROCESS_MEDICAL: `${NODE_API_URL}/api/rag/process/medical`,
    RAG_PROCESS_PROFILES: `${NODE_API_URL}/api/rag/process/profiles`,
};

export const handleApiResponse = async (response) => {
    const data = await response.json();
    
    if (!response.ok || (data.statusCode && data.statusCode !== 200)) {
        throw new Error(data.message || 'An error occurred');
    }
    
    return data.isSuccess !== undefined ? data : { isSuccess: true, data };
};

export const fetchApi = async (endpoint, options = {}) => {
    const defaultHeaders = options.body instanceof FormData
        ? { 'Accept': 'application/json' }
        : {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

    try {
        const baseUrl = endpoint.startsWith('http') ? '' : API_BASE_URL;
        const url = `${baseUrl}${endpoint}`;
        
        console.log('Making request to:', url);
        console.log('Request payload:', options.body);

        const response = await fetch(url, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
            mode: 'cors',
            credentials: 'omit'
        });

        const data = await handleApiResponse(response);
        console.log('Response:', data);
        return data;
    } catch (error) {
        console.error('API Error:', {
            endpoint,
            error,
            requestBody: options.body
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
    API_ENDPOINTS.RESEND_OTP
];

export const fetchWithAuth = async (endpoint, options = {}) => {
    // Check if endpoint is public
    const isPublicEndpoint = PUBLIC_ENDPOINTS.some(publicEndpoint => 
        endpoint.includes(publicEndpoint)
    );

    const token = localStorage.getItem('token');
    if (!token && !isPublicEndpoint) {
        throw new Error('No authentication token found');
    }

    return fetchApi(endpoint, {
        ...options,
        headers: {
            ...options.headers,
            ...(token && !isPublicEndpoint && { 'Authorization': `Bearer ${token}` })
        }
    });
};

export const getResetPasswordUrl = (email, token) => {
    return `${FRONTEND_URL}/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;
};