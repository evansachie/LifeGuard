import { toast } from 'react-toastify';

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
    UPLOAD_PHOTO: (id) => `${BASE_URL}/${id}/photo`,
    DELETE_PHOTO: (id) => `${BASE_URL}/${id}/photo`,
    GET_PHOTO: (id) => `${BASE_URL}/${id}/photo`,

    MEMOS: `${NODE_API_URL}/api/memos`,
    EMERGENCY_CONTACTS: `${NODE_API_URL}/api/emergency-contacts`,
    EMERGENCY_ALERTS: `${NODE_API_URL}/api/emergency-contacts/alert`,
    EMERGENCY_TEST_ALERT: (id) => `${NODE_API_URL}/api/emergency-contacts/test-alert/${id}`,
    EMERGENCY_ALERTS_HISTORY: `${NODE_API_URL}/api/emergency-contacts/alerts`,
    EMERGENCY_CONTACT_VERIFY: (token) => `${NODE_API_URL}/api/emergency-contacts/verify?token=${token}`,

    // RAG API Endpoints
    RAG_QUERY: `${NODE_API_URL}/api/rag/query`,
    RAG_INITIALIZE: `${NODE_API_URL}/api/rag/initialize`,
    RAG_PROCESS_HEALTH: `${NODE_API_URL}/api/rag/process/health`,
    RAG_PROCESS_ENVIRONMENTAL: `${NODE_API_URL}/api/rag/process/environmental`,
    RAG_PROCESS_MEDICAL: `${NODE_API_URL}/api/rag/process/medical`,
    RAG_PROCESS_PROFILES: `${NODE_API_URL}/api/rag/process/profiles`
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

        let data;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }
        
        console.log('Response:', data);

        if (!response.ok) {
            throw new Error(typeof data === 'string' ? data : (data.message || data.error || `Error: ${response.statusText}`));
        }

        return data;
    } catch (error) {
        console.error('API Error:', {
            endpoint,
            error,
            requestBody: options.body
        });
        toast.error(error.message || 'An error occurred');
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

export const handleApiResponse = async (response) => {
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
    }
    
    return data;
};

export const getResetPasswordUrl = (email, token) => {
    return `${FRONTEND_URL}/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;
};