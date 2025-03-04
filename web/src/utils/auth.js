import { API_ENDPOINTS, fetchApi } from '../utils/api';

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
