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
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message || 'Login failed');
    }

    return data; // Return token and user info
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
