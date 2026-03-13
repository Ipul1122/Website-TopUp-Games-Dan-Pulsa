import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import Login from './pages/Login'; // 1. Import Login

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        
        {/* 2. Daftarkan Rute Login */}
        <Route path="/login" element={<Login />} />
        
        {/* 3. Dummy halaman Dashboard setelah sukses Login */}
        <Route path="/dashboard" element={
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <h1 className="text-3xl font-bold text-green-600 mb-4">Selamat Datang di Dashboard!</h1>
                <p className="text-gray-600">Anda berhasil login dan token telah disimpan.</p>
                <button onClick={() => { localStorage.clear(); window.location.href='/login'; }} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">Logout</button>
            </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
// asdjankjdn