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

  const [email, setEmail] = useState('admin@caffera.com');
  const [password, setPassword] = useState('admin123');
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

  const handleQuickLogin = (roleEmail, rolePass) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    setIsLoading(true);
    setTimeout(async () => {
      const res = await login({ email: roleEmail, password: rolePass });
      setIsLoading(false);
      if (res.success) {
        const savedUser = JSON.parse(localStorage.getItem('caffera_user') || '{}');
        success(`Login berhasil sebagai ${savedUser.role || 'Staff'}!`);
        if (savedUser.role === 'Kitchen' || roleEmail.includes('kitchen')) {
          navigate('/kitchen');
        } else {
          navigate('/dashboard');
        }
      } else {
        error(res.message || 'Login gagal');
      }
    }, 400);
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

      {/* Demo Quick Accounts Box */}
      <div className="p-3.5 bg-stone-50 border border-stone-200 space-y-2.5">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-black text-stone-600 uppercase tracking-widest">
            Quick Login Staff (1-Click)
          </p>
          <span className="text-[10px] font-bold text-[#e59e07]">Cloud Live API</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleQuickLogin('admin@caffera.com', 'admin123')}
            className="p-2.5 bg-white hover:bg-[#fbb710]/15 border border-stone-200 hover:border-[#fbb710] text-left transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-1 text-stone-950 text-[11px] font-bold">
              <Shield className="w-3.5 h-3.5 text-[#e59e07]" />
              <span>Admin</span>
            </div>
            <p className="text-[9px] text-stone-400 mt-0.5">admin@caffera.com</p>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('cashier@caffera.com', 'cashier123')}
            className="p-2.5 bg-white hover:bg-stone-100 border border-stone-200 text-left transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-1 text-stone-950 text-[11px] font-bold">
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Kasir</span>
            </div>
            <p className="text-[9px] text-stone-400 mt-0.5">cashier@caffera.com</p>
          </button>
        </div>

        {/* Guest QR Self-Order Shortcut */}
        <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-[11px]">
          <span className="text-stone-500 font-semibold">Tamu Meja (Tanpa Login):</span>
          <button
            type="button"
            onClick={() => navigate('/table-order/1')}
            className="text-stone-950 font-black hover:text-[#e59e07] underline transition cursor-pointer"
          >
            Buka QR Self-Order Meja #1 →
          </button>
        </div>
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
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@caffera.com"
              className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-stone-50 border focus:bg-white focus:outline-none transition-all ${
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
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-stone-50 border focus:bg-white focus:outline-none transition-all ${
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
          iconRight={<ArrowRight className="w-4 h-4" />}
        >
          Masuk ke Dashboard
        </Button>
      </form>
    </div>
  );
};
export default LoginPage;
