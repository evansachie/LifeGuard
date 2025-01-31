export const API_BASE_URL = 'https://lifeguard-hiij.onrender.com';

export const API_ENDPOINTS = {
    LOGIN: '/api/Account/login',
    REGISTER: '/api/Account/register',
    FORGOT_PASSWORD: '/api/Account/forgot-password',
    VERIFY_OTP: '/api/Account/VerifyOTP',
    RESEND_OTP: '/api/Account/ResendOTP'
};

export const fetchWithAuth = async (endpoint, options = {}) => {
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

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
            throw new Error(data.error || data.message || 'An error occurred');
        }

        return data;
    } catch (error) {
        console.error('API Error Details:', {
            type: error.name,
            message: error.message,
            url: `${API_BASE_URL}${endpoint}`,
            payload: options.body
        });
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