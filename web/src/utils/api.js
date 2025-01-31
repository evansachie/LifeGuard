export const API_BASE_URL = 'https://lifeguard-hiij.onrender.com';

export const API_ENDPOINTS = {
    LOGIN: '/api/Account/login',
    REGISTER: '/api/Account/register',
    FORGOT_PASSWORD: '/api/Account/forgot-password'
};

export const fetchWithAuth = async (endpoint, options = {}) => {
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
        mode: 'cors',
        credentials: 'omit'
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({
            message: 'An error occurred while processing your request'
        }));
        throw new Error(error.message || 'Something went wrong');
    }

    return response.json();
};

export const handleApiResponse = async (response) => {
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
    }
    
    return data;
}; 