import React from 'react';
import { Outlet } from 'react-router-dom';
import { Coffee } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Side: Branding Hero */}
        <div className="relative hidden md:flex flex-col justify-between p-10 bg-stone-900 text-stone-300 overflow-hidden">
          {/* Background Ambient Art */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(217,119,6,0.25),transparent_70%)]" />
          <img
            src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80"
            alt="Coffee Ambient"
            className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-luminosity pointer-events-none"
          />

          {/* Brand Header */}
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-600/40">
                <Coffee className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white tracking-wide">CAFFÈRA</h1>
                <p className="text-xs text-amber-400 font-semibold tracking-wider uppercase">
                  Cafe Management System
                </p>
              </div>
            </div>
          </div>

          {/* Middle Quote */}
          <div className="relative z-10 my-8">
            <h2 className="text-2xl font-bold text-white leading-snug">
              Kelola Operasional Café Anda Lebih Cepat, Tepat, dan Elegan.
            </h2>
            <p className="text-xs text-stone-400 mt-3 leading-relaxed">
              Sistem terintegrasi untuk POS kasir, manajemen katalog menu, pemantauan meja realtime, hingga riwayat transaksi.
            </p>
          </div>

          {/* Footer Note */}
          <div className="relative z-10 text-[11px] text-stone-500 border-t border-stone-800 pt-4">
            UAS React Fundamental • Fullstack ASP.NET Core & React JS
          </div>
        </div>

        {/* Right Side: Form Outlet */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default AuthLayout;
