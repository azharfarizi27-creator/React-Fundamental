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
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
import { formatRupiah } from '../utils/formatters';
import Badge from '../components/common/Badge';

export const MainLayout = () => {
  const { user, isAdmin, isCashier, logout, switchRole } = useAuth();
  const { totalItemCount, totalAmount } = useOrder();
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const navigationItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      name: 'Menu Café',
      path: '/menus',
      icon: <UtensilsCrossed className="w-4 h-4" />,
    },
    {
      name: 'Kategori Menu',
      path: '/categories',
      icon: <Layers className="w-4 h-4" />,
    },
    {
      name: 'Manajemen Meja',
      path: '/tables',
      icon: <Grid className="w-4 h-4" />,
    },
    {
      name: 'Daftar Pesanan',
      path: '/orders',
      icon: <ClipboardList className="w-4 h-4" />,
    },
    {
      name: 'Buat Order (POS)',
      path: '/orders/create',
      icon: <PlusCircle className="w-4 h-4" />,
      highlight: true,
    },
    {
      name: 'Riwayat Transaksi',
      path: '/sales',
      icon: <Receipt className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5] flex">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-stone-900 text-stone-300 border-r border-stone-800 shrink-0 select-none">
        {/* Logo Branding */}
        <div className="p-6 border-b border-stone-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-stone-950 font-black shadow-lg shadow-amber-600/30">
              <Coffee className="w-6 h-6 text-stone-950" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg text-white tracking-wide font-sans">
                CAFFÈRA
              </h1>
              <p className="text-[11px] text-amber-400 font-semibold tracking-wider uppercase">
                Cafe Management
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <p className="px-3 text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2">
            Main Menu
          </p>

          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path) && item.path !== '/orders/create');
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                  item.highlight
                    ? 'bg-amber-600/20 text-amber-400 border border-amber-500/30 hover:bg-amber-600 hover:text-white'
                    : isActive
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/25'
                    : 'text-stone-400 hover:text-white hover:bg-stone-800/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.name}</span>
                </div>
                {item.highlight && totalItemCount > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-amber-500 text-stone-950">
                    {totalItemCount}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Staff / User Profile Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-950/50">
          <div className="flex items-center justify-between gap-3 p-2 rounded-xl bg-stone-800/60 border border-stone-800">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={
                  user?.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                }
                alt={user?.name || 'Staff'}
                className="w-9 h-9 rounded-xl object-cover border border-amber-500/40 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'Staff'}</p>
                <Badge
                  variant={isAdmin ? 'warning' : 'info'}
                  size="sm"
                  className="mt-0.5 scale-90 -ml-1"
                >
                  {user?.role || 'Staff'}
                </Badge>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-2 text-stone-400 hover:text-rose-400 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Mobile Menu Toggle & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-stone-600 hover:bg-stone-100 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>

            <div className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white font-black">
                <Coffee className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base tracking-wide text-stone-900">
                CAFFÈRA
              </span>
            </div>

            <div className="hidden sm:block">
              <h2 className="text-sm font-bold text-stone-700">
                Caffèra Operasional Café
              </h2>
              <p className="text-[11px] text-stone-400">
                Manajemen Menu, Meja, Pesanan, & Laporan Penjualan
              </p>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Quick POS Cart Summary Pill */}
            {totalItemCount > 0 && (
              <button
                onClick={() => navigate('/orders/create')}
                className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100 transition-all cursor-pointer shadow-xs"
              >
                <ShoppingBag className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold">
                  {totalItemCount} Item ({formatRupiah(totalAmount)})
                </span>
              </button>
            )}

            {/* Quick Role Switcher for Grading / Demo */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                {isAdmin ? (
                  <Shield className="w-3.5 h-3.5 text-amber-600" />
                ) : (
                  <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                )}
                <span>Role: {user?.role || 'Admin'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {isRoleDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white border border-stone-200 rounded-2xl shadow-xl z-50 p-1.5 animate-in fade-in duration-150"
                  onClick={() => setIsRoleDropdownOpen(false)}
                >
                  <p className="px-3 py-1.5 text-[10px] font-bold text-stone-400 uppercase">
                    Demo Role Switch
                  </p>
                  <button
                    onClick={() => switchRole('Admin')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                      isAdmin ? 'bg-amber-50 text-amber-800' : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <span>Admin (Full Access)</span>
                    {isAdmin && <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />}
                  </button>
                  <button
                    onClick={() => switchRole('Cashier')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                      isCashier ? 'bg-blue-50 text-blue-800' : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <span>Cashier (Staff)</span>
                    {isCashier && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                  </button>
                </div>
              )}
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-stone-600 text-xs font-semibold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            <div
              className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="relative w-64 bg-stone-900 text-stone-300 p-4 flex flex-col justify-between z-50">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
                  <div className="flex items-center gap-2">
                    <Coffee className="w-6 h-6 text-amber-500" />
                    <span className="font-extrabold text-white text-base">CAFFÈRA</span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 text-stone-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {navigationItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                          isActive
                            ? 'bg-amber-600 text-white'
                            : 'text-stone-400 hover:text-white hover:bg-stone-800'
                        }`
                      }
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </NavLink>
                  ))}
                </nav>
              </div>

              <div className="pt-4 border-t border-stone-800">
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-stone-800 text-rose-400 text-xs font-bold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Page Content Outlet */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default MainLayout;
