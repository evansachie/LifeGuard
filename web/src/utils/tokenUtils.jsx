import {jwtDecode} from 'jwt-decode';

export const refreshToken = async () => {
    try {
        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        const fiveMinutesBeforeExpiration = decoded.exp - 300; // 5 minutes in seconds

        if (currentTime >= fiveMinutesBeforeExpiration) {
            const response = await fetch('https://lighthouse-portal.onrender.com/api/auth/refresh-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            });

            if (response.ok) {
                const { token: newToken } = await response.json();
                localStorage.setItem('token', newToken);
                return newToken;
            }
        }

        return token;
    } catch (error) {
        console.error('Error refreshing token:', error);
        return null;
    }
};