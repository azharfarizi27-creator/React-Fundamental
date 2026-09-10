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
          <div className="relative z-10 text-[11px] text-stone-500 border-t border-stone-800 pt-4 flex items-center justify-between">
            <span>Caffèra — Cafe Management System & POS</span>
            <a
              href="https://github.com/azharfarizi27-creator/React-Fundamental"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-stone-400 hover:text-[#fbb710] transition-colors"
            >
              <span>GitHub</span>
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </a>
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
