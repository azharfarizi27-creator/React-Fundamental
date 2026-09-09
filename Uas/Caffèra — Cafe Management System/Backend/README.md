# ☕ Caffèra — Backend API (Cafe Management System)
> **Tugas Akhir / Ujian Akhir Semester (UAS)**  
> **Mata Kuliah / Topik**: React Fundamental & Fullstack Web Development  
> **Teknologi Backend**: ASP.NET Core 9 (C#) • Entity Framework Core 9 • Hybrid Database (PostgreSQL & SQL Server) • JWT Authentication

---

## 🎓 PANDUAN CEPAT UNTUK DOSEN / INSTRUKTUR PENGUJI (Quick Start)

> [!TIP]
> **Hanya butuh 1 software (.NET 9 SDK) & 1 perintah (`dotnet run`)!**  
> Database backend telah terhubung langsung ke cloud database **PostgreSQL (Supabase)** yang sudah aktif dan berisi data seed lengkap (menu, meja, kategori, dan akun pengguna). **Bapak/Ibu Dosen / Instruktur TIDAK PERLU menginstal software database lokal.**

### ⚡ 3 Langkah Cepat Menjalankan Backend:

1. **Pastikan .NET 9.0 SDK terpasang di laptop:**
   - Cek di Terminal / Command Prompt: `dotnet --version` *(Harus versi `9.0.x`)*
   - Jika belum ada, download di: [https://dotnet.microsoft.com/download/dotnet/9.0](https://dotnet.microsoft.com/download/dotnet/9.0)

2. **Buka Terminal di folder `Backend` lalu jalankan:**
   ```bash
   cd "Backend"
   dotnet run
   ```

3. **Buka Dokumentasi & Pengujian API Interaktif (Swagger UI):**
   - Buka browser ke: **[http://localhost:5066/swagger](http://localhost:5066/swagger)**
   - Backend siap diuji! 🎉

#### 🔑 Akun Bawaan untuk Pengujian Dosen/Instruktur:
| Role | Email | Password | Kegunaan |
| :--- | :--- | :--- | :--- |
| 👑 **Admin** | `admin@caffera.com` | `admin123` | Akses penuh: Kelola Menu, Kategori, Meja, User/Staf, dan Laporan Omzet (*Sales Summary*). |
| 👤 **Cashier** | `cashier@caffera.com` | `cashier123` | Akses Kasir/POS: Buat Pesanan Baru, Update Status Pesanan, Update Status Meja, dan Toggle Menu Habis. |

---

## 📋 Daftar Isi
1. [Fitur Utama & Arsitektur](#-fitur-utama--arsitektur)
2. [Software yang Perlu Diinstal (Prasyarat Lengkap)](#-software-yang-perlu-diinstal-prasyarat-lengkap)
3. [Panduan Instalasi & Eksekusi Step-by-Step](#-panduan-instalasi--eksekusi-step-by-step)
4. [Struktur Direktori Proyek](#-struktur-direktori-proyek)
5. [Opsi Penggunaan Database Lokal (Offline)](#-opsi-penggunaan-database-lokal-offline)
6. [Daftar Endpoint API & Pengujian Swagger](#-daftar-endpoint-api--pengujian-swagger)
7. [Error Handling & Keamanan (Security Principles)](#-error-handling--keamanan-security-principles)
8. [Panduan Deploy ke MonsterASP.NET](#-panduan-deploy-ke-monsteraspnet)
9. [Troubleshooting & Solusi Kendala](#-troubleshooting--solusi-kendala)

---

## 🚀 Fitur Utama & Arsitektur

- **Clean Layered Architecture**: Pemisahan tanggung jawab yang rapi antara `Controllers` (Routing & HTTP), `Services` (Business Logic), `Repositories` (Data Access), dan `DTOs` (Contract Models).
- **Hybrid Database Provider**: Otomatis mendeteksi dan mendukung koneksi ke **PostgreSQL Cloud (Supabase / Neon)**, **PostgreSQL Lokal**, maupun **Microsoft SQL Server**.
- **Role-Based Access Control (RBAC)**: Menggunakan **JWT (JSON Web Token)** untuk mengamankan endpoint berdasarkan peran `Admin` dan `Cashier`.
- **Keamanan Tingkat Lanjut (Security Best Practices)**:
  - **BCrypt Password Hashing**: Enkripsi password satu arah yang kuat.
  - **Anti-Brute Force (Rate Limiting)**: Membatasi percobaan login maksimal 10 request/menit (`AuthLimiter`).
  - **Global Exception Middleware**: Menangkap unhandled exception, mencatat log terperinci di server, dan mencegah kebocoran informasi database internal pada mode produksi.
  - **Standardized Model Validation**: Validasi data input otomatis mengembalikan struktur `ApiResponse<T>` yang konsisten.
  - **Custom Request Logging Middleware**: Pencatatan durasi dan status eksekusi HTTP request secara real-time di console.
- **Database Auto-Seeder**: Inisialisasi otomatis skema tabel dan data seed (22 menu, 10 meja, 5 kategori, 2 akun staf default).
- **Swagger / OpenAPI Documentation**: Dokumentasi interaktif dengan dukungan uji coba JWT Bearer token langsung dari antarmuka browser.

---

## 🛠️ Software yang Perlu Diinstal (Prasyarat Lengkap)

Berikut adalah rincian software yang diperlukan untuk menjalankan backend secara lokal:

### 1. **.NET 9.0 SDK** *(Wajib)*
* **Deskripsi**: Runtime environment dan compiler C# untuk menjalankan ASP.NET Core 9.
* **Sistem Operasi**: Windows, macOS, atau Linux.
* **Link Download Resmi**: [https://dotnet.microsoft.com/download/dotnet/9.0](https://dotnet.microsoft.com/download/dotnet/9.0)  
  *(Pilih opsi **.NET SDK x64 / Arm64** sesuai prosesor komputer Anda).*
* **Verifikasi Instalasi**:
  Buka Terminal (PowerShell / Command Prompt / Terminal Mac/Linux) lalu ketik:
  ```bash
  dotnet --version
  ```
  *Output yang benar akan menampilkan `9.0.xxx`.*

---

### 2. **Database (Pilih 1 dari Opsi di Bawah Ini)**

| Pilihan Database | Perlu Install Software? | Keterangan |
| :--- | :---: | :--- |
| **⭐ Opsi 1: Cloud PostgreSQL Supabase (Default)** | **TIDAK** | **Sangat Direkomendasikan.** Backend sudah dikonfigurasi langsung ke Supabase Cloud. Cukup terhubung ke internet saat menjalankan server. |
| **💻 Opsi 2: PostgreSQL Lokal** | **YA** | Jika ingin menjalankan database secara offline lokal di laptop. Unduh [PostgreSQL](https://www.postgresql.org/download/). |
| **🏢 Opsi 3: SQL Server Lokal** | **YA** | Jika ingin menggunakan Microsoft SQL Server Express. Unduh [SQL Server Express](https://www.microsoft.com/en-us/sql-server/sql-server-downloads). |

---

### 3. **Code Editor / IDE** *(Opsional)*
Untuk membuka dan memeriksa source code:
* **Visual Studio Code** (Direkomendasikan, tambahkan ekstensi *C# Dev Kit*).
* **Visual Studio 2022** (v17.12+ dengan workload *ASP.NET and web development*).
* **JetBrains Rider**.

---

## ⚙️ Panduan Instalasi & Eksekusi Step-by-Step

### Langkah 1: Buka Folder Backend di Terminal
Buka aplikasi **Terminal** / **PowerShell** / **Command Prompt**, lalu arahkan ke direktori `Backend`:
```bash
cd "c:\React-Fundamental\Uas\Caffèra — Cafe Management System\Backend"
```

### Langkah 2: Unduh Pustaka & Dependencies (.NET Restore)
Jalankan perintah berikut untuk mengunduh seluruh dependensi NuGet yang diperlukan:
```bash
dotnet restore
```

### Langkah 3: Jalankan Backend Server
Jalankan aplikasi dengan perintah:
```bash
dotnet run
```
*(Atau gunakan mode `dotnet watch run` jika ingin server otomatis me-reload saat ada perubahan kode).*

Saat server berhasil berjalan, terminal akan menampilkan output:
```text
   ______          ________                     
  / ____/___ _____/ __/ __/___  _________ _     
 / /   / __ `/ __/ /_/ /_/ __ \/ ___/ __ `/     
/ /___/ /_/ / /_/ __/ __/ /_/ / /  / /_/ /      
\____/\__,_/_/ /_/ /_/  \____/_/   \__,_/       
:: Caffèra Cafe Management System :: (v1.0)

[DATABASE] 🔄 Memulai pengecekan & inisialisasi database...
[DATABASE] 📦 Memeriksa & menginisialisasi skema tabel PostgreSQL...
[DATABASE] ✅ Database PostgreSQL terhubung & skema tabel siap.
[DATABASE] 👤 Akun default Admin (admin@caffera.com) terverifikasi.
[DATABASE] 👤 Akun default Cashier (cashier@caffera.com) terverifikasi.
[DATABASE] 🚀 Inisialisasi Database selesai dengan sukses!

info: Microsoft.Hosting.Lifetime[14] Now listening on: http://localhost:5066
```

### Langkah 4: Buka Swagger UI di Browser
Buka browser dan akses alamat berikut:
👉 **[http://localhost:5066/swagger](http://localhost:5066/swagger)**

---

## 📁 Struktur Direktori Proyek

```text
Backend/
├── Controllers/              # RESTful API Endpoints & Routing
│   ├── AuthController.cs     # Login, Register, Profile, List Users
│   ├── CategoriesController.cs # CRUD Kategori Menu
│   ├── DashboardController.cs  # Metrik & Statistik Cafe
│   ├── MenusController.cs    # CRUD & Filter Menu Minuman/Makanan
│   ├── OrdersController.cs   # Transaksi POS, Status Order, & Cancel
│   ├── SalesController.cs    # Laporan Penjualan & Summary Omzet
│   └── TablesController.cs   # Manajemen Meja & Status Ketersediaan
├── Data/                     # Database Engine Core
│   ├── AppDbContext.cs       # Entity mapping, relasi, & initial seed data
│   └── DbInitializer.cs      # Auto-creation tabel & validasi BCrypt user
├── DTOs/                     # Data Transfer Objects (Request/Response Models)
│   ├── Auth/
│   ├── Category/
│   ├── Common/               # ApiResponse<T> & PagedResult<T>
│   ├── Dashboard/
│   ├── Menu/
│   ├── Order/
│   ├── Sales/
│   └── Table/
├── Helpers/                  # Utility Token JWT & Claims Helper
│   └── JwtHelper.cs
├── Middlewares/              # Pipeline Middleware Kustom
│   ├── ExceptionMiddleware.cs    # Global Error Handler & OWASP Protection
│   └── RequestLoggingMiddleware.cs # Logging Request & Response Duration
├── Migrations/               # Snapshot & File Migrasi EF Core
├── Models/                   # Entity Data Models (User, Category, Menu, Table, Order, OrderItem)
├── Properties/
│   └── launchSettings.json   # Konfigurasi Port Profil Localhost (Port 5066)
├── appsettings.json          # Konfigurasi Localhost (Default: Supabase PostgreSQL)
├── appsettings.Production.json # Konfigurasi Produksi (MonsterASP.NET)
├── Caffera.Backend.csproj    # File Proyek .NET 9 & Dependencies
├── Caffera.sln               # Solution File Visual Studio
├── Caffera.Backend.http      # HTTP Client Test Script
├── MONSTERASP_DEPLOYMENT.md  # Panduan Lengkap Deploy ke MonsterASP.NET
├── publish.bat               # Script Otomatis 1-Klik Build & Pack ke publish.zip
├── web.config                # Konfigurasi IIS Hosting & InProcess Handler
└── Program.cs                # Entry Point Aplikasi, DI, Middleware Pipeline, CORS, & Auth
```

---

## 💾 Opsi Penggunaan Database Lokal (Offline)

Jika instruktur / penguji ingin menjalankan database secara mandiri di komputer lokal tanpa koneksi internet:

### Menggunakan PostgreSQL Lokal:
1. Pastikan PostgreSQL lokal Anda aktif di port `5432`.
2. Buat database baru bernama `CafferaDb`.
3. Buka file `appsettings.json`, lalu ubah baris `ConnectionStrings`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=localhost;Port=5432;Database=CafferaDb;Username=postgres;Password=PASSWORD_POSTGRES_ANDA;SSL Mode=Prefer"
     },
     "DatabaseProvider": "PostgreSQL"
   }
   ```
4. Jalankan `dotnet run`. Database dan seluruh tabel serta data seeder akan otomatis terbentuk!

### Menggunakan Microsoft SQL Server Lokal:
1. Pastikan service **SQL Server (SQLEXPRESS)** aktif di Windows.
2. Buka file `appsettings.json`, lalu ubah:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=.\\SQLEXPRESS;Database=CafferaDb;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
     },
     "DatabaseProvider": "SqlServer"
   }
   ```
3. Jalankan `dotnet run`.

---

## 📡 Daftar Endpoint API & Pengujian Swagger

Base URL Localhost: **`http://localhost:5066`**

### Cara Melakukan Pengujian Token JWT di Swagger:
1. Di Swagger UI, buka endpoint `POST /api/auth/login`.
2. Klik **Try it out**, masukkan JSON login:
   ```json
   {
     "email": "admin@caffera.com",
     "password": "admin123"
   }
   ```
3. Klik **Execute**. Salin nilai token dari field `data.token`.
4. Scroll ke bagian atas Swagger, klik tombol hijau **Authorize 🔓**.
5. Masukkan: `Bearer <token_yang_disalin>` lalu klik **Authorize** ➔ **Close**.
6. Sekarang Anda dapat menguji semua endpoint terproteksi!

### Ringkasan Endpoint API:
| Modul | Method | Endpoint | Akses / Role | Keterangan |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/login` | Publik (Rate-limited) | Login & generate JWT token |
| | `POST` | `/api/auth/register` | `Admin` | Pendaftaran akun kasir/staf baru |
| | `GET` | `/api/auth/profile` | Authenticated | Mendapatkan profil user yang sedang login |
| | `GET` | `/api/auth/users` | `Admin` | Mengambil daftar seluruh user |
| **Categories** | `GET` | `/api/categories` | Publik | Mendapatkan seluruh kategori menu |
| | `GET` | `/api/categories/{id}` | Publik | Detail kategori berdasarkan ID |
| | `POST` | `/api/categories` | `Admin` | Menambahkan kategori baru |
| | `PUT` | `/api/categories/{id}` | `Admin` | Mengubah nama/deskripsi kategori |
| | `DELETE` | `/api/categories/{id}` | `Admin` | Menghapus kategori |
| **Menus** | `GET` | `/api/menus` | Publik | List menu (support filter, search, & pagination) |
| | `GET` | `/api/menus/{id}` | Publik | Detail menu berdasarkan ID |
| | `POST` | `/api/menus` | `Admin` | Menambahkan menu makanan/minuman baru |
| | `PUT` | `/api/menus/{id}` | `Admin` | Mengubah informasi menu |
| | `DELETE` | `/api/menus/{id}` | `Admin` | Menghapus menu |
| | `PATCH` | `/api/menus/{id}/toggle-availability` | `Admin`, `Cashier` | Mengubah status menu (Tersedia / Habis) |
| **Tables** | `GET` | `/api/tables` | Publik | List meja (filter status: Available/Occupied) |
| | `GET` | `/api/tables/{id}` | Publik | Detail meja berdasarkan ID |
| | `POST` | `/api/tables` | `Admin` | Menambahkan meja baru |
| | `PUT` | `/api/tables/{id}` | `Admin` | Memperbarui kapasitas meja |
| | `PATCH` | `/api/tables/{id}/status` | `Admin`, `Cashier` | Update status meja (`Available`/`Occupied`/`Reserved`) |
| | `DELETE` | `/api/tables/{id}` | `Admin` | Menghapus meja |
| **Orders** | `GET` | `/api/orders` | Authenticated | List seluruh order pesanan dengan pagination |
| | `GET` | `/api/orders/{id}` | Authenticated | Detail pesanan & rincian order item |
| | `GET` | `/api/orders/number/{orderNumber}` | Authenticated | Cari pesanan berdasarkan nomor struk |
| | `POST` | `/api/orders` | Authenticated | Checkout pesanan baru (POS Cashier) |
| | `PATCH` | `/api/orders/{id}/status` | Authenticated | Update status pesanan (`Pending`, `Preparing`, `Completed`, `Cancelled`) |
| | `DELETE` | `/api/orders/{id}/cancel` | Authenticated | Batalkan pesanan |
| **Sales** | `GET` | `/api/sales/history` | Authenticated | Riwayat transaksi penjualan |
| | `GET` | `/api/sales/summary` | Authenticated | Ringkasan omzet, rata-rata order, & menu terlaris |
| **Dashboard** | `GET` | `/api/dashboard/stats` | Authenticated | Statistik ringkasan kartu metrik dashboard |

---

## 🛡️ Error Handling & Keamanan (Security Principles)

1. **Global Exception Middleware (`ExceptionMiddleware.cs`)**:
   - Menangkap seluruh error tidak terduga pada server.
   - Pada mode **Production**, error disanitasi menjadi pesan ramah dan **tidak pernah membocorkan password database, query internal, atau stack trace** ke klien.
   - Pada mode **Development / Localhost**, mencatat error log berwarna di console untuk mempermudah debugging.
2. **Format Response Terstandar (`ApiResponse<T>`)**:
   Setiap respons API mengembalikan struktur seragam:
   ```json
   {
     "success": true,
     "message": "Deskripsi status",
     "data": { ... },
     "errors": null
   }
   ```
3. **Validasi Model Otomatis (`Program.cs`)**:
   Setiap input yang tidak memenuhi validasi DTO (misal: harga bernilai minus, email kosong) otomatis menghasilkan status **400 Bad Request** dengan format `ApiResponse` standar.
4. **Anti-Brute Force (Rate Limiting)**:
   Membatasi maksimal 10 request per menit pada endpoint `/api/auth/login` untuk mencegah serangan brute-force.
5. **CORS Security**:
   Membatasi akses frontend hanya ke origin yang terdaftar di `appsettings.json` (Localhost port 5173, 3000, domain Vercel/Netlify, dan MonsterASP).

---

## 🌐 Panduan Deploy ke MonsterASP.NET

1. Jalankan script publish 1-klik di terminal:
   ```bash
   .\publish.bat
   ```
   *(Script ini akan mengompilasi mode Release dan menghasilkan file siap upload: `publish.zip`).*
2. Masuk ke **Control Panel MonsterASP.NET** ➔ Buka **Files (File Manager)** ➔ Masuk ke folder `/wwwroot`.
3. Klik tombol **Upload File**, pilih file `publish.zip`, kemudian klik **Unzip / Extract**.
4. Website backend siap diakses secara online di subdomain MonsterASP Anda (contoh: `https://caffera.runasp.net/swagger`).

> *Panduan deployment cloud lengkap dapat dilihat pada file: **`MONSTERASP_DEPLOYMENT.md`**.*

---

## 🔧 Troubleshooting & Solusi Kendala

| Kendala / Error | Kemungkinan Penyebab | Solusi |
| :--- | :--- | :--- |
| **`'dotnet' is not recognized as an internal or external command`** | .NET 9 SDK belum terinstal atau PATH environment belum terbaca. | Download dan instal **.NET 9.0 SDK**, lalu restart Terminal / Command Prompt Anda. |
| **`Port 5066 already in use`** | Terdapat proses backend sebelumnya yang masih berjalan di latar belakang. | Tutup terminal sebelumnya atau buka Task Manager dan akhiri proses `dotnet.exe`. |
| **`Supabase Connection Timeout / Refused`** | Komputer tidak terhubung ke internet atau firewall kantor/kampus memblokir port 5432. | Pastikan internet aktif, atau gunakan **Opsi Database Lokal (PostgreSQL/SQL Server)** yang dijelaskan di atas. |
| **`HTTP 401 Unauthorized`** | Token JWT belum dimasukkan pada header request atau token telah kedaluwarsa (24 jam). | Lakukan login ulang di `/api/auth/login` dan perbarui Bearer token di tombol **Authorize** Swagger. |
| **`HTTP 403 Forbidden`** | Role pengguna tidak memiliki hak akses (contoh: Kasir mencoba mendaftarkan user baru atau menghapus kategori). | Gunakan akun dengan role `Admin` (`admin@caffera.com`). |
| **`HTTP 429 Too Many Requests`** | Melebihi batas percobaan login (10 request/menit). | Tunggu 1 menit sebelum mencoba mengirim request kembali. |

---

*Project Caffèra — Cafe Management System (UAS Fullstack Development 2026)* ☕🎓🚀
