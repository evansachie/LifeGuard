import { toast } from 'react-toastify';

export const FRONTEND_URL = window.location.origin; // Gets the current frontend URL
export const API_BASE_URL = 'https://lifeguard-hiij.onrender.com/api';
export const NODE_API_URL = 'https://lifeguard-node.onrender.com';

export const API_ENDPOINTS = {
    LOGIN: '/Account/login',
    REGISTER: '/Account/register',
    VERIFY_OTP: '/Account/verify-otp',
    RESEND_OTP: '/Account/ResendOTP',
    FORGOT_PASSWORD: '/Account/forgot-password',
    RESET_PASSWORD: '/Account/reset-password',
    GET_USER: '/Account/id',
    MEMOS: `${NODE_API_URL}/api/memos`
};

export const fetchWithAuth = async (endpoint, options = {}) => {
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    // Add token to headers if it exists
    const token = localStorage.getItem('token');
    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    try {
        console.log('Making request to:', `${API_BASE_URL}${endpoint}`);
        console.log('Request payload:', options.body);

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
            mode: 'cors',
            credentials: 'omit'
        });

        let data;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            const text = await response.text();
            console.error('Non-JSON response:', text);
            throw new Error('Server returned an invalid response');
        }

        console.log('Response:', data);

        if (!response.ok) {
            // If unauthorized, clear token and redirect to login
            if (response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/log-in';
                throw new Error('Session expired. Please login again.');
            }
            throw new Error(data.error || data.message || 'An error occurred');
        }

        return data;
    } catch (error) {
        toast.error(error.message || 'An error occurred');
        throw error;
    }
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