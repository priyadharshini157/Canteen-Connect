import axios from 'axios';

const getBaseUrl = () => {
    const url = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;
    if (!url) {
        console.error("CRITICAL ERROR: Backend URL is not defined in Vercel Environment Variables! You must configure it and click REDEPLOY.");
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

export default api;