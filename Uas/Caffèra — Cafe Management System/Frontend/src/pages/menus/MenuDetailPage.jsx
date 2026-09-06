import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Coffee,
  CheckCircle2,
  XCircle,
  Tag,
  Calendar,
  ShoppingBag,
  Edit,
  Share2,
} from 'lucide-react';
import { menuService } from '../../services/menuService';
import { formatRupiah, formatDateTime } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { useOrder } from '../../context/OrderContext';
import { useToast } from '../../context/ToastContext';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

export const MenuDetailPage = () => {
  const { id } = useParams(); // Requirement React Router useParams()
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { addItem } = useOrder();
  const { success, error } = useToast();

  const [menu, setMenu] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      setIsLoading(true);
      try {
        const res = await menuService.getById(id);
        if (res.success && res.data) {
          setMenu(res.data);
        } else {
          error(res.message || 'Menu tidak ditemukan');
        }
      } catch (err) {
        error(err.message || 'Gagal memuat detail menu');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchDetail();
    }
  }, [id, error]);

  const handleAddToCart = () => {
    if (!menu || !menu.isAvailable) return;
    addItem(menu);
    success(`"${menu.name}" ditambahkan ke pesanan aktif!`);
  };

  const handleToggleAvailability = async () => {
    if (!menu) return;
    const res = await menuService.toggleAvailability(menu.id);
    if (res.success) {
      setMenu((prev) => ({ ...prev, isAvailable: !prev.isAvailable }));
      success(res.message);
    } else {
      error(res.message);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-stone-400">
        <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold">Memuat data detail menu...</p>
      </div>
    );
  }

  if (!menu) {
    return (
      <div className="text-center py-20">
        <h3 className="text-lg font-bold text-stone-800">Menu tidak ditemukan</h3>
        <p className="text-xs text-stone-500 mt-1 mb-6">Menu dengan ID #{id} tidak ada di database.</p>
        <Button variant="outline" onClick={() => navigate('/menus')}>
          Kembali ke Katalog Menu
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Back Button & Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/menus')}
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-amber-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Menu</span>
        </button>

        <span className="text-xs font-mono font-bold text-stone-400">
          useParams ID: #{id}
        </span>
      </div>

      {/* Main Detail Grid Card */}
      <Card padding="p-0" className="overflow-hidden bg-white shadow-card">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Photo Section */}
          <div className="relative aspect-square md:aspect-auto bg-stone-100 overflow-hidden">
            <img
              src={
                menu.imageUrl ||
                'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800&auto=format&fit=crop&q=80'
              }
              alt={menu.name}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute top-4 left-4">
              <Badge variant="primary" size="md" className="backdrop-blur-md shadow-sm">
                {menu.categoryName}
              </Badge>
            </div>
            <div className="absolute top-4 right-4">
              <Badge
                variant={menu.isAvailable ? 'success' : 'danger'}
                size="md"
                dot
                className="backdrop-blur-md shadow-sm"
              >
                {menu.isAvailable ? 'Available' : 'Sold Out'}
              </Badge>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                  Menu Item #{menu.id}
                </p>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1 leading-tight">
                  {menu.name}
                </h1>
                <p className="text-2xl font-black text-amber-800 mt-2">
                  {formatRupiah(menu.price)}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100">
                <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Deskripsi & Komposisi
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  {menu.description || 'Tidak ada deskripsi detail untuk produk ini.'}
                </p>
              </div>

              {/* Meta information tags */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-stone-100 text-xs">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                  <span className="text-stone-400 flex items-center gap-1 text-[11px]">
                    <Tag className="w-3.5 h-3.5 text-amber-600" /> Kategori
                  </span>
                  <p className="font-bold text-stone-800 mt-0.5">{menu.categoryName}</p>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                  <span className="text-stone-400 flex items-center gap-1 text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" /> Didaftarkan
                  </span>
                  <p className="font-bold text-stone-800 mt-0.5">
                    {formatDateTime(menu.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-stone-100 space-y-3">
              <Button
                variant={menu.isAvailable ? 'primary' : 'outline'}
                size="lg"
                disabled={!menu.isAvailable}
                onClick={handleAddToCart}
                className="w-full shadow-lg shadow-amber-600/20"
                icon={<ShoppingBag className="w-4 h-4" />}
              >
                {menu.isAvailable ? 'Tambah ke Pesanan Aktif (POS)' : 'Stok Sedang Habis'}
              </Button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleAvailability}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                    menu.isAvailable
                      ? 'text-rose-700 bg-rose-50 border-rose-200 hover:bg-rose-100'
                      : 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  {menu.isAvailable ? (
                    <>
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Ubah ke Sold Out</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Ubah ke Available</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
export default MenuDetailPage;
