import { API_ENDPOINTS, fetchApi, fetchWithAuth, API_BASE_URL } from '../utils/api';

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
            ConfirmPassword: confirmPassword
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

export async function registerUser(name, email, password) {
    const response = await fetchApi(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
    });

    if (!response.isSuccess) {
        throw new Error(response.message || 'Registration failed');
    }

    return { userId: response.data };
}

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
        email: response.email
    };
}
