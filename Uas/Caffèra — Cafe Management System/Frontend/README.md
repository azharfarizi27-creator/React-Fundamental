# ☕ Caffèra — Modern Cafe Management System & Point of Sales (POS)

> **Proyek Akhir / UAS Pelatihan React Fundamental**  
> Aplikasi Web Manajemen Operasional Café & Kasir POS berbasis **React 18, Vite, Tailwind CSS v3, React Router DOM v6, React Context API**, didukung oleh **ASP.NET Core 9 REST API** dan dilengkapi fitur tangguh **Dual-Engine LocalStorage Mock Database**.

---

## 📌 Identitas Proyek

* **Nama Pengembang:** Azhar Farizi
* **Tema Proyek:** Sistem Manajemen Kafe & Point of Sales (POS)
* **Nama Aplikasi:** Caffèra (*Caffèra — Modern Cafe Management System*)
* **Repository GitHub:** [https://github.com/azharfarizi27-creator/React-Fundamental](https://github.com/azharfarizi27-creator/React-Fundamental)
* **Target Deployment:** Vercel (Frontend SPA Ready)

---

## 📖 A. Tentang Aplikasi

**Caffèra** adalah platform manajemen operasional kafe terpadu yang dirancang dengan konsep antarmuka *Clean Studio Editorial* (terinspirasi dari tipografi modern, palet warm-amber, dan layout minimalis responsif). 

Aplikasi ini mendigitalisasi seluruh rantai operasional kafe dari hulu ke hilir:
1. **Pelanggan:** Memesan langsung dari meja melalui fitur **QR Self-Order** tanpa perlu antre di kasir.
2. **Kasir / Barista:** Melayani transaksi cepat di kasir melalui sistem **Point of Sales (POS)** lengkap dengan kalkulasi pajak PB1, voucher promo, dan multi-metode pembayaran.
3. **Dapur & Barista:** Memantau antrean masak secara *real-time* melalui **Kitchen Display System (KDS)** interaktif dengan notifikasi suara lonceng (*Web Audio Chime*).
4. **Pengelola / Admin:** Mengelola katalog menu, kategori, denah meja, data staf, dan menganalisis performa bisnis melalui **Dashboard & Laporan Penjualan (AOV & Omset)**.

---

## ✨ B. Daftar Fitur Unggulan

### 1. 🔐 Modul Autentikasi & Role-Based Access Control (RBAC)
* **3 Role Pengguna:**
  * **Admin:** Akses penuh ke seluruh fitur (Menu, Kategori, Meja, Pesanan, Laporan Penjualan, dan Kelola Staf).
  * **Cashier:** Akses operasional kasir (POS Checkout, Manajemen Status Meja, dan List Pesanan).
  * **Kitchen:** Akses khusus dapur (otomatis diarahkan ke *Kitchen Display System / KDS*).
* **1-Click Quick Demo Login:** Tombol login instan untuk Admin, Cashier, dan Kitchen guna mempermudah proses penilaian.
* **Header Role Switcher:** Dropdown cepat pada header untuk berpindah role secara instan tanpa perlu logout-login ulang.
* **Session Persistence:** Penyimpanan token autentikasi aman dengan *Protected Route Guard*.

### 2. 📊 Modul Dashboard Analitik Operasional
* Kartu metrik *real-time*: Total Pendapatan Hari Ini, Pesanan Aktif, Total Menu, dan Okupansi Meja.
* Grafik visual batang (*bar chart*) tren omset 7 hari terakhir.
* Daftar produk terlaris (*Top Selling Items*) dan tabel transaksi pesanan terbaru.

### 3. 🍽️ Modul Katalog Menu (CRUD Lengkap + Filter Canggih)
* **CRUD Penuh:** Tambah menu baru, edit informasi & gambar, serta hapus menu dengan konfirmasi.
* **Pencarian Real-Time:** Filter instan berdasarkan nama menu atau deskripsi menggunakan `.filter()`.
* **Filter Kategori (Pill Tabs):** Pengelompokan cepat (*Semua, Coffee, Non-Coffee, Pastry, Main Course, dll.*).
* **Sorting Fleksibel:** Pengurutan berdasarkan Harga (Terendah / Tertinggi) dan Nama (A-Z / Z-A) menggunakan `.sort()`.
* **Paginasi Dinamis:** Perhitungan halaman otomatis (`Math.ceil()`) dengan tombol *Previous/Next* responsif.
* **Halaman Detail Menu:** Rute dinamis `/menus/:id` memanfaatkan hook `useParams()`.

### 4. 🏷️ Modul Kategori Produk
* Modal CRUD Kategori (Tambah, Edit, Hapus kategori).
* Indikator jumlah menu aktif yang terdaftar di setiap kategori.

### 5. 🪑 Modul Denah Meja & Okupansi Real-Time
* Visual denah meja kafe dengan indikator status:
  * 🟢 **Available (Kosong)**
  * 🟡 **Occupied (Terisi)**
  * 🟣 **Reserved (Dipesan)**
* Modal ubah status meja cepat (*Quick Status Update*).
* Tombol *Direct POS Checkout* langsung dari kartu meja.
* Modal QR Code Meja untuk akses mandiri pelanggan (*Self-Order QR*).

### 6. 📱 Modul Customer Self-Order Meja (Tanpa Login)
* Rute publik `/table-order/:tableNumber` (bisa diakses tamu melalui scan QR meja).
* Antarmuka *mobile-first* yang intuitif untuk memilih makanan & minuman.
* Keranjang tamu mandiri dengan catatan khusus porsi (*notes*).
* Pesanan yang dikirim tamu otomatis langsung masuk ke antrean **Kitchen Display System (KDS)**.

### 7. 💳 Modul Point of Sales (POS Kasir & Checkout)
* Katalog menu visual 2-kolom dengan integrasi keranjang belanja kasir.
* Pengaturan kuantiti (+ / -), custom notes per item, dan hapus item.
* Opsi pesanan: **Dine In** (wajib pilih nomor meja) atau **Take Away** (bungkus).
* Perhitungan otomatis **Subtotal**, **Pajak Restoran PB1 (10%)**, dan **Grand Total**.
* **Voucher Promo Diskon:** Input kode kupon potongan harga (*DISKON10*, *HEMAT20*, *CAFFERALOVER*).
* **Modal Multi-Pembayaran:** Mendukung metode **Tunai (Cash)** dengan kalkulator uang kembalian, **QRIS**, dan **Kartu Debit**.

### 8. 👨‍🍳 Modul Kitchen Display System (KDS Dapur)
* Papan **Kanban 3 Kolom Alur Masak**:
  1. `Baru Masuk (Pending)` $\rightarrow$ Tombol *Mulai Masak*
  2. `Sedang Dimasak (Preparing)` $\rightarrow$ Tombol *Siap Saji*
  3. `Siap Disajikan (Ready)` $\rightarrow$ Tombol *Diantar / Selesai*
* **Real-time Auto-Polling (4 Detik)**: Memperbarui antrean otomatis tanpa refresh manual.
* **Web Audio Chime Notifikasi**: Membunyikan nada lonceng otomatis saat ada pesanan baru masuk dari kasir atau self-order meja.
* Jam digital *live* dan durasi waktu tunggu pesanan (*elapsed time*).

### 9. 🧾 Modul Riwayat Pesanan & Cetak Struk Kasir
* Daftar riwayat seluruh pesanan dengan filter status dan tipe order.
* Halaman rincian pesanan `/orders/:id`.
* Modal cetak struk nota kasir digital (*Digital Receipt Modal*) dengan format struk belanja kafe standar.

### 10. 📈 Modul Laporan Penjualan & Keuangan (Admin Only)
* Filter rentang tanggal transaksi (*Date Range Picker*).
* Metrik finansial: Total Omset Kotor, Total Transaksi Selesai, dan **Average Order Value (AOV)**.
* Tabel audit seluruh transaksi sukses.

### 11. 👥 Modul Manajemen Staf / Karyawan (Admin Only)
* Daftar staf kafe, informasi akun, jabatan/role (*Admin, Cashier, Kitchen*), dan status aktif.

---

## 🛠️ C. Teknologi & Library yang Digunakan

### 🖥️ Frontend Stack
| Kategori | Teknologi / Library | Kegunaan |
| :--- | :--- | :--- |
| **Core Framework** | **React 18** (`react`, `react-dom`) | Library UI berbasis komponen fungsional |
| **Build Tool** | **Vite 5** | Bundler modern berkecepatan tinggi |
| **Package Manager** | **pnpm** / npm | Manajemen dependensi efisien |
| **Styling** | **Tailwind CSS v3**, PostCSS, Autoprefixer | Utility-first styling (Studio Aesthetic) |
| **Routing** | **React Router DOM v6** | Client-side routing, protected routes, `useParams`, `useNavigate` |
| **State Management** | **React Context API** | `AuthContext`, `OrderContext`, `ToastContext` |
| **HTTP Client** | **Axios** | Interceptor JWT, error handler, dan endpoint REST API |
| **Icons** | **Lucide React** | Koleksi ikon modern & minimalis |
| **Class Utilities** | `clsx`, `tailwind-merge` | Penggabungan class conditional yang aman |
| **Deployment** | **Vercel** (`vercel.json`) | Single Page Application (SPA) URL rewrite configuration |

### ⚙️ Backend Stack (Opsional)
| Kategori | Teknologi / Library | Kegunaan |
| :--- | :--- | :--- |
| **Framework & Runtime** | **ASP.NET Core 9 Web API** (.NET 9 / C#) | Backend RESTful API berperforma tinggi |
| **Database & ORM** | **Microsoft SQL Server** & **EF Core 9** | Relational Database & Entity Framework ORM |
| **Authentication** | **JWT Bearer** & **BCrypt.Net-Next** | Token autentikasi aman & hashing password |
| **API Docs** | **Swagger UI / OpenAPI** (`Swashbuckle`) | Dokumentasi interaktif endpoint API di `/swagger` |
| **Architecture** | **Repository Pattern & Services** | Separation of concerns yang rapi dan modular |

---

## 📁 D. Struktur Folder Proyek

```
Caffèra/
├── Backend/                         # ASP.NET Core 9 Web API
│   ├── Controllers/                 # Auth, Menus, Categories, Tables, Orders, Sales, Users
│   ├── Models/                      # Entitas Database & DTOs
│   ├── Data/                        # AppDbContext & Migrations
│   ├── Repositories/                # Repository Pattern Implementations & Interfaces
│   ├── Services/                    # Business Logic Layer
│   ├── Program.cs                   # DI, JWT, Swagger, & CORS Configuration
│   └── appsettings.json             # Koneksi Database SQL Server & JWT Secret
│
└── Frontend/                        # React 18 + Vite SPA
    ├── public/                      # Static assets & favicon
    ├── src/
    │   ├── components/
    │   │   ├── category/            # CategoryFormModal.jsx
    │   │   ├── common/              # Button, Card, Badge, Modal, Pagination, SearchInput, StatCard, EmptyState
    │   │   ├── menu/                # MenuCard, MenuFormModal, MenuFilterBar
    │   │   ├── order/               # OrderItemCard, OrderReceiptModal, OrderStatusBadge, PaymentModal
    │   │   └── table/               # TableCard, TableStatusModal, TableQrModal
    │   ├── context/
    │   │   ├── AuthContext.jsx      # Autentikasi, JWT, Role Switcher (Admin/Cashier/Kitchen)
    │   │   ├── OrderContext.jsx     # POS Cart state, PB1 Tax, Voucher Diskon, Kalkulasi Total
    │   │   └── ToastContext.jsx     # Global toast notification provider
    │   ├── layouts/
    │   │   ├── MainLayout.jsx       # Studio sidebar, navigation bar, & header quick controls
    │   │   └── AuthLayout.jsx       # Split-screen responsive login layout
    │   ├── pages/
    │   │   ├── auth/                # LoginPage.jsx (1-Click Demo Login)
    │   │   ├── categories/          # CategoryListPage.jsx
    │   │   ├── customer/            # TableSelfOrderPage.jsx (/table-order/:tableNumber)
    │   │   ├── dashboard/           # DashboardPage.jsx
    │   │   ├── kitchen/             # KitchenDisplayPage.jsx (KDS Real-time Kanban + Chime)
    │   │   ├── menus/               # MenuListPage.jsx, MenuDetailPage.jsx (useParams)
    │   │   ├── orders/              # OrderListPage.jsx, CreateOrderPage.jsx (POS), OrderDetailPage.jsx
    │   │   ├── sales/               # SalesHistoryPage.jsx (Laporan Omset & AOV)
    │   │   ├── tables/              # TableListPage.jsx (Denah Meja & Status)
    │   │   ├── users/               # StaffListPage.jsx (Kelola Karyawan)
    │   │   └── NotFoundPage.jsx     # 404 Route Catch-All
    │   ├── routes/
    │   │   ├── AppRoutes.jsx        # Deklarasi seluruh routing aplikasi
    │   │   └── ProtectedRoute.jsx   # Route guard berbasis hak akses Role
    │   ├── services/
    │   │   ├── api.js               # Axios instance + LocalStorage Fallback Mock Engine
    │   │   ├── authService.js, menuService.js, orderService.js, tableService.js, ...
    │   │   └── mockData.js          # Data awal (Seed Data)
    │   ├── utils/
    │   │   ├── constants.js         # Mapping warna status badge & voucher promo
    │   │   └── formatters.js        # formatRupiah, formatDateTime, Rest Parameters
    │   ├── App.jsx
    │   ├── index.css                # Konfigurasi Tailwind (@tailwind base; components; utilities;)
    │   └── main.jsx
    ├── vercel.json                  # SPA routing rewrite rule untuk Vercel deployment
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

---

## 🚀 E. Panduan Menjalankan Aplikasi

### 1. Menjalankan Frontend (Cepat & Mandiri)

Frontend dilengkapi dengan **LocalStorage Mock Engine**, sehingga dapat langsung dijalankan tanpa harus menginstal database/backend eksternal:

```bash
# 1. Masuk ke direktori Frontend
cd Frontend

# 2. Install dependencies (bisa menggunakan pnpm atau npm)
pnpm install
# atau
npm install

# 3. Jalankan development server
pnpm dev
# atau
npm run dev
```

Buka browser pada alamat: **`http://localhost:5173`**

---

### 2. Menjalankan Backend ASP.NET Core (Opsional)

Jika ingin menghubungkan Frontend dengan backend ASP.NET Core 9 dan database SQL Server:

```bash
# 1. Masuk ke direktori Backend
cd Backend

# 2. Restore dependensi .NET
dotnet restore

# 3. Jalankan migrasi database SQL Server
dotnet ef database update

# 4. Jalankan server API
dotnet run
```

* **Swagger UI API Docs:** `http://localhost:5066/swagger`
* **Base API URL:** `http://localhost:5066/api`

> *Catatan: Jika Backend tidak dijalankan, Frontend secara otomatis 100% beralih ke **LocalStorage Mock Engine** sehingga seluruh fitur CRUD, login, POS, QR Self-Order, KDS dapur, dan laporan tetap berfungsi lancar tanpa error.*

---

## 🔑 F. Akun Demo Pengujian & Penilaian

Gunakan tombol **1-Click Quick Demo Login** pada halaman Login atau gunakan kredensial berikut:

| Role | Email | Password | Hak Akses Utama |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@caffera.com` | `Admin123!` | Akses Penuh ke seluruh modul (Menu, Meja, POS, KDS, Laporan, Staf) |
| **Cashier** | `cashier@caffera.com` | `Cashier123!` | Kasir POS, Manajemen Meja, List Pesanan, dan KDS |
| **Kitchen** | `kitchen@caffera.com` | `Kitchen123!` | Khusus Layar Dapur (KDS) & Pemrosesan Pesanan Masuk |

---

## 🎟️ G. Kode Voucher Promo POS (Testing Diskon)

Masukkan kode berikut pada modal pembayaran kasir POS untuk menguji fitur diskon:
* **`DISKON10`** : Potongan diskon 10% dari total pesanan.
* **`HEMAT20`** : Potongan langsung Rp 20.000.
* **`CAFFERALOVER`** : Potongan spesial member Rp 50.000.

---

## 🎯 H. Pemetaan Checklist Ketentuan Proyek React Fundamental

Seluruh kriteria teknis kurikulum React Fundamental telah terpenuhi 100%:

- [x] **JavaScript Modern (ES6+)**: Penggunaan `let`/`const`, Arrow Functions, Template Literals, Destructuring, Spread Operator (`...`), dan Rest Parameters (`calculateTotalSum`, `combineLabels`).
- [x] **Vite & Clean Project Structure**: Manajemen paket rapi dengan dependensi terkontrol di `package.json`.
- [x] **Komponen Modular & Reusable**: `Button`, `Card`, `Badge`, `Modal`, `Pagination`, `SearchInput`, `StatCard`, dan `EmptyState`.
- [x] **Tailwind CSS v3**: Desain modern, konsisten, responsif di mobile & desktop tanpa inline-style berlebih.
- [x] **List Rendering & Unique Keys**: Pemanfaatan `.map()` dengan `key={item.id}` unik di seluruh daftar data.
- [x] **Conditional Rendering**: State data kosong, loading spinner, status badge dinamis, dan hak akses tombol berdasarkan role.
- [x] **Event Handling**: Penanganan `onClick`, `onChange`, `onSubmit`, dan pencegahan *default form behavior*.
- [x] **State Management (`useState` & `useEffect`)**: Manajemen data lokal form, pencarian, filter, modal, dan timer/chime.
- [x] **Context API**: `AuthContext` (JWT & Multi-role), `OrderContext` (POS Cart & Tax), dan `ToastContext` (Global Notifications).
- [x] **React Router DOM v6**: `BrowserRouter`, `Routes`, `Route`, `NavLink`, `useParams()` (Detail Menu & Meja), `useNavigate()`, dan `ProtectedRoute`.
- [x] **Operasi CRUD Lengkap**: Create, Read (List & Detail), Update, dan Delete dengan dialog konfirmasi.
- [x] **Pencarian, Filter, & Sorting**: Integrasi `.filter()` real-time dan `.sort()` multi-kriteria.
- [x] **Paginasi Dinamis**: Pembagian halaman otomatis dengan perhitungan `Math.ceil()`.
- [x] **Vercel Ready**: Dilengkapi konfigurasi `vercel.json` untuk mencegah issue 404 saat *direct URL access* atau *page refresh*.

---

© 2026 **Caffèra Cafe Management System** — Dikembangkan oleh **Azhar Farizi** untuk Proyek Akhir React Fundamental.
