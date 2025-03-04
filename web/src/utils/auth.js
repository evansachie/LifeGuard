import { API_ENDPOINTS, fetchApi } from '../utils/api';

export async function requestPasswordReset(email) {
    return fetchApi(API_ENDPOINTS.FORGOT_PASSWORD, {
        method: 'POST',
        body: JSON.stringify({ email }),
    });
}
