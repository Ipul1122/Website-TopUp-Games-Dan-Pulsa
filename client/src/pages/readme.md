# 📄 Pages Directory (React)

Folder ini berisi komponen-komponen React tingkat atas (*top-level components*) yang bertindak sebagai "Halaman" utuh. Komponen di dalam sini akan dipanggil dan di- *render* oleh React Router di `App.jsx` berdasarkan perubahan URL.

## Halaman Saat Ini (Modul Autentikasi):

- **`Register.jsx`**: Form untuk mendaftarkan akun baru. Menangkap input (nama, email, password), menembak endpoint `/api/register` menggunakan Axios, dan menampilkan pesan sukses atau *error* validasi.
- **`VerifyEmail.jsx`**: Halaman perantara (*Handler*). Saat *user* mengklik link di email, mereka akan diarahkan ke halaman ini. Halaman ini akan membaca query URL (token *hash*), menembakkannya secara otomatis ke backend, lalu memberikan pesan apakah verifikasi berhasil atau *expired*.
- **`Login.jsx`**: Form untuk masuk ke aplikasi. Menembak endpoint `/api/login`. Jika sukses, halaman ini akan menangkap `access_token` dari server, menyimpannya secara permanen di `localStorage` browser, dan mengarahkan *user* ke rute `/dashboard`.