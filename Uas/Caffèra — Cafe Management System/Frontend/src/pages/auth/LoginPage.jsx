import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Shield, UserCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/common/Button';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { success, error } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedTableNumber, setSelectedTableNumber] = useState('1');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Email wajib diisi';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Format email tidak valid';
    if (!password) newErrors.password = 'Password wajib diisi';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e?.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    const res = await login({ email, password });
    setIsLoading(false);

    if (res.success) {
      const savedUser = JSON.parse(localStorage.getItem('caffera_user') || '{}');
      success(`Selamat datang, ${savedUser.name || 'Staff'}!`);
      if (savedUser.role === 'Kitchen') {
        navigate('/kitchen');
      } else {
        navigate('/dashboard');
      }
    } else {
      error(res.message || 'Login gagal, periksa email dan password');
    }
  };

  return (
    <div className="space-y-6">
      {/* Mobile Branding */}
      <div className="md:hidden flex items-center gap-1 mb-2">
        <span className="font-extrabold text-2xl text-stone-950">Caffè</span>
        <span className="w-3 h-3 rounded-full bg-[#fbb710]" />
        <span className="font-extrabold text-2xl text-stone-950">ra</span>
      </div>

      <div>
        <div className="w-8 h-1 bg-[#fbb710] mb-2" />
        <h2 className="text-2xl font-black text-stone-950 tracking-tight">
          Masuk ke Sistem
        </h2>
        <p className="text-xs text-stone-500 mt-1">
          Silakan masukkan kredensial akun staff untuk mengakses dashboard operasional.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
            Email Staff
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="email"
              value={email}
              disabled={isLoading}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@caffera.com"
              className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-stone-50 border focus:bg-white focus:outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                errors.email ? 'border-rose-500' : 'border-stone-200 focus:border-[#fbb710]'
              }`}
            />
          </div>
          {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="password"
              value={password}
              disabled={isLoading}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-stone-50 border focus:bg-white focus:outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                errors.password ? 'border-rose-500' : 'border-stone-200 focus:border-[#fbb710]'
              }`}
            />
          </div>
          {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password}</p>}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2 uppercase tracking-wider font-black text-xs"
          isLoading={isLoading}
          disabled={isLoading}
          iconRight={!isLoading && <ArrowRight className="w-4 h-4" />}
        >
          {isLoading ? 'Memverifikasi Akun Staff...' : 'Masuk ke Dashboard'}
        </Button>
      </form>

      {/* Guest Table Self-Order Access */}
      <div className="pt-5 border-t border-stone-200">
        <div className="p-4 bg-stone-50 border border-stone-200 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-900">Pemesanan Mandiri Tamu Meja</span>
            <span className="text-[10px] text-stone-400 font-mono">Tanpa Login</span>
          </div>
          <p className="text-[11px] text-stone-500">
            Pilih nomor meja untuk membuka tampilan buku menu & checkout mandiri pelanggan:
          </p>
          <div className="flex items-center gap-2 pt-1">
            <select
              value={selectedTableNumber}
              onChange={(e) => setSelectedTableNumber(e.target.value)}
              className="flex-1 px-3 py-2 bg-white border border-stone-300 text-xs font-bold text-stone-900 focus:outline-none focus:border-[#fbb710] cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num}>
                  Meja #{num}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => navigate(`/table-order/${selectedTableNumber}`)}
              className="px-4 py-2 bg-stone-950 hover:bg-stone-800 text-white font-black text-xs uppercase tracking-wider transition cursor-pointer shrink-0"
            >
              Buka Menu Meja →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
