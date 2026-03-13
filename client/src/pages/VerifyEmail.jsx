import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios'; // Pakai axios biasa karena URL-nya utuh dari backend

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('loading'); // loading, success, error
    const [message, setMessage] = useState('Sedang memverifikasi email Anda...');

    useEffect(() => {
        const verifyUrl = searchParams.get('verify_url');

        if (!verifyUrl) {
            setStatus('error');
            setMessage('Link verifikasi tidak valid atau tidak ditemukan.');
            return;
        }

        // Menembak URL API bawaan Laravel
        axios.get(verifyUrl, {
            headers: { 'Accept': 'application/json' }
        })
        .then((response) => {
            setStatus('success');
            setMessage(response.data.message || 'Email berhasil diverifikasi! Anda sekarang bisa login.');
        })
        .catch((error) => {
            setStatus('error');
            setMessage(error.response?.data?.message || 'Gagal memverifikasi email. Link mungkin sudah kedaluwarsa.');
        });
    }, [searchParams]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
                <h2 className="text-2xl font-bold mb-4">Verifikasi Email</h2>
                
                {status === 'loading' && (
                    <div className="text-blue-600 animate-pulse">{message}</div>
                )}
                
                {status === 'success' && (
                    <div className="text-green-600 mb-6 font-semibold">{message}</div>
                )}

                {status === 'error' && (
                    <div className="text-red-600 mb-6 font-semibold">{message}</div>
                )}

                {status !== 'loading' && (
                    <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition duration-200">
                        Ke Halaman Login
                    </Link>
                )}
            </div>
        </div>
    );
}