import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-4xl bg-white border border-stone-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Side: Branding Hero (Amado Clean Studio Style) */}
        <div className="relative hidden md:flex flex-col justify-between p-10 bg-stone-950 text-stone-300 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80"
            alt="Coffee Ambient"
            className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
          />

          {/* Brand Header */}
          <div className="relative z-10">
            <div className="w-10 h-1 bg-[#fbb710] mb-4" />
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-3xl tracking-tight text-white">
                Caffè
              </span>
              <span className="w-3.5 h-3.5 rounded-full bg-[#fbb710] inline-block" />
              <span className="font-extrabold text-3xl tracking-tight text-white">
                ra
              </span>
            </div>
            <p className="text-[10px] font-bold tracking-[0.25em] text-[#fbb710] uppercase mt-1">
              CAFE MANAGEMENT SYSTEM
            </p>
          </div>

          {/* Middle Quote */}
          <div className="relative z-10 my-8">
            <h2 className="text-2xl font-black text-white leading-snug">
              Modern, Clean & Realtime Cafe Management Experience.
            </h2>
            <p className="text-xs text-stone-400 mt-3 leading-relaxed">
              Sistem POS kasir, katalog menu, pemantauan meja realtime, hingga laporan keuangan café.
            </p>
          </div>

          {/* Footer Note */}
          <div className="relative z-10 text-[11px] text-stone-500 border-t border-stone-800 pt-4">
            Caffèra — Cafe Management System & POS
          </div>
        </div>

        {/* Right Side: Form Outlet */}
        <div className="p-8 sm:p-12 flex flex-col justify-center bg-white">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default AuthLayout;
