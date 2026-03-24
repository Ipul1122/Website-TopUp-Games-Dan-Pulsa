import axios from 'axios';

const api = axios.create({
    baseURL: 'https://ipultopup.infinityfreeapp.com/api',
    // Mengizinkan pengiriman cookie/token jika diperlukan nanti
    // withCredentials: true, 
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});


// Axios Interceptor untuk otomatis menambahkan Token Bearer
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


export default api;