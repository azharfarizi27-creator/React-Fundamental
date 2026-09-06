import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, Home } from 'lucide-react';
import Button from '../components/common/Button';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 animate-in fade-in">
      <div className="w-20 h-20 rounded-3xl bg-amber-100/80 border border-amber-200 flex items-center justify-center text-amber-700 mb-6 shadow-soft">
        <Coffee className="w-10 h-10" />
      </div>
      <h1 className="text-4xl font-black text-stone-900 tracking-tight font-sans">
        404
      </h1>
      <h2 className="text-lg font-bold text-stone-700 mt-2">
        Halaman Tidak Ditemukan
      </h2>
      <p className="text-xs sm:text-sm text-stone-500 max-w-sm mt-1 mb-8">
        Halaman atau rute yang Anda tuju tidak tersedia di Caffèra Cafe Management System.
      </p>
      <Button
        variant="primary"
        size="md"
        onClick={() => navigate('/dashboard')}
        icon={<Home className="w-4 h-4" />}
      >
        Kembali ke Dashboard
      </Button>
    </div>
  );
};
export default NotFoundPage;
