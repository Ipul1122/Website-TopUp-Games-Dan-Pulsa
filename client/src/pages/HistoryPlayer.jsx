import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';

export default function HistoryPlayer() {
    const [histories, setHistories] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await axios.get('/history');
            setHistories(response.data.data);
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem('auth_token');
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    // Fungsi untuk memberi warna pada status
    const getStatusBadge = (status) => {
        switch (status.toLowerCase()) {
            case 'success':
                return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Berhasil</span>;
            case 'pending':
                return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">Pending</span>;
            case 'failed':
                return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">Gagal</span>;
            default:
                return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">{status}</span>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header Navigasi */}
                <div className="flex justify-between items-center mb-8 bg-white p-4 rounded shadow">
                    <h1 className="text-2xl font-bold text-blue-600">Riwayat Transaksi</h1>
                    <Link to="/dashboard" className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded font-semibold transition">
                        &larr; Kembali ke Dashboard
                    </Link>
                </div>

                {/* Konten Riwayat */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500 animate-pulse font-semibold">Memuat riwayat Anda...</div>
                    ) : histories.length === 0 ? (
                        <div className="p-10 text-center flex flex-col items-center">
                            <span className="text-4xl mb-3">📭</span>
                            <h3 className="text-lg font-bold text-gray-700">Belum Ada Transaksi</h3>
                            <p className="text-gray-500 mt-2">Yuk, mulai top up game favoritmu di Dashboard!</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-blue-50 text-blue-800 text-sm uppercase">
                                        <th className="p-4 border-b font-bold">Order ID</th>
                                        <th className="p-4 border-b font-bold">Produk / Tujuan</th>
                                        <th className="p-4 border-b font-bold">Tanggal</th>
                                        <th className="p-4 border-b font-bold">Total</th>
                                        <th className="p-4 border-b font-bold text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {histories.map((trx) => (
                                        <tr key={trx.id} className="hover:bg-gray-50 transition border-b last:border-0 text-sm">
                                            <td className="p-4 font-mono text-gray-600">{trx.order_id}</td>
                                            <td className="p-4">
                                                <div className="font-bold text-gray-800">{trx.product_code}</div>
                                                <div className="text-xs text-gray-500">ID: {trx.user_game_id}</div>
                                            </td>
                                            <td className="p-4 text-gray-600">{formatDate(trx.created_at)}</td>
                                            <td className="p-4 font-bold text-blue-600">{formatRupiah(trx.amount)}</td>
                                            <td className="p-4 text-center">{getStatusBadge(trx.status)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}