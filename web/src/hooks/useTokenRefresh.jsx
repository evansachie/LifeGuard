import { useState, useEffect } from 'react';
import { refreshToken } from '../utils/tokenUtils';

const useTokenRefresh = () => {
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        const refreshTokenInterval = setInterval(async () => {
            const newToken = await refreshToken();
            if (newToken) {
                setToken(newToken);
            }
        }, 60000);
        return () => clearInterval(refreshTokenInterval);
    }, []);

    return token;
};

export default useTokenRefresh;