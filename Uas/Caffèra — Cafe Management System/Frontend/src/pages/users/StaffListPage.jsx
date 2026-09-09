import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Shield,
  UserCheck,
  ChefHat,
  Plus,
  Trash2,
  Edit,
  Mail,
  Lock,
  CheckCircle,
  AlertCircle,
  UserX,
} from 'lucide-react';
import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatDateTime } from '../../utils/formatters';
import StatCard from '../../components/common/StatCard';
import SearchInput from '../../components/common/SearchInput';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';

export const StaffListPage = () => {
  const navigate = useNavigate();
  const { user: currentUser, isAdmin } = useAuth();
  const { success, error } = useToast();

  const [staffList, setStaffList] = useState([]);
  const [roleFilter, setRoleFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Cashier',
    password: 'Password123!',
  });
  const [formErrors, setFormErrors] = useState({});

  // Delete Confirmation State
  const [staffToDelete, setStaffToDelete] = useState(null);

  const fetchStaff = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await userService.getAll({
        role: roleFilter !== 'All' ? roleFilter : undefined,
        search,
      });
      if (res.success && res.data) {
        setStaffList(res.data);
      }
    } catch (err) {
      console.error('Error fetching staff list:', err);
    } finally {
      setIsLoading(false);
    }
  }, [roleFilter, search]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  // RBAC Guard: Only Admin can access
  if (!isAdmin) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto border border-rose-200">
          <UserX className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-stone-900">Akses Ditolak (Admin Only)</h2>
        <p className="text-xs text-stone-500">
          Halaman Manajemen Akun Staff hanya dapat diakses oleh manajer kafe / pengguna dengan peran <strong>Admin</strong>.
        </p>
        <Button variant="primary" onClick={() => navigate('/dashboard')} className="mt-2">
          Kembali ke Dashboard
        </Button>
      </div>
    );
  }

  const handleOpenAddModal = () => {
    setSelectedStaff(null);
    setFormData({
      name: '',
      email: '',
      role: 'Cashier',
      password: 'Password123!',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (staff) => {
    setSelectedStaff(staff);
    setFormData({
      name: staff.name,
      email: staff.email,
      role: staff.role,
      status: staff.status || 'Active',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Nama lengkap staf wajib diisi';
    if (!formData.email.trim()) errs.email = 'Email staf wajib diisi';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Format email tidak valid';
    if (!selectedStaff && !formData.password) errs.password = 'Password awal wajib diisi';

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveStaff = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      let res;
      if (selectedStaff) {
        res = await userService.update(selectedStaff.id, formData);
      } else {
        res = await userService.create(formData);
      }

      if (res.success) {
        success(res.message);
        setIsModalOpen(false);
        fetchStaff();
      } else {
        error(res.message || 'Gagal menyimpan data staff');
      }
    } catch (err) {
      error(err.message || 'Terjadi kesalahan sistem');
    }
  };

  const handleDeleteStaff = async () => {
    if (!staffToDelete) return;
    try {
      const res = await userService.delete(staffToDelete.id);
      if (res.success) {
        success(res.message);
        setStaffToDelete(null);
        fetchStaff();
      } else {
        error(res.message || 'Gagal menghapus akun staff');
      }
    } catch (err) {
      error(err.message || 'Terjadi kesalahan sistem');
    }
  };

  // Stats
  const totalStaff = staffList.length;
  const adminCount = staffList.filter((s) => s.role === 'Admin').length;
  const cashierCount = staffList.filter((s) => s.role === 'Cashier').length;
  const kitchenCount = staffList.filter((s) => s.role === 'Kitchen').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="w-8 h-1 bg-[#fbb710] mb-2" />
          <h1 className="text-2xl sm:text-3xl font-black text-stone-950 tracking-tight flex items-center gap-2.5">
            <span>Manajemen Akun Staff & Karyawan</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Daftarkan akun pelayan, kasir, dan barista agar dapat mengakses POS dan Kitchen KDS.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleOpenAddModal}
          icon={<Plus className="w-4 h-4" />}
          className="uppercase tracking-wider font-extrabold text-xs"
        >
          Tambah Akun Staff
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          title="Total Karyawan"
          value={`${totalStaff} Orang`}
          subtitle="Seluruh staf terdaftar"
          icon={<Users className="w-5 h-5" />}
          iconBg="bg-neutral-100 text-neutral-800"
        />

        <StatCard
          title="Admin / Manajer"
          value={`${adminCount} Orang`}
          subtitle="Akses kontrol penuh"
          icon={<Shield className="w-5 h-5" />}
          iconBg="bg-amber-50 text-amber-700 border border-amber-200"
        />

        <StatCard
          title="Kasir & Pelayan"
          value={`${cashierCount} Orang`}
          subtitle="Operasional meja & POS"
          icon={<UserCheck className="w-5 h-5" />}
          iconBg="bg-blue-50 text-blue-700 border border-blue-200"
        />

        <StatCard
          title="Kitchen & Barista"
          value={`${kitchenCount} Orang`}
          subtitle="Layar antrean dapur KDS"
          icon={<ChefHat className="w-5 h-5" />}
          iconBg="bg-emerald-50 text-emerald-700 border border-emerald-200"
        />
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Role Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {['All', 'Admin', 'Cashier', 'Kitchen'].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-4 py-2 text-xs font-black uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
                roleFilter === role
                  ? 'bg-[#fbb710] text-stone-950 shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              {role === 'All' ? 'Semua Staf' : role === 'Cashier' ? 'Kasir / Pelayan' : role}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="w-full sm:w-72">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Cari nama atau email staff..."
          />
        </div>
      </div>

      {/* Staff Table */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-stone-400">
          <div className="w-8 h-8 border-4 border-[#fbb710] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs font-semibold">Memuat daftar staff...</p>
        </div>
      ) : staffList.length === 0 ? (
        <EmptyState
          title="Tidak ada staff ditemukan"
          description="Coba cari dengan kata kunci lain atau daftarkan akun baru."
          actionLabel="Tambah Akun Staff"
          onAction={handleOpenAddModal}
        />
      ) : (
        <div className="bg-white border border-stone-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-black uppercase tracking-wider">
                  <th className="py-3.5 px-4">Nama & Foto</th>
                  <th className="py-3.5 px-4">Email Login</th>
                  <th className="py-3.5 px-4">Hak Akses (Role)</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Terdaftar Sejak</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700 font-semibold">
                {staffList.map((staff) => {
                  const isSuperAdmin = staff.id === 1;
                  const isCurrent = staff.id === currentUser?.id;

                  return (
                    <tr key={staff.id} className="hover:bg-amber-50/20 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              staff.avatar ||
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                            }
                            alt={staff.name}
                            className="w-9 h-9 rounded-full object-cover border border-amber-400/50 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-stone-950 flex items-center gap-1.5">
                              <span>{staff.name}</span>
                              {isCurrent && (
                                <span className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded font-bold">
                                  Anda
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-stone-400">ID #{staff.id}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-stone-600">
                        {staff.email}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
                            staff.role === 'Admin'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : staff.role === 'Kitchen'
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : 'bg-blue-100 text-blue-900 border border-blue-300'
                          }`}
                        >
                          {staff.role === 'Admin' ? (
                            <Shield className="w-3 h-3 text-amber-700" />
                          ) : staff.role === 'Kitchen' ? (
                            <ChefHat className="w-3 h-3 text-emerald-700" />
                          ) : (
                            <UserCheck className="w-3 h-3 text-blue-700" />
                          )}
                          <span>{staff.role}</span>
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-emerald-700 text-[11px] font-bold">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          <span>Active</span>
                        </span>
                      </td>

                      <td className="py-3 px-4 text-stone-500 text-[11px]">
                        {formatDateTime(staff.createdAt || '2026-09-01T08:00:00Z')}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(staff)}
                            className="p-1.5 border border-stone-200 text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition"
                            title="Edit Role / Akun"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {!isSuperAdmin && !isCurrent && (
                            <button
                              type="button"
                              onClick={() => setStaffToDelete(staff)}
                              className="p-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 transition"
                              title="Hapus Akun Staff"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Staff Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedStaff ? `Edit Akun Staff: ${selectedStaff.name}` : 'Tambah Akun Staff Baru'}
        subtitle="Daftarkan akun karyawan untuk pelayan, kasir, atau barista dapur"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveStaff} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Nama Lengkap <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Budi Santoso"
              className={`w-full px-3.5 py-2 text-xs font-bold bg-stone-50 border focus:bg-white focus:outline-none transition ${
                formErrors.name ? 'border-rose-400' : 'border-stone-200 focus:border-[#fbb710]'
              }`}
            />
            {formErrors.name && <p className="text-[11px] text-rose-500 mt-1">{formErrors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Email Login <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. budi.kasir@caffera.com"
              disabled={!!selectedStaff}
              className={`w-full px-3.5 py-2 text-xs font-bold bg-stone-50 border focus:bg-white focus:outline-none transition ${
                selectedStaff ? 'opacity-60 cursor-not-allowed bg-stone-100' : ''
              } ${formErrors.email ? 'border-rose-400' : 'border-stone-200 focus:border-[#fbb710]'}`}
            />
            {formErrors.email && <p className="text-[11px] text-rose-500 mt-1">{formErrors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Hak Akses / Peran (Role) <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3.5 py-2 text-xs font-bold bg-stone-50 border border-stone-200 focus:bg-white focus:outline-none focus:border-[#fbb710] transition"
            >
              <option value="Cashier">Cashier (Pelayan / Kasir POS & Meja)</option>
              <option value="Kitchen">Kitchen (Koki / Barista Layar Dapur KDS)</option>
              <option value="Admin">Admin (Full Access Manajer & Laporan)</option>
            </select>
          </div>

          {!selectedStaff && (
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Password Awal Akun <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Password123!"
                className="w-full px-3.5 py-2 text-xs font-mono font-bold bg-stone-50 border border-stone-200 focus:bg-white focus:outline-none focus:border-[#fbb710] transition"
              />
              <p className="text-[10px] text-stone-400 mt-1">
                Berikan password awal ini kepada staf agar mereka dapat login.
              </p>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-stone-100">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary">
              {selectedStaff ? 'Simpan Perubahan' : 'Daftarkan Staff'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Staff Confirmation Modal */}
      {staffToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white p-6 max-w-sm w-full border border-stone-200 shadow-2xl space-y-4">
            <h3 className="font-black text-base text-stone-900 uppercase">Hapus Akun Staff</h3>
            <p className="text-xs text-stone-600">
              Apakah Anda yakin ingin menghapus akun staff{' '}
              <span className="font-bold text-stone-950">{staffToDelete.name}</span> ({staffToDelete.email})?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setStaffToDelete(null)}>
                Batal
              </Button>
              <Button variant="danger" size="sm" onClick={handleDeleteStaff}>
                Hapus Akun
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffListPage;
