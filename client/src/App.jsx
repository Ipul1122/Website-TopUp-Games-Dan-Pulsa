import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import Login from './pages/Login'; 
import Dashboard from './pages/Dashboard';
import HistoryPlayer from './pages/HistoryPlayer';

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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/history" element={<HistoryPlayer />} />
        
      </Routes>
    </Router>
  );
}

export default App;
// asdjankjdn