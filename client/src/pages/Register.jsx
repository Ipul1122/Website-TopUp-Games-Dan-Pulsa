import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios'; // Menggunakan konfigurasi axios yang sudah dibuat

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setMessage('');

        try {
            // Menembak API Laravel
            const response = await axios.post('/register', formData);
            setMessage(response.data.message); // Menampilkan pesan sukses
            setFormData({ name: '', email: '', password: '', password_confirmation: '' }); // Kosongkan form
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                setMessage('Terjadi kesalahan pada server.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Daftar Akun Baru</h2>
                
                {message && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
                        <p>{message}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Nama Lengkap</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        {errors.name && <p className="text-red-500 text-xs italic mt-1">{errors.name[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        {errors.email && <p className="text-red-500 text-xs italic mt-1">{errors.email[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        {errors.password && <p className="text-red-500 text-xs italic mt-1">{errors.password[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Konfirmasi Password</label>
                        <input type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <button type="submit" disabled={loading}
                        className={`w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                        {loading ? 'Memproses...' : 'Daftar'}
                    </button>
                </form>
                <div className="mt-4 text-center text-sm text-gray-600">
                    Sudah punya akun? <Link to="/login" className="text-blue-500 hover:text-blue-800 font-bold">Login di sini</Link>
                </div>
            </div>
        </div>
    );
}