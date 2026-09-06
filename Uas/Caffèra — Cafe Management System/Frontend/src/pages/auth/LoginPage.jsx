import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Shield, UserCheck, ArrowRight, Coffee } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/common/Button';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { success, error } = useToast();

  const [email, setEmail] = useState('admin@caffera.com');
  const [password, setPassword] = useState('Password123!');
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
      success('Selamat datang di Caffèra Management System!');
      navigate('/dashboard');
    } else {
      error(res.message || 'Login gagal, periksa email dan password');
    }
  };

  const handleQuickLogin = (roleEmail, rolePass) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    setIsLoading(true);
    setTimeout(async () => {
      const res = await login({ email: roleEmail, password: rolePass });
      setIsLoading(false);
      if (res.success) {
        success(`Login berhasil sebagai ${roleEmail.includes('admin') ? 'Admin' : 'Cashier'}!`);
        navigate('/dashboard');
      }
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Mobile Branding */}
      <div className="md:hidden flex items-center gap-2 mb-2">
        <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center text-white">
          <Coffee className="w-5 h-5" />
        </div>
        <span className="font-extrabold text-lg text-stone-900">CAFFÈRA</span>
      </div>

      <div>
        <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">
          Masuk ke Sistem
        </h2>
        <p className="text-xs text-stone-500 mt-1">
          Silakan masukkan kredensial akun staff untuk mengakses dashboard.
        </p>
      </div>

      {/* Demo Quick Accounts Box */}
      <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-2xl space-y-2">
        <p className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">
          Demo Quick Login (1-Click)
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleQuickLogin('admin@caffera.com', 'Admin123!')}
            className="p-2 bg-white hover:bg-amber-100/60 border border-amber-200 rounded-xl text-left transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-1.5 text-amber-800 text-xs font-bold">
              <Shield className="w-3.5 h-3.5 text-amber-600" />
              <span>Login Admin</span>
            </div>
            <p className="text-[10px] text-stone-500 mt-0.5">Semua Akses CRUD</p>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('cashier@caffera.com', 'Cashier123!')}
            className="p-2 bg-white hover:bg-blue-50 border border-blue-200 rounded-xl text-left transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-1.5 text-blue-800 text-xs font-bold">
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Login Cashier</span>
            </div>
            <p className="text-[10px] text-stone-500 mt-0.5">POS & Status Order</p>
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
            Email Staff
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@caffera.com"
              className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-stone-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all ${
                errors.email ? 'border-rose-400' : 'border-stone-200 focus:border-amber-500'
              }`}
            />
          </div>
          {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-stone-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all ${
                errors.password ? 'border-rose-400' : 'border-stone-200 focus:border-amber-500'
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
          className="w-full mt-2"
          isLoading={isLoading}
          iconRight={<ArrowRight className="w-4 h-4" />}
        >
          Masuk ke Dashboard
        </Button>
      </form>
    </div>
  );
};
export default LoginPage;
