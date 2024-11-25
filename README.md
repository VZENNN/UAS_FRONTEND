# Fashion Store Application

## Deskripsi Aplikasi
Fashion Store adalah aplikasi e-commerce yang memungkinkan pengguna untuk menjelajahi produk fashion, menambahkannya ke keranjang belanja, dan melakukan pesanan. Aplikasi ini memiliki dua jenis role utama: **User** dan **Admin**.

### Roles dan Privileges
1. **User**:
   - Melihat daftar produk.
   - Menambahkan produk ke keranjang.
   - Melakukan order.
   - Mengubah jumlah produk dalam keranjang.
2. **Admin**:
   - Memiliki semua privilege User.
   - Menambah, mengedit, dan menghapus kategori produk.
   - Menambah, mengedit, dan menghapus produk.

---

## Autentikasi dan Otorisasi

Aplikasi ini menggunakan **JWT (JSON Web Token)** untuk autentikasi dan otorisasi.

### Proses Autentikasi
1. **Login**: Pengguna dapat melakukan login dengan memasukkan email dan password. Setelah berhasil, aplikasi akan mengembalikan **JWT** yang digunakan untuk mengakses endpoint yang memerlukan autentikasi.
2. **Token Storage**: Token yang diterima setelah login akan disimpan di **localStorage** di frontend untuk keperluan autentikasi pada request selanjutnya.
3. **Mekanisme Penggunaan Token**:
   - Setiap permintaan ke backend yang membutuhkan autentikasi akan menyertakan token di header `Authorization` dengan format `Bearer <token>`.
   - Jika token valid, pengguna dapat mengakses resource yang dilindungi, jika tidak, akan mendapatkan respons dengan status `401 Unauthorized`.

### Proses Otorisasi
1. **Role-based Access Control (RBAC)**: Aplikasi ini membatasi akses ke beberapa fitur berdasarkan peran pengguna:
   - **User** hanya dapat mengakses produk, keranjang, dan pesanan mereka sendiri.
   - **Admin** dapat mengakses semua produk dan kategori, serta melakukan perubahan pada kategori dan produk.

2. **Middleware**: Pada backend, middleware akan memverifikasi apakah token valid dan apakah pengguna memiliki hak akses yang sesuai berdasarkan peran mereka.
   - **AuthGuard** akan memeriksa JWT token sebelum melakukan akses ke endpoint yang dilindungi (seperti `/my-orders`, `/my-carts`, dan `/products`).

---

## Requirement
Agar aplikasi ini dapat berjalan, pastikan Anda memiliki versi berikut yang sudah terpasang di sistem Anda:
- **Node.js**: v16.20.2
- **npm**: v8.19.4
- **PostgreSQL**: v14.12
- **AngularJS**: v14.2.13
- **TypeScript**: v4.7.4

---

## Konfigurasi Default
- **Backend** berjalan di port: `3000`
- **Frontend** berjalan di port: `4200`

---

## Panduan Menjalankan Aplikasi

### 1. Backend (Server)
Backend menggunakan **Node.js** dengan framework **Express.js**, terhubung ke **PostgreSQL** untuk database.

#### a. Instalasi Dependencies
Jalankan perintah berikut di terminal pada direktori backend:
```bash
npm install
```

#### b. Import Database
1. Masuk ke PostgreSQL
```bash
psql -U <username>
```

2. Buat database baru untuk aplikasi:
```bash
CREATE DATABASE fashion_store;
```

3. Import file database SQL yang ada di folder backend `database.sql`

#### c. Menjalankan Server
Jalankan perintah berikut untuk menjalankan server backend:
```bash
npm start dev
```

Server akan berjalan di `http://localhost:3000`.


### 1. Frontend
Frontend menggunakan **AngularJS v14** untuk antarmuka pengguna.

#### a. Instalasi Dependencies
Jalankan perintah berikut di terminal pada direktori frontend:
```bash
npm install
```
#### b. Menjalankan Frontend
Jalankan perintah berikut untuk menjalankan frontend:
```bash
ng serve
```
Akses aplikasi akan berjalan di `http://localhost:4200`.

## Informasi Penting
#### 1. Login dan Roles:
- Gunakan akun berikut untuk login admin:
```
Email: admin@gmail.com
Password: password
```
- Untuk akun user bisa dibuat melalui **Form Registrasi**

#### 2. Integrasi Backend dan Frontend:
- Pastikan backend berjalan sebelum memulai frontend untuk menghindari kesalahan jaringan.

#### 3. API Endpoint:
- Semua permintaan data pada frontend mengarah ke backend di `http://localhost:3000`.
  
#### 4. Token Expiration
- Token yang diterima memiliki masa berlaku (expiration) selama 1 jam. Pengguna perlu login kembali jika token telah kedaluwarsa.

## Troubleshooting
- Jika frontend tidak dapat mengambil data, periksa konfigurasi koneksi backend.
- Pastikan versi software pada sistem Anda sesuai dengan requirement yang disebutkan di atas.
- Gunakan skrip ini sebagai panduan lengkap untuk menjalankan aplikasi Anda. Anda dapat memodifikasi bagian login jika diperlukan. 
