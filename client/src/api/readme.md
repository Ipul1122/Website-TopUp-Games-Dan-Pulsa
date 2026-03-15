# 🔌 API Configuration Directory

Folder ini bertugas untuk menyimpan seluruh konfigurasi komunikasi HTTP dari *client* (ReactJS) menuju *server* (Laravel).

## File Penting:

### `axios.js`
Merupakan *Custom Instance* dari Axios. 
Daripada menuliskan `http://localhost:8000/api/...` berulang kali di setiap halaman, kita mendefinisikan URL dasar (*Base URL*) dan konfigurasi Header global di sini.

**Konfigurasi Utama:**
- `baseURL`: Menunjuk ke URL API Laravel.
- `Headers`: Secara otomatis menyematkan `Accept: application/json` agar Laravel selalu membalas dengan format JSON dan tidak pernah me- *redirect* secara paksa ke halaman HTML saat terjadi error (*seperti error 401 atau 422*).

*(Catatan: Ke depannya, file ini akan ditambahkan **Axios Interceptor** untuk menyematkan Token Sanctum secara otomatis ke setiap request setelah user Login).*