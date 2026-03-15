# 🗺️ Server Routes Directory

Direktori ini berisi semua definisi rute (URL endpoints) untuk aplikasi backend Laravel. Karena aplikasi ini menggunakan arsitektur *decoupled* (terpisah dari frontend), fokus utama kita ada pada rute API.

## File yang Tersedia:

- `api.php` : **Sangat Penting!** Di sinilah semua rute REST API didaftarkan. Rute dalam file ini secara otomatis diberikan prefix `/api` (contoh: `http://localhost:8000/api/register`). File ini sifatnya *stateless* dan difilter oleh *middleware* `api` serta menggunakan **Laravel Sanctum** untuk autentikasi token.
- `web.php` : Rute untuk halaman web tradisional (berbasis *view* Blade). Dalam project ini, file ini hanya digunakan untuk menampilkan halaman default *Welcome* Laravel, karena UI sepenuhnya ditangani oleh ReactJS.
- `console.php` : Digunakan untuk mendefinisikan rute perintah (*command*) Artisan berbasis *closure*. Sangat berguna untuk membuat perintah CRON Job atau *task scheduling* sederhana.

## Endpoint API Saat Ini (Authentication):
| Method | Endpoint | Fungsi | Middleware |
|--------|----------|--------|------------|
| POST | `/api/register` | Mendaftarkan akun baru & kirim email | - |
| POST | `/api/login` | Login & generate token Sanctum | - |
| GET | `/api/email/verify/{id}/{hash}`| Memverifikasi klik link dari Email | `signed` |
| GET | `/api/user` | Mengambil data profil user (Test Token) | `auth:sanctum` |