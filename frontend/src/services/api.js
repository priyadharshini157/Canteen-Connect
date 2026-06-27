import axios from 'axios';

const getBaseUrl = () => {
    let url = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;
    if (!url) {
        console.error("CRITICAL ERROR: Backend URL is not defined in Vercel Environment Variables! You must configure it and click REDEPLOY.");
        return "/api"; // fallback
    }
    // Automatically append /api if the user forgot it
    if (!url.endsWith('/api')) {
        url = url.replace(/\/+$/, '') + '/api';
    }
    return url;
};

const api = axios.create({
    baseURL: getBaseUrl(),
    headers: {
        'Content-Type': 'application/json',
    }
});

// Automatically attach JWT token if present
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Automatically log out if the token is expired (401 Unauthorized)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const isLoginRequest = error.config && error.config.url && error.config.url.includes('/auth/login');
        if (error.response && error.response.status === 401 && !isLoginRequest) {
            console.error("Token expired or invalid. Auto-logging out.");
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            // Only redirect if not already on the login page to prevent loops
            if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;