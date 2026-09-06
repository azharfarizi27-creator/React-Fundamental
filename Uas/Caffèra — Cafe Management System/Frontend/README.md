# Caffèra — Cafe Management System (Frontend)

Aplikasi manajemen operasional café modern berbasis **React JS, Vite, Tailwind CSS, React Router v6, Context API, dan Axios**. Dikembangkan untuk memenuhi tugas besar / UAS mata kuliah **React Fundamental**.

---

## 🚀 Tech Stack

- **Framework & Tooling**: React 18, Vite, pnpm
- **Styling**: Tailwind CSS (Warm Artisan Coffee Theme, Glassmorphism, Responsive)
- **Routing**: React Router v6 (`useParams`, `useNavigate`, `useLocation`, Protected Routes)
- **State Management**: React Context API (`AuthContext`, `OrderContext`, `ToastContext`)
- **HTTP Client**: Axios (dengan Interceptor JWT & LocalStorage Mock Fallback Engine)
- **Icons**: Lucide React

---

## 📋 Pemetaan Requirement UAS React Fundamental

| No | Requirement UAS | Implementasi di Caffèra | Lokasi File |
| :--- | :--- | :--- | :--- |
| 1 | **JSX Syntax** | Seluruh komponen dan tampilan antarmuka dibangun dengan JSX standar modern | `src/**/*.jsx` |
| 2 | **Reusable Components** | Navbar, Sidebar, Card, Button, Modal, Badge, Pagination, SearchInput, StatCard, EmptyState, dll | `src/components/common/*` |
| 3 | **Props Passing** | MenuCard, OrderItemCard, TableCard, Pagination, StatCard menerima konfigurasi dinamis via props | `src/components/**/*` |
| 4 | **Rendering List (`.map()`)** | Digunakan pada katalog menu, daftar kategori, denah meja, pesanan, dan grafik tren penjualan | `MenuListPage.jsx`, `DashboardPage.jsx`, `OrderListPage.jsx` |
| 5 | **Filtering (`.filter()`)** | Pencarian real-time menu/order, filter status meja, filter kategori, filter ketersediaan | `menuService.js`, `orderService.js`, `CreateOrderPage.jsx` |
| 6 | **Sorting (`.sort()`)** | Pengurutan harga menu (terendah/tertinggi), nama (A-Z/Z-A), dan tanggal transaksi terbaru | `menuService.js`, `MenuFilterBar.jsx` |
| 7 | **State Management (`useState`, `useEffect`)** | Pengelolaan form input, modal state, paginasi, active tab, data fetch lifecycle | `src/pages/**/*.jsx` |
| 8 | **Context API** | - `AuthContext` (User session, JWT token, role Admin/Cashier)<br>- `OrderContext` (Active POS cart, item subtotal & tax calculation)<br>- `ToastContext` (Global toast notifications) | `src/context/*` |
| 9 | **React Router & `useParams()`** | - `/menus/:id` (Detail menu produk)<br>- `/orders/:id` (Detail transaksi & cetak struk)<br>- Protected Route Guard | `src/pages/menus/MenuDetailPage.jsx`, `src/pages/orders/OrderDetailPage.jsx`, `AppRoutes.jsx` |
| 10 | **Form & Validation** | Form tambah/edit menu, form kategori, form meja, form checkout POS | `MenuFormModal.jsx`, `CategoryFormModal.jsx`, `LoginPage.jsx` |
| 11 | **Conditional Rendering** | Indikator stok ketersediaan, status badge (Available/Occupied/Reserved), empty state | `MenuCard.jsx`, `TableCard.jsx`, `EmptyState.jsx` |
| 12 | **Responsive UI** | Layout responsif desktop, tablet, dan mobile drawer | `MainLayout.jsx` |

---

## 🛠️ Cara Menjalankan Project

### 1. Install Dependencies
```bash
pnpm install
# atau
npm install
```

### 2. Jalankan Mode Development
```bash
pnpm dev
# atau
npm run dev
```
Aplikasi akan aktif di `http://localhost:5173`.

### 3. Akun Demo untuk Pengujian & Penilaian
Aplikasi dilengkapi tombol **1-Click Quick Login** di halaman `/login`:
- **Akun Admin**: `admin@caffera.com` / `Admin123!` (Akses penuh seluruh modul & fitur CRUD)
- **Akun Cashier**: `cashier@caffera.com` / `Cashier123!` (Akses POS Order, update status order, dan sales)

---

## 📁 Struktur Direktori

```
src/
├── components/
│   ├── category/     # CategoryFormModal
│   ├── common/       # Button, Card, Badge, Modal, Pagination, SearchInput, StatCard, Toast, EmptyState
│   ├── menu/         # MenuCard, MenuFormModal, MenuFilterBar
│   ├── order/        # OrderItemCard, OrderStatusBadge, OrderReceiptModal
│   └── table/        # TableCard, TableStatusModal
├── context/
│   ├── AuthContext.jsx
│   ├── OrderContext.jsx
│   └── ToastContext.jsx
├── layouts/
│   ├── MainLayout.jsx
│   └── AuthLayout.jsx
├── pages/
│   ├── auth/         # LoginPage.jsx
│   ├── categories/   # CategoryListPage.jsx
│   ├── dashboard/    # DashboardPage.jsx
│   ├── menus/        # MenuListPage.jsx, MenuDetailPage.jsx (useParams)
│   ├── orders/       # OrderListPage.jsx, CreateOrderPage.jsx, OrderDetailPage.jsx (useParams)
│   ├── sales/        # SalesHistoryPage.jsx
│   └── NotFoundPage.jsx
├── routes/
│   ├── AppRoutes.jsx
│   └── ProtectedRoute.jsx
├── services/
│   ├── api.js
│   ├── authService.js
│   ├── categoryService.js
│   ├── dashboardService.js
│   ├── menuService.js
│   ├── mockData.js
│   ├── orderService.js
│   ├── salesService.js
│   └── tableService.js
├── utils/
│   ├── constants.js
│   └── formatters.js
├── App.jsx
├── index.css
└── main.jsx
```
