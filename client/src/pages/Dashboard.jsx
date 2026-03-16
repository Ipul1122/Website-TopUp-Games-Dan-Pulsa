import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    // === STATE UNTUK PRODUK ===
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

    // === STATE UNTUK MODAL CHECKOUT MIDTRANS ===
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [checkoutLoading, setCheckoutLoading] = useState(false);

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
            const combinedId = zoneId ? `${userId}${zoneId}` : userId;
            const response = await axios.post('/check-account', {
                game_code: 'mobilelegend',
                user_id: combinedId
            });
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

    // === FUNGSI MEMBUKA & MENUTUP MODAL ===
    const openCheckoutModal = (product) => {
        setSelectedProduct(product);
    };

    const closeCheckoutModal = () => {
        setSelectedProduct(null);
    };

    // === FUNGSI PROSES PEMBAYARAN MIDTRANS ===
    const handleCheckout = async () => {
        if (!userId) {
            alert("Masukkan User ID Game terlebih dahulu di form atas!");
            return;
        }

        setCheckoutLoading(true);
        try {
            const combinedId = zoneId ? `${userId}${zoneId}` : userId;
            
            // 1. Meminta Snap Token ke Laravel API
            const response = await axios.post('/checkout', {
                game_code: 'mobilelegend', 
                user_game_id: combinedId,
                product_code: selectedProduct.kode_produk, 
                amount: selectedProduct.harga
            });

            const snapToken = response.data.snap_token;

            // 2. Memanggil UI Midtrans Snap
            window.snap.pay(snapToken, {
                onSuccess: function(result) {
                    alert("Pembayaran Berhasil! Diamond sedang diproses.");
                    closeCheckoutModal();
                    // Nanti kita akan tambahkan auto-refresh atau redirect di sini
                },
                onPending: function(result) {
                    alert("Menunggu pembayaran Anda!");
                    closeCheckoutModal();
                },
                onError: function(result) {
                    alert("Pembayaran Gagal!");
                    closeCheckoutModal();
                },
                onClose: function() {
                    alert("Anda menutup jendela pembayaran sebelum menyelesaikan transaksi.");
                }
            });

        } catch (error) {
            alert("Gagal memproses pembayaran: " + (error.response?.data?.message || error.message));
            console.error("Checkout Error:", error.response?.data);
        } finally {
            setCheckoutLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 relative">
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

                {/* === UI DAFTAR PRODUK === */}
                <h2 className="text-xl font-bold mb-4">2. Pilih Nominal Top Up</h2>
                {loadingProducts ? (
                    <div className="text-center text-blue-500 font-semibold animate-pulse mt-10">Memuat produk...</div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {products.map((item, index) => (
                            <div 
                                key={index} 
                                onClick={() => openCheckoutModal(item)}
                                className="bg-white border hover:border-blue-500 hover:bg-blue-50 hover:shadow-md transition-all rounded-lg p-4 cursor-pointer relative text-center"
                            >
                                <div className="text-sm font-bold text-gray-800">{item.nama_produk}</div>
                                <div className="text-xs text-gray-500 mb-2">{item.kategori}</div>
                                <div className="text-blue-600 font-bold mt-2">
                                    {formatRupiah(item.harga)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* === MODAL / POPOVER BREADCRUMB PEMBAYARAN === */}
            {selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h3 className="text-lg font-bold">Konfirmasi Pembelian</h3>
                            <button onClick={closeCheckoutModal} className="text-gray-500 hover:text-red-500 font-bold text-2xl leading-none">&times;</button>
                        </div>
                        
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between border-b border-gray-100 pb-2">
                                <span className="text-gray-600">Produk:</span>
                                <span className="font-bold text-right">{selectedProduct.nama_produk}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-100 pb-2">
                                <span className="text-gray-600">ID Tujuan:</span>
                                <span className="font-bold text-right">
                                    {userId ? `${userId}${zoneId ? ` (${zoneId})` : ''}` : <span className="text-red-500 italic">Belum diisi</span>}
                                </span>
                            </div>
                            {nickname && (
                                <div className="flex justify-between border-b border-gray-100 pb-2">
                                    <span className="text-gray-600">Nickname:</span>
                                    <span className="font-bold text-green-600 text-right">{nickname}</span>
                                </div>
                            )}
                            <div className="flex justify-between pt-2">
                                <span className="text-gray-600 font-bold mt-1">Total Bayar:</span>
                                <span className="font-bold text-blue-600 text-2xl">{formatRupiah(selectedProduct.harga)}</span>
                            </div>
                        </div>

                        {!userId && (
                            <p className="text-red-500 text-sm mb-4 text-center bg-red-50 p-2 rounded border border-red-200">
                                ⚠️ Silakan isi <b>User ID Game</b> terlebih dahulu di form atas untuk melanjutkan pembayaran!
                            </p>
                        )}

                        <div className="flex gap-3 mt-6">
                            <button 
                                onClick={closeCheckoutModal}
                                className="w-1/3 py-3 rounded-lg font-bold text-gray-600 bg-gray-200 hover:bg-gray-300 transition-colors"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={handleCheckout}
                                disabled={checkoutLoading || !userId}
                                className={`w-2/3 py-3 rounded-lg font-bold text-white transition-colors flex justify-center items-center
                                    ${checkoutLoading || !userId ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
                            >
                                {checkoutLoading ? 'Memproses...' : 'Lanjut Bayar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}