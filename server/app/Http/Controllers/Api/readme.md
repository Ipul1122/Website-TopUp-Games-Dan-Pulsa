# 🎮 API Controllers Directory

Folder ini khusus menyimpan semua Controller yang bertugas untuk merespons *request* dari Frontend (ReactJS) dengan format **JSON**. 

Memisahkan Controller API di dalam folder `Api/` bertujuan agar kode tetap rapi dan tidak tercampur dengan Controller *web/view* konvensional.

## File & Class Saat Ini:

### 1. `AuthController.php`
Menangani semua logika terkait Autentikasi pengguna.
- **`register(Request $request)`**: Memvalidasi input, membuat *record* `User` baru di database dengan *password* yang di-hash, dan memicu *event* `Registered` untuk mengirim email verifikasi SMTP.
- **`login(Request $request)`**: Mengecek kecocokan kredensial email & password, memblokir akses jika email belum diverifikasi, dan menerbitkan **Access Token** via Sanctum jika berhasil.
- **`verifyEmail(Request $request)`**: Menangkap *request* dari link yang diklik *user* di Gmail, lalu mengubah status `email_verified_at` di database menjadi terverifikasi.