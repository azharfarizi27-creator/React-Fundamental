import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Layers,
  Grid,
  ClipboardList,
  PlusCircle,
  Receipt,
  LogOut,
  Menu as MenuIcon,
  X,
  Coffee,
  ShoppingBag,
  Shield,
  UserCheck,
  ChefHat,
  ChevronDown,
  Sparkles,
  Percent,
  Github,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
import { formatRupiah } from '../utils/formatters';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';

export const MainLayout = () => {
  const { user, isAdmin, isCashier, isKitchen, logout } = useAuth();
  const { totalItemCount, totalAmount } = useOrder();
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Define allowed roles for each menu item
  const navigationItems = [
    {
      name: 'HOME',
      path: '/dashboard',
      roles: ['Admin', 'Cashier'],
    },
    {
      name: 'SHOP / MENU',
      path: '/menus',
      roles: ['Admin', 'Cashier'],
    },
    {
      name: 'CATEGORIES',
      path: '/categories',
      roles: ['Admin', 'Cashier'],
    },
    {
      name: 'TABLES',
      path: '/tables',
      roles: ['Admin', 'Cashier'],
    },
    {
      name: 'KITCHEN (KDS)',
      path: '/kitchen',
      roles: ['Admin', 'Cashier', 'Kitchen'],
    },
    {
      name: 'ORDERS',
      path: '/orders',
      roles: ['Admin', 'Cashier', 'Kitchen'],
    },
    {
      name: 'CHECKOUT / POS',
      path: '/orders/create',
      roles: ['Admin', 'Cashier'],
    },
    {
      name: 'REPORTS',
      path: '/sales',
      roles: ['Admin'],
    },
    {
      name: 'STAFF (USERS)',
      path: '/staff',
      roles: ['Admin'],
    },
  ];

  const currentRole = user?.role || 'Admin';
  const visibleNavItems = navigationItems.filter(
    (item) => !item.roles || item.roles.includes(currentRole)
  );

  return (
    <div className="min-h-screen bg-[#f7f7f7] text-stone-900 flex font-sans">
      {/* Sidebar for Desktop (Amado Clean Studio Style) */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 bg-white border-r border-stone-200/90 shrink-0 select-none z-30 justify-between">
        <div className="p-8 xl:p-10 flex flex-col">
          {/* Logo Branding */}
          <div
            onClick={() => navigate(isKitchen ? '/kitchen' : '/dashboard')}
            className="cursor-pointer group inline-block mb-12"
          >
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-2xl xl:text-3xl tracking-tight text-stone-950 font-sans">
                Caffè
              </span>
              <span className="w-3.5 h-3.5 rounded-full bg-[#fbb710] inline-block shadow-sm" />
              <span className="font-extrabold text-2xl xl:text-3xl tracking-tight text-stone-950 font-sans">
                ra
              </span>
            </div>
            <p className="text-[10px] font-bold tracking-[0.25em] text-stone-400 uppercase mt-1">
              CAFE MANAGEMENT
            </p>
          </div>

          {/* Navigation Links with Horizontal Yellow Bar */}
          <nav className="space-y-6">
            {visibleNavItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path !== '/dashboard' &&
                  location.pathname.startsWith(item.path) &&
                  item.path !== '/orders/create');

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className="flex items-center group transition-all"
                >
                  {/* Yellow active indicator line */}
                  <div
                    className={`h-[2px] transition-all duration-300 mr-3 rounded-full ${
                      isActive
                        ? 'w-6 bg-[#fbb710]'
                        : 'w-0 group-hover:w-3 bg-stone-300'
                    }`}
                  />
                  <span
                    className={`text-xs xl:text-sm font-extrabold tracking-wider transition-colors uppercase ${
                      isActive
                        ? 'text-[#fbb710]'
                        : 'text-stone-800 group-hover:text-[#fbb710]'
                    }`}
                  >
                    {item.name}
                  </span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom Actions (Role Specific) */}
        <div className="p-8 xl:p-10 space-y-4">
          {/* Kitchen Staff Special Status Panel */}
          {isKitchen ? (
            <div className="p-3.5 bg-neutral-900 text-white border border-neutral-800 space-y-1">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider text-white">
                  Layar Dapur Aktif
                </span>
              </div>
              <p className="text-[10px] text-neutral-400">
                Memantau dan memasak antrean pesanan masuk.
              </p>
            </div>
          ) : (
            <>
              {/* Yellow Discount Button */}
              <button
                onClick={() => navigate('/menus')}
                className="w-full py-3 px-4 bg-[#fbb710] hover:bg-[#e5a607] text-stone-950 font-extrabold text-xs uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Percent className="w-3.5 h-3.5" />
                <span>% Special Menu %</span>
              </button>

              {/* Black New Order Button */}
              <button
                onClick={() => navigate('/orders/create')}
                className="w-full py-3 px-4 bg-stone-950 hover:bg-stone-800 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#fbb710]" />
                <span>+ Buat Order POS</span>
              </button>
            </>
          )}

          {/* Staff Info / Role Selector Box */}
          <div className="pt-4 border-t border-stone-200">
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-200">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={
                    user?.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                  }
                  alt={user?.name || 'Staff'}
                  className="w-8 h-8 rounded-lg object-cover border border-amber-500/40 shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-stone-900 truncate">
                    {user?.name || 'Staff'}
                  </p>
                  <span className="text-[10px] font-semibold text-stone-500 block">
                    {user?.role || 'Staff'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* GitHub Repo Link */}
            <a
              href="https://github.com/azharfarizi27-creator/React-Fundamental"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 flex items-center justify-between px-3 py-2 text-[11px] font-bold text-stone-500 hover:text-stone-900 bg-stone-50 hover:bg-stone-100 border border-stone-200 transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5 text-stone-700" />
                <span>GitHub Repository</span>
              </div>
              <ExternalLink className="w-3 h-3 text-stone-400" />
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Minimal Clean Top Header */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Mobile Brand & Drawer Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-stone-700 hover:bg-stone-100 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>

            <div
              onClick={() => navigate('/dashboard')}
              className="lg:hidden flex items-center gap-1 cursor-pointer"
            >
              <span className="font-black text-lg tracking-tight text-stone-950">
                Caffè
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#fbb710]" />
              <span className="font-black text-lg tracking-tight text-stone-950">
                ra
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-stone-400 uppercase tracking-wider">
              <span className="text-stone-900">Caffèra</span>
              <span>/</span>
              <span className="text-[#fbb710]">
                {location.pathname.replace('/', '') || 'Dashboard'}
              </span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Quick POS Cart Summary Pill */}
            {totalItemCount > 0 && (
              <button
                onClick={() => navigate('/orders/create')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#fbb710]/15 border border-[#fbb710]/40 text-stone-950 hover:bg-[#fbb710]/25 transition-all cursor-pointer shadow-xs"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-stone-900" />
                <span className="text-xs font-black">
                  {totalItemCount} Item ({formatRupiah(totalAmount)})
                </span>
              </button>
            )}

            {/* Active User Profile Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-800 text-xs font-bold shadow-xs">
              {isAdmin ? (
                <Shield className="w-3.5 h-3.5 text-[#e59e07]" />
              ) : isKitchen ? (
                <ChefHat className="w-3.5 h-3.5 text-amber-600" />
              ) : (
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              )}
              <span className="hidden sm:inline font-bold text-stone-900">{user?.name || 'Staff'}</span>
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-stone-100 text-stone-700">
                {user?.role || 'Staff'}
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-stone-600 text-xs font-semibold transition-colors cursor-pointer"
              title="Logout dari akun"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Drawer Content */}
            <div className="relative w-72 max-w-[85vw] bg-white text-stone-900 p-6 flex flex-col justify-between z-50 shadow-2xl h-full overflow-y-auto">
              <div>
                {/* Header in Drawer */}
                <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-4">
                  <div className="flex items-center gap-1">
                    <span className="font-extrabold text-xl text-stone-950">Caffè</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#fbb710]" />
                    <span className="font-extrabold text-xl text-stone-950">ra</span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 rounded-md hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* User Info in Mobile Drawer */}
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200/80 mb-5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#fbb710] text-stone-950 font-black text-sm flex items-center justify-center shrink-0">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-stone-950 truncate">{user?.name || 'Staff User'}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-amber-100 text-amber-900">
                        {user?.role || 'Staff'}
                      </span>
                      <span className="text-[10px] text-stone-400 truncate">{user?.email}</span>
                    </div>
                  </div>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-1.5">
                  {visibleNavItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-colors ${
                          isActive
                            ? 'bg-[#fbb710] text-stone-950 shadow-xs'
                            : 'text-stone-700 hover:bg-stone-100 hover:text-stone-950'
                        }`
                      }
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-stone-950" />
                      <span>{item.name}</span>
                    </NavLink>
                  ))}
                </nav>
              </div>

              {/* Bottom Drawer Actions */}
              <div className="pt-6 border-t border-stone-200 space-y-2.5 mt-6">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/orders/create');
                  }}
                  className="w-full py-2.5 px-4 bg-[#fbb710] hover:bg-[#e59e07] text-stone-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>+ Buat Order POS</span>
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsLogoutModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout Keluar</span>
                </button>

                <a
                  href="https://github.com/azharfarizi27-creator/React-Fundamental"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 text-[11px] font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 border border-stone-200 transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub Repository</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Page Content Outlet */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Konfirmasi Keluar (Logout)"
        subtitle="Sistem Keamanan Akun Caffèra"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="p-4 bg-amber-50/50 border border-amber-200/80 rounded-xl flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0">
              <LogOut className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900">
                Apakah Anda yakin ingin keluar dari sistem?
              </p>
              <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">
                Sesi akun <span className="font-bold">{user?.name || 'Staff'}</span> ({user?.role}) akan diakhiri. Anda perlu memasukkan email & password kembali untuk mengakses dashboard.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-stone-100">
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsLogoutModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              variant="danger"
              size="md"
              onClick={() => {
                setIsLogoutModalOpen(false);
                logout();
              }}
              icon={<LogOut className="w-4 h-4" />}
            >
              Ya, Keluar Akun
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default MainLayout;
