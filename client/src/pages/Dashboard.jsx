import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    // === STATE UNTUK FITUR CEK AKUN ===
    const [userId, setUserId] = useState('');
    const [zoneId, setZoneId] = useState('');
    const [nickname, setNickname] = useState('');
    const [checkingAccount, setCheckingAccount] = useState(false);
    const [accountError, setAccountError] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('/products');
            setProducts(response.data.data);
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem('auth_token');
                navigate('/login');
            } else {
                setErrorMsg('Gagal memuat produk. Coba lagi nanti.');
            }
        } finally {
            setLoadingProducts(false);
        }
    };

    // === FUNGSI UNTUK MENEKAN TOMBOL CEK AKUN ===
    const handleCheckAccount = async () => {
        if (!userId) return;
        setCheckingAccount(true);
        setNickname('');
        setAccountError('');

        try {
            // Untuk APIGames, ID Mobile Legends biasanya digabung (Misal: user 12345, zone 2012 jadi 123452012)
            const combinedId = zoneId ? `${userId}${zoneId}` : userId;

            const response = await axios.post('/check-account', {
                game_code: 'mobilelegend', // Ganti 'mobilelegends' jika kode dari APIGames berbeda
                user_id: combinedId
            });

            // Menampilkan hasil Nickname dari APIGames
            // Biasanya APIGames menyimpannya di response.data.data.username
            setNickname(response.data.data.username || response.data.data.name || 'Nickname Ditemukan');
            
        } catch (error) {
            setAccountError('Akun tidak ditemukan atau ID salah.');
            console.error("Error Cek Akun:", error.response?.data);
        } finally {
            setCheckingAccount(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        navigate('/login');
    };

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

                {errorMsg && <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{errorMsg}</div>}

                {/* === UI BOX CEK AKUN GAME === */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">1. Masukkan User ID Game</h2>
                    <div className="flex flex-col md:flex-row gap-4">
                        <input 
                            type="text" 
                            placeholder="Masukkan User ID" 
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            className="flex-1 border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input 
                            type="text" 
                            placeholder="Zone ID (Opsional)" 
                            value={zoneId}
                            onChange={(e) => setZoneId(e.target.value)}
                            className="w-full md:w-48 border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button 
                            onClick={handleCheckAccount}
                            disabled={checkingAccount || !userId}
                            className={`px-6 py-2 rounded font-bold text-white transition-colors ${checkingAccount || !userId ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            {checkingAccount ? 'Mengecek...' : 'Cek Akun'}
                        </button>
                    </div>

                    {/* Menampilkan Hasil Pencarian */}
                    {nickname && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-green-800">
                            Nickname ditemukan: <span className="font-bold text-xl">{nickname}</span>
                        </div>
                    )}
                    {accountError && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-600">
                            {accountError}
                        </div>
                    )}
                </div>

                {/* === UI DAFTAR PRODUK (Yang sudah ada) === */}
                <h2 className="text-xl font-bold mb-4">2. Pilih Nominal Top Up</h2>
                {loadingProducts ? (
                    <div className="text-center text-blue-500 font-semibold animate-pulse mt-10">Memuat produk...</div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {products.map((item, index) => (
                            <div key={index} className="bg-white border hover:border-blue-500 hover:shadow-md transition-all rounded-lg p-4 cursor-pointer relative">
                                <div className="text-sm font-bold text-gray-800">{item.nama_produk}</div>
                                <div className="text-xs text-gray-500 mb-2">{item.kategori}</div>
                                <div className="text-blue-600 font-bold">
                                    {formatRupiah(item.harga)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}