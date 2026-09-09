# 🚀 Panduan Lengkap Deploy Backend Caffèra ke MonsterASP.NET (Database: PostgreSQL Cloud Gratis)

Panduan langkah demi langkah untuk mendeploy backend **Caffèra API (ASP.NET Core 9)** ke hosting **MonsterASP.NET** dengan basis data **PostgreSQL Cloud Gratis (Supabase / Neon / Render / Aiven)**.

---

## 📑 Daftar Isi
1. [Prasyarat & File yang Sudah Disediakan](#1-prasyarat--file-yang-sudah-disediakan)
2. [Langkah 1: Buat Database PostgreSQL Gratis (Supabase / Neon)](#langkah-1-buat-database-postgresql-gratis-supabase--neon)
3. [Langkah 2: Buat Web Site di MonsterASP.NET](#langkah-2-buat-web-site-di-monsteraspnet)
4. [Langkah 3: Konfigurasi Connection String PostgreSQL di Project](#langkah-3-konfigurasi-connection-string-postgresql-di-project)
5. [Langkah 4: Build & Publish Project (publish.bat)](#langkah-4-build--publish-project-publishbat)
6. [Langkah 5: Upload ke File Manager MonsterASP.NET](#langkah-5-upload-ke-file-manager-monsteraspnet)
7. [Langkah 6: Uji Coba & Akses Swagger Online](#langkah-6-uji-coba--akses-swagger-online)
8. [Langkah 7: Hubungkan ke Frontend React](#langkah-7-hubungkan-ke-frontend-react)
9. [Troubleshooting & Solusi Error](#troubleshooting--solusi-error)

---

## 1. Prasyarat & File yang Sudah Disediakan

Backend Caffèra kini mendukung **Hybrid Database**:
- Secara lokal bisa tetap menggunakan SQL Server atau PostgreSQL.
- Di MonsterASP.NET secara otomatis mendeteksi dan menghubungkan ke **PostgreSQL**.

File pendukung yang sudah siap:
- **`web.config`**: Konfigurasi IIS server dan handler `AspNetCoreModuleV2`.
- **`appsettings.Production.json`**: Konfigurasi khusus PostgreSQL dan Swagger aktif.
- **`publish.bat`**: Script satu-klik untuk build release dan kompresi otomatis ke `publish.zip`.

---

## Langkah 1: Buat Database PostgreSQL Gratis (Supabase / Neon)

Pilih salah satu penyedia PostgreSQL cloud gratis:

### Opsi A: Supabase (Sangat Direkomendasikan ⭐)
1. Buka [https://supabase.com](https://supabase.com) dan login/daftar gratis dengan akun GitHub/Email.
2. Klik **New Project** ➔ beri nama project (misal: `caffera-db`).
3. Tentukan **Database Password** yang kuat (ingat dan simpan password ini).
4. Pilih Region terdekat: **Singapore (ap-southeast-1)**.
5. Klik **Create new project**.
6. Setelah project siap (sekitar 1-2 menit):
   - Masuk ke menu **Project Settings** (ikon gear di kiri bawah) ➔ **Database**.
   - Scroll ke bagian **Connection string** ➔ pilih tab **URI** atau **Parameters**.
   - Catat: **Host**, **Database Name** (`postgres`), **Port** (`5432` atau `6543`), **User** (`postgres`), dan **Password** Anda.

### Opsi B: Neon.tech (Alternatif Cepat)
1. Buka [https://neon.tech](https://neon.tech) dan login/daftar.
2. Buat project baru (misal: `caffera-db`).
3. Salin langsung **Connection Details / Connection String** yang diberikan di Dashboard Neon.

---

## Langkah 2: Buat Web Site di MonsterASP.NET

1. Kunjungi [https://www.monsterasp.net](https://www.monsterasp.net) dan masuk ke **Control Panel**.
2. Klik menu **Web Sites** ➔ **Create Web Site**.
3. Masukkan nama subdomain (contoh: `caffera.runasp.net` atau `caffera-api.monsterasp.net`).
4. Pada pilihan framework, pastikan memilih **ASP.NET Core 9.x**.
5. Simpan / Klik **Create**.

---

## Langkah 3: Konfigurasi Connection String PostgreSQL di Project

Buka file **`appsettings.Production.json`** di folder backend lokal Anda:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=aws-0-ap-southeast-1.pooler.supabase.com;Port=5432;Database=postgres;Username=postgres.xxxx;Password=YOUR_PASSWORD;SSL Mode=Require;Trust Server Certificate=true"
  },
  "DatabaseProvider": "PostgreSQL",
  "Jwt": {
    "Key": "CafferaSecretKey_Production_Secure_UAS_Fullstack_2026_Key_MustBeLongEnough!",
    "Issuer": "CafferaApi",
    "Audience": "CafferaClient",
    "ExpiryInHours": 24
  },
  "EnableSwagger": true,
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
      "https://*.vercel.app",
      "https://*.netlify.app",
      "https://*.monsterasp.net"
    ]
  }
}
```

> **Catatan Penyesuaian:**
> Masukkan Host, Port, Username, dan Password yang Anda dapatkan dari Supabase atau Neon.

---

## Langkah 4: Build & Publish Project (`publish.bat`)

Setelah connection string diisi, jalankan file **`publish.bat`**:

```bash
cd "c:\React-Fundamental\Uas\Caffèra — Cafe Management System\Backend"
.\publish.bat
```
Script ini akan menghasilkan file zip siap upload: **`publish.zip`**.

---

## Langkah 5: Upload ke File Manager MonsterASP.NET

1. Di Control Panel MonsterASP.NET, buka menu **Files** (File Manager).
2. Klik folder kuning **`wwwroot`** (path `/wwwroot`).
3. Jika ada file bawaan default, hapus terlebih dahulu.
4. Klik tombol biru **`Upload file`** di bagian atas, lalu pilih file **`publish.zip`** dari komputer Anda.
5. Setelah ter-upload, klik tombol **Unzip / Extract** pada `publish.zip`.
6. Pastikan file-file seperti `Caffera.Backend.dll`, `web.config`, `appsettings.json`, dan `appsettings.Production.json` berada langsung di dalam folder `/wwwroot`.
7. Hapus file `publish.zip` dari File Manager.

---

## Langkah 6: Uji Coba & Akses Swagger Online

1. Buka browser dan kunjungi URL website Anda:
   ```text
   https://caffera.runasp.net/swagger
   ```
2. Halaman **Caffèra API v1 Swagger** akan terbuka.
3. Backend akan **otomatis membuat tabel, relasi, dan seed data awal** di database PostgreSQL Anda!
   - **Admin**: `admin@caffera.com` | Password: `admin123`
   - **Cashier**: `cashier@caffera.com` | Password: `cashier123`
4. Coba lakukan pengujian login di Swagger pada endpoint `POST /api/auth/login`.

---

## Langkah 7: Hubungkan ke Frontend React

Ubah nilai URL API di file `.env.production` pada folder frontend React Anda:
```env
VITE_API_URL=https://caffera.runasp.net/api
```

---

## 🛠️ Troubleshooting & Solusi Error

| Error | Penyebab | Solusi |
| :--- | :--- | :--- |
| **`HTTP 500.30 - InProcess Startup Failure`** | Password atau Host PostgreSQL di `appsettings.Production.json` salah / connection string tidak valid. | 1. Buka `web.config` di File Manager MonsterASP.NET, ubah `stdoutLogEnabled="true"`.<br>2. Buat folder `logs` di `/wwwroot`.<br>3. Refresh website, periksa file log di dalam folder `logs` untuk melihat rincian error koneksi. |
| **`Connection refused / Timeout`** | Port atau SSL Mode belum sesuai. | Pastikan ada parameter `SSL Mode=Require;Trust Server Certificate=true` pada Connection String PostgreSQL Anda. |
| **`CORS Error dari Vercel / Netlify`** | Domain frontend belum terdaftar. | Tambahkan URL frontend ke array `Cors.AllowedOrigins` di file `appsettings.Production.json`. |

---

*Backend Caffèra kini siap dijalankan di MonsterASP.NET dengan database PostgreSQL gratis! ☕🚀*
