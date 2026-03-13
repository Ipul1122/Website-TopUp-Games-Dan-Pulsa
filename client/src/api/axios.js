import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    // Mengizinkan pengiriman cookie/token jika diperlukan nanti
    // withCredentials: true, 
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Nanti kita bisa tambahkan Interceptor di sini untuk menyelipkan Token Sanctum

export default api;