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

    try {
        console.log('Attempting to connect to:', `${API_BASE_URL}${endpoint}`);
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
            mode: 'cors',
            credentials: 'omit'
        });

        const data = await response.json();
        console.log('Response data:', data);

        if (!response.ok) {
            throw new Error(data.error || data.message || 'Something went wrong');
        }

        return data;
    } catch (error) {
        console.error('API Error Details:', {
            type: error.name,
            message: error.message,
            url: `${API_BASE_URL}${endpoint}`,
            payload: options.body
        });
        
        if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
            throw new Error('Unable to connect to the server. Please check your internet connection or try again later.');
        }
        
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