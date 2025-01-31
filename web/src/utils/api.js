export const API_BASE_URL = 'https://lifeguard-hiij.onrender.com';

export const API_ENDPOINTS = {
    LOGIN: '/api/Account/login',
    REGISTER: '/api/Account/register',
    FORGOT_PASSWORD: '/api/Account/forgot-password'
};

export const fetchWithAuth = async (endpoint, options = {}) => {
    try {
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
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            // Log the error details for debugging
            console.error('API Error:', {
                status: response.status,
                statusText: response.statusText,
                data
            });
            
            throw new Error(data.message || 'Server error occurred');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
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