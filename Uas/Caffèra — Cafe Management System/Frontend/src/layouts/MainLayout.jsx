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
  Sparkles,
  Percent,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
import { formatRupiah } from '../utils/formatters';
import Badge from '../components/common/Badge';

export const MainLayout = () => {
  const { user, isAdmin, isCashier, isKitchen, logout, switchRole } = useAuth();
  const { totalItemCount, totalAmount } = useOrder();
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

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
                onClick={logout}
                className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
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

            {/* Quick Role Switcher for Grading / Demo */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                {isAdmin ? (
                  <Shield className="w-3.5 h-3.5 text-[#fbb710]" />
                ) : isKitchen ? (
                  <span className="text-xs">👨‍🍳</span>
                ) : (
                  <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                )}
                <span>Role: {user?.role || 'Admin'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {isRoleDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 bg-white border border-stone-200 rounded-xl shadow-xl z-50 p-1.5 animate-in fade-in duration-150"
                  onClick={() => setIsRoleDropdownOpen(false)}
                >
                  <p className="px-3 py-1.5 text-[10px] font-bold text-stone-400 uppercase">
                    Demo Role Switch
                  </p>
                  <button
                    onClick={() => {
                      switchRole('Admin');
                      navigate('/dashboard');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                      isAdmin ? 'bg-amber-50 text-amber-900 font-bold' : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <span>Admin (Full Access)</span>
                    {isAdmin && <span className="w-1.5 h-1.5 rounded-full bg-[#fbb710]" />}
                  </button>
                  <button
                    onClick={() => {
                      switchRole('Cashier');
                      navigate('/dashboard');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                      isCashier ? 'bg-blue-50 text-blue-900 font-bold' : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <span>Cashier (Kasir/Pelayan)</span>
                    {isCashier && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                  </button>
                  <button
                    onClick={() => {
                      switchRole('Kitchen');
                      navigate('/kitchen');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                      isKitchen ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <span>Kitchen (Dapur KDS)</span>
                    {isKitchen && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
                  </button>
                </div>
              )}
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-stone-600 text-xs font-semibold transition-colors cursor-pointer"
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
            <div className="relative w-64 bg-white text-stone-900 p-6 flex flex-col justify-between z-50">
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-stone-200 mb-6">
                  <div className="flex items-center gap-1">
                    <span className="font-extrabold text-xl text-stone-950">Caffè</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#fbb710]" />
                    <span className="font-extrabold text-xl text-stone-950">ra</span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 text-stone-500 hover:text-stone-900"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-4">
                  {visibleNavItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 py-1 text-sm font-extrabold uppercase tracking-wider transition-colors ${
                          isActive
                            ? 'text-[#fbb710]'
                            : 'text-stone-800 hover:text-[#fbb710]'
                        }`
                      }
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#fbb710]" />
                      <span>{item.name}</span>
                    </NavLink>
                  ))}
                </nav>
              </div>

              <div className="pt-6 border-t border-stone-200 space-y-3">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/orders/create');
                  }}
                  className="w-full py-2.5 bg-[#fbb710] text-stone-950 font-bold text-xs uppercase"
                >
                  + Buat Order POS
                </button>
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-stone-100 text-rose-600 text-xs font-bold"
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
