import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios'; 

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate(); // Untuk memindahkan halaman setelah sukses

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            // Menembak API Login Laravel
            const response = await axios.post('/login', formData);
            
            // Mengambil token dari respons Laravel dan menyimpannya di browser
            const token = response.data.access_token;
            localStorage.setItem('auth_token', token);
            
            // (Opsional) Simpan data user juga jika diperlukan
            localStorage.setItem('user_data', JSON.stringify(response.data.user));

            // Arahkan user ke halaman utama (Dashboard / Home)
            navigate('/dashboard'); 

        } catch (error) {
            // Menangkap berbagai jenis error dari Laravel
            if (error.response) {
                if (error.response.status === 401) {
                    setErrorMsg('Email atau Password salah.');
                } else if (error.response.status === 403) {
                    setErrorMsg(error.response.data.message || 'Email Anda belum diverifikasi.');
                } else {
                    setErrorMsg('Terjadi kesalahan. Silakan coba lagi.');
                }
            } else {
                setErrorMsg('Tidak dapat terhubung ke server.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Login ke Akun Anda</h2>
                
                {errorMsg && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                        <p>{errorMsg}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <button type="submit" disabled={loading}
                        className={`w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                        {loading ? 'Memeriksa...' : 'Login'}
                    </button>
                </form>
                
                <div className="mt-6 text-center text-sm text-gray-600">
                    Belum punya akun? <Link to="/register" className="text-blue-500 hover:text-blue-800 font-bold">Daftar sekarang</Link>
                </div>
            </div>
        </div>
    );
}