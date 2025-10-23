import axios, { AxiosHeaders } from 'axios';

export const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    validateStatus: (s) => s >= 200 && s < 400,
    timeout: 15000,
});

axiosClient.defaults.withCredentials = false;

axiosClient.interceptors.request.use((config)=> {
    const token = localStorage.getItem('auth.token');
    if (token){
         const h = new AxiosHeaders(config.headers);
    h.set('Authorization', `Bearer ${token}`);
    config.headers = h;
    }
    return config;
});