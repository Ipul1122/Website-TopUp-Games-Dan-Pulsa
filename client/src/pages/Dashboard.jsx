import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Tarik data saat halaman pertama kali dibuka
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('/products');
            
            // TAMPILKAN DATA ASLI DI CONSOLE BROWSER
            console.log("ISI DATA DARI LARAVEL:", response.data); 

            // Simpan ke state
            setProducts(response.data.data);
        } catch (error) {
            // ... (kode error tangkapan tetap sama)
            if (error.response?.status === 401) {
                localStorage.removeItem('auth_token');
                navigate('/login');
            } else {
                setErrorMsg('Gagal memuat produk. Coba lagi nanti.');
                console.error("Error Detail:", error.response?.data);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        navigate('/login');
    };

    // Fungsi kecil untuk mengubah angka menjadi format Rupiah
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8 bg-white p-4 rounded shadow">
                    <h1 className="text-2xl font-bold text-blue-600">Ipul TopUp Dashboard</h1>
                    <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
                        Logout
                    </button>
                </div>

                {errorMsg && (
                    <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{errorMsg}</div>
                )}

                <h2 className="text-xl font-bold mb-4">Daftar Produk (Mobile Legends)</h2>

                {loading ? (
                    <div className="text-center text-blue-500 font-semibold animate-pulse mt-20">Mengambil data dari APIGames...</div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {/* Jika products adalah Array, kita mapping. Tampilan ini menyesuaikan data Mobile Legends */}
                        {products && products.length > 0 ? (
                            products.map((item, index) => (
                                <div key={index} className="bg-white border hover:border-blue-500 transition-colors rounded-lg shadow-sm p-4 cursor-pointer">
                                    <div className="text-lg font-bold text-gray-800">{item.nama_produk || item.name}</div>
                                    <div className="text-sm text-gray-500 mb-2">{item.kategori || 'Mobile Legends'}</div>
                                    <div className="text-blue-600 font-bold">
                                        {formatRupiah(item.harga || item.price)}
                                    </div>
                                    <button className="mt-3 w-full bg-blue-50 text-blue-600 font-semibold py-1 rounded hover:bg-blue-600 hover:text-white transition">
                                        Pilih
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center text-gray-500">Produk tidak ditemukan atau format data berbeda.</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}