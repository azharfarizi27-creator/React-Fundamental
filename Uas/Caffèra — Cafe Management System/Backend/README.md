# ☕ Caffèra — Backend API Documentation & Setup Guide

Backend RESTful API untuk sistem manajemen kafe **Caffèra (Cafe Management System)** yang dibangun dengan **ASP.NET Core 9 (C#)**, **Entity Framework Core 9 (Code-First)**, dan **Microsoft SQL Server**.

---

## 📋 Daftar Isi
1. [Fitur Utama & Keunggulan](#-fitur-utama--keunggulan)
2. [Spesifikasi & Software yang Perlu Diinstal](#-spesifikasi--software-yang-perlu-diinstal)
3. [Struktur Direktori Proyek](#-struktur-direktori-proyek)
4. [Langkah-langkah Instalasi & Konfigurasi](#-langkah-langkah-instalasi--konfigurasi)
5. [Akun Default & Seed Data](#-akun-default--seed-data)
6. [Daftar Endpoint API (Routing)](#-daftar-endpoint-api-routing)
7. [Pengujian API via Swagger & HTTP Client](#-pengujian-api-via-swagger--http-client)
8. [Troubleshooting & Solusi Error](#-troubleshooting--solusi-error)

---

## 🚀 Fitur Utama & Keunggulan

- **Arsitektur Berlapis (Layered Clean Architecture)**: Pemisahan concern yang rapi antara `Controllers`, `Services` (Business Logic), `Repositories` (Data Access), dan `DTOs`.
- **Autentikasi & Otorisasi Berbasis Peran (RBAC)**: Menggunakan **JWT (JSON Web Token)** dengan pengelompokan role `Admin` dan `Cashier`.
- **Keamanan Lanjutan**:
  - **BCrypt Password Hashing**: Enkripsi password aman satu arah.
  - **Rate Limiting**: Pencegahan brute-force attack pada endpoint otentikasi.
  - **CORS Configuration**: Mengizinkan integrasi dengan frontend (React / Vite di port `5173` dan `3000`).
  - **Global Exception Middleware**: Menangani runtime error dan mencegah kebocoran informasi database ke response publik.
  - **Custom Request Logging Middleware**: Pencatatan durasi dan status eksekusi HTTP request secara real-time di console.
- **Entity Framework Core 9 Code-First**: Otomatisasi pembuatan skema database, relasi, constraint unik, dan database auto-seeding saat startup.
- **Interaktif Swagger / OpenAPI**: Dokumentasi API otomatis yang mendukung uji coba otentikasi JWT Bearer token langsung dari browser.

---

## 🛠️ Spesifikasi & Software yang Perlu Diinstal

Sebelum menjalankan backend ini, pastikan software berikut telah terpasang di komputer/laptop Anda:

### 1. **.NET 9.0 SDK** *(Wajib)*
- Proyek ini menggunakan target framework **.NET 9.0**.
- **Download**: [https://dotnet.microsoft.com/download/dotnet/9.0](https://dotnet.microsoft.com/download/dotnet/9.0)
- **Cara Verifikasi di Terminal / PowerShell**:
  ```bash
  dotnet --version
  ```
  *(Pastikan output menampilkan versi `9.0.x`)*

### 2. **Database Engine: Microsoft SQL Server** *(Wajib)*
Pilih salah satu dari opsi berikut:
- **Opsi A (Disarankan untuk Windows)**: **SQL Server 2022 Express Edition** (Gratis).
  - [Download SQL Server Express](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
  - Nama instance default biasanya: `.\SQLEXPRESS` atau `(localdb)\mssqllocaldb`.
- **Opsi B (Database Management GUI)**: **SQL Server Management Studio (SSMS)** atau **Azure Data Studio** / ekstensi *mssql* di VS Code untuk melihat tabel dan data secara visual.
  - [Download SSMS](https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms)
- **Opsi C (Docker Container)**:
  ```bash
  docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=YourStrong@Password123" -p 1433:1433 --name caffera-sql -d mcr.microsoft.com/mssql/server:2022-latest
  ```

### 3. **Entity Framework Core CLI Tools** *(Opsional tapi Sangat Disarankan)*
Untuk menjalankan perintah migrasi manual (`dotnet-ef`):
```bash
dotnet tool install --global dotnet-ef
```
*Jika sudah pernah terpasang sebelumnya, jalankan `dotnet tool update --global dotnet-ef`.*

### 4. **Code Editor / IDE**
- **Visual Studio Code** (dengan ekstensi *C# Dev Kit* atau *C# extension*) **ATAU**
- **Visual Studio 2022** (v17.12+ dengan workload *ASP.NET and web development*) **ATAU**
- **JetBrains Rider**.

---

## 📁 Struktur Direktori Proyek

```text
Backend/
├── Controllers/              # Endpoint API Controller (Routing & HTTP Handlers)
│   ├── AuthController.cs
│   ├── CategoriesController.cs
│   ├── DashboardController.cs
│   ├── MenusController.cs
│   ├── OrdersController.cs
│   ├── SalesController.cs
│   └── TablesController.cs
├── Data/                     # DbContext & Inisialisasi Database
│   ├── AppDbContext.cs       # Skema tabel, relasi, & seed data awal
│   └── DbInitializer.cs      # Auto-migration & validasi hash akun bawaan
├── DTOs/                     # Data Transfer Objects (Request/Response Models)
│   ├── Auth/
│   ├── Category/
│   ├── Common/               # ApiResponse wrapper & pagination
│   ├── Dashboard/
│   ├── Menu/
│   ├── Order/
│   ├── Sales/
│   └── Table/
├── Helpers/                  # Helper utilities (JwtHelper, dll.)
├── Middlewares/              # Middleware kustom (Exception & Request Logging)
├── Migrations/               # Snapshot & file migrasi EF Core
├── Models/                   # Entity model database (User, Menu, Order, dll.)
├── Properties/
│   └── launchSettings.json   # Konfigurasi port & profiling lokal (Port: 5066 / 7135)
├── Repositories/             # Abstraksi akses basis data
│   ├── Interfaces/
│   └── Implementations/
├── Services/                 # Business logic layer
│   ├── Interfaces/
│   └── Implementations/
├── appsettings.json          # Konfigurasi database & JWT Key
├── Caffera.Backend.csproj    # File project .NET & daftar dependencies NuGet
├── Caffera.Backend.http      # HTTP Scratchpad untuk pengujian endpoint
└── Program.cs                # Entry point aplikasi & Dependency Injection setup
```

---

## ⚙️ Langkah-langkah Instalasi & Konfigurasi

### 1. Buka Direktori Backend
Buka terminal (PowerShell / Command Prompt / Git Bash) di folder `Backend`:
```bash
cd "c:\React-Fundamental\Uas\Caffèra — Cafe Management System\Backend"
```

### 2. Sesuaikan Konfigurasi Database (`appsettings.json`)
Buka file `appsettings.json`, lalu periksa `ConnectionStrings.DefaultConnection`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.\\SQLEXPRESS;Database=CafferaDb;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
  },
  "Jwt": {
    "Key": "CafferaSecretKey_SuperSecure_UAS_Fullstack_2026_Key_MustBeLongEnough!",
    "Issuer": "CafferaApi",
    "Audience": "CafferaClient",
    "ExpiryInHours": 24
  },
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:5173"
    ]
  }
}
```

> **Catatan Penyesuaian Server SQL:**
> - Jika menggunakan SQL Server default instance: ganti `Server=.\\SQLEXPRESS` menjadi `Server=localhost` atau `Server=.`
> - Jika menggunakan LocalDB bawaan Visual Studio: ganti menjadi `Server=(localdb)\\mssqllocaldb;Database=CafferaDb;Trusted_Connection=True;`
> - Jika menggunakan SQL Server Authentication (Username & Password):  
>   `Server=localhost;Database=CafferaDb;User Id=sa;Password=YourPassword;TrustServerCertificate=True;MultipleActiveResultSets=true`

### 3. Restore Dependencies NuGet
Unduh semua pustaka yang dibutuhkan oleh proyek:
```bash
dotnet restore
```

### 4. Inisialisasi Database & Migrasi
Backend Caffèra dilengkapi dengan **Automatic Migration & Seeder** di `Program.cs` via `DbInitializer.InitializeAsync()`. Saat backend dijalankan, database `CafferaDb` beserta seluruh tabel dan seed data awal akan otomatis dibuat jika belum ada.

*(Opsional)* Jika ingin mengeksekusi migrasi database secara manual via CLI:
```bash
dotnet ef database update
```

### 5. Jalankan Backend API
Jalankan server pengembangan dengan perintah:
```bash
dotnet run
```
*Atau gunakan mode auto-reload saat ada perubahan kode:*
```bash
dotnet watch run
```

---

## 👥 Akun Default & Seed Data

Secara default, database telah diisi otomatis (*seeded*) dengan data kategori, menu lengkap, meja kafe, dan 2 akun pengguna:

| Role | Email | Password | Hak Akses Utama |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@caffera.com` | `admin123` | Akses penuh: Manajemen Pengguna, CRUD Menu & Kategori, CRUD Meja, Seluruh Order, Laporan Penjualan (*Sales Summary* & *History*), serta Dashboard Statistik. |
| **Cashier** | `cashier@caffera.com` | `cashier123` | Point of Sales (POS): Membuat Pesanan Baru, Update Status Pesanan & Pembayaran, Update Status Meja (*Occupied/Available*), Toggle Ketersediaan Menu, dan Melihat Ringkasan Dashboard. |

---

## 📡 Daftar Endpoint API (Routing)

Base URL: `http://localhost:5066` atau `https://localhost:7135`

### 🔐 1. Authentication (`/api/auth`)
| HTTP Method | Endpoint | Role / Auth | Deskripsi |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Publik (Rate-limited) | Login untuk mendapatkan JWT Bearer Token |
| `POST` | `/api/auth/register` | `Admin` (Rate-limited) | Mendaftarkan staf / kasir baru |
| `GET` | `/api/auth/profile` | Authenticated (Semua Role) | Mengambil profil user yang sedang login |
| `GET` | `/api/auth/users` | `Admin` | Mengambil daftar seluruh user/staf |

### 📂 2. Categories (`/api/categories`)
| HTTP Method | Endpoint | Role / Auth | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/categories` | Publik | Mendapatkan seluruh kategori menu |
| `GET` | `/api/categories/{id}` | Publik | Mendapatkan detail kategori berdasarkan ID |
| `POST` | `/api/categories` | `Admin` | Menambahkan kategori baru |
| `PUT` | `/api/categories/{id}` | `Admin` | Memperbarui nama/deskripsi kategori |
| `DELETE` | `/api/categories/{id}` | `Admin` | Menghapus kategori (*restricted* jika ada menu aktif) |

### 🍽️ 3. Menus (`/api/menus`)
| HTTP Method | Endpoint | Role / Auth | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/menus` | Publik | List menu (Mendukung search, filter `categoryId`, `isAvailable`, & pagination) |
| `GET` | `/api/menus/{id}` | Publik | Detail menu berdasarkan ID |
| `POST` | `/api/menus` | `Admin` | Menambahkan item menu baru |
| `PUT` | `/api/menus/{id}` | `Admin` | Memperbarui data menu |
| `DELETE` | `/api/menus/{id}` | `Admin` | Menghapus menu |
| `PATCH` | `/api/menus/{id}/toggle-availability` | `Admin`, `Cashier` | Mengubah status ketersediaan menu (Tersedia / Habis) |

### 🪑 4. Tables (`/api/tables`)
| HTTP Method | Endpoint | Role / Auth | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tables` | Publik | List seluruh meja (Mendukung filter query `?status=Available`) |
| `GET` | `/api/tables/{id}` | Publik | Detail meja berdasarkan ID |
| `POST` | `/api/tables` | `Admin` | Menambahkan meja baru |
| `PUT` | `/api/tables/{id}` | `Admin` | Memperbarui nomor meja & kapasitas |
| `PATCH` | `/api/tables/{id}/status` | `Admin`, `Cashier` | Mengubah status meja (`Available`, `Occupied`, `Reserved`) |
| `DELETE` | `/api/tables/{id}` | `Admin` | Menghapus meja |

### 🧾 5. Orders (`/api/orders`)
| HTTP Method | Endpoint | Role / Auth | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/orders` | Authenticated | Mengambil riwayat pesanan (filter: status, rentang tanggal, search, pagination) |
| `GET` | `/api/orders/{id}` | Authenticated | Detail pesanan beserta item rinciannya |
| `GET` | `/api/orders/number/{orderNumber}` | Authenticated | Mencari pesanan berdasarkan nomor struk/kode order |
| `POST` | `/api/orders` | Authenticated | Membuat pesanan baru (POS checkout) |
| `PATCH` | `/api/orders/{id}/status` | Authenticated | Memperbarui status pesanan (`Pending`, `Preparing`, `Completed`, `Cancelled`) |
| `DELETE` | `/api/orders/{id}/cancel` | Authenticated | Membatalkan pesanan |

### 📊 6. Sales & Reports (`/api/sales`)
| HTTP Method | Endpoint | Role / Auth | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/sales/history` | Authenticated | Riwayat transaksi penjualan |
| `GET` | `/api/sales/summary` | Authenticated | Ringkasan omzet, total transaksi, rata-rata order, dan menu terlaris |

### 📈 7. Dashboard (`/api/dashboard`)
| HTTP Method | Endpoint | Role / Auth | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/dashboard/stats` | Authenticated | Ringkasan metrik statistik real-time untuk kartu dashboard utama |

---

## 🧪 Pengujian API via Swagger & HTTP Client

### 1. Menggunakan Swagger UI (Browser)
1. Jalankan backend (`dotnet run`).
2. Buka browser ke alamat: **[http://localhost:5066/swagger](http://localhost:5066/swagger)**
3. Untuk mengakses endpoint yang terproteksi:
   - Eksekusi endpoint `POST /api/auth/login` dengan akun admin atau kasir.
   - Salin string token dari `data.token`.
   - Klik tombol **Authorize (ikon gembok)** di pojok kanan atas Swagger UI.
   - Masukkan format: `Bearer <token_anda>` lalu klik **Authorize**.

### 2. Menggunakan File `Caffera.Backend.http`
Jika menggunakan VS Code (dengan ekstensi *REST Client*) atau Visual Studio, Anda dapat memanfaatkan file `Caffera.Backend.http` yang tersedia di root folder Backend untuk mengirim HTTP request secara cepat.

---

## 🔧 Troubleshooting & Solusi Error

| Kendala / Error | Kemungkinan Penyebab | Solusi |
| :--- | :--- | :--- |
| **`Cannot connect to SQL Server / A network-related or instance-specific error`** | Service SQL Server belum running atau nama instance salah. | Buka **Services.msc** di Windows, pastikan service **SQL Server (SQLEXPRESS)** dalam status **Running**. Periksa kembali Connection String di `appsettings.json`. |
| **`HTTP 401 Unauthorized`** | Token JWT belum disertakan atau sudah kedaluwarsa. | Login ulang melalui `/api/auth/login` dan sertakan header `Authorization: Bearer <token_baru>`. |
| **`HTTP 403 Forbidden`** | Role pengguna tidak memiliki hak akses ke endpoint tersebut. | Pastikan menggunakan akun dengan role yang sesuai (misal: hanya role `Admin` yang bisa menghapus kategori atau mendaftarkan user baru). |
| **`HTTP 429 Too Many Requests`** | Melewati batas rate limit pada endpoint login/register (maks. 10 req/menit). | Tunggu 1 menit sebelum mengirim request login kembali. |
| **`CORS Error pada Frontend React`** | Port frontend React berbeda dari yang didaftarkan. | Tambahkan port frontend Anda ke bagian `Cors.AllowedOrigins` di file `appsettings.json` (misal: `"http://localhost:5174"`). |

---

*Selamat mengembangkan dan menggunakan Caffèra Backend API! ☕✨*
