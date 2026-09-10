import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Coffee,
  Plus,
  Minus,
  Trash2,
  CheckCircle,
  Clock,
  ArrowRight,
  Sparkles,
  Search,
} from 'lucide-react';
import { menuService } from '../../services/menuService';
import { categoryService } from '../../services/categoryService';
import { orderService } from '../../services/orderService';
import { formatRupiah } from '../../utils/formatters';
import Button from '../../components/common/Button';

export const TableSelfOrderPage = () => {
  const { tableNumber } = useParams();
  const navigate = useNavigate();

  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Cart State (stored locally for guest session)
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [menuRes, catRes] = await Promise.all([
          menuService.getAll({ pageSize: 100 }),
          categoryService.getAll(),
        ]);
        if (menuRes.success && menuRes.data) setMenus(menuRes.data.items);
        if (catRes.success && catRes.data) setCategories(catRes.data);
      } catch (err) {
        console.error('Error fetching menu for table self order:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtered menus
  const filteredMenus = useMemo(() => {
    return menus.filter((m) => {
      const matchCat =
        selectedCategory === 'all' || String(m.categoryId) === String(selectedCategory);
      const matchSearch =
        !search.trim() ||
        m.name.toLowerCase().includes(search.toLowerCase().trim()) ||
        (m.description && m.description.toLowerCase().includes(search.toLowerCase().trim()));
      return matchCat && matchSearch;
    });
  }, [menus, selectedCategory, search]);

  const handleAddToCart = (menu) => {
    if (!menu.isAvailable) return;
    setCart((prev) => {
      const existing = prev.find((item) => item.menuId === menu.id);
      if (existing) {
        return prev.map((item) =>
          item.menuId === menu.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          menuId: menu.id,
          name: menu.name,
          price: menu.price,
          imageUrl: menu.imageUrl,
          quantity: 1,
          note: '',
        },
      ];
    });
  };

  const handleUpdateQty = (menuId, newQty) => {
    if (newQty <= 0) {
      setCart((prev) => prev.filter((item) => item.menuId !== menuId));
    } else {
      setCart((prev) =>
        prev.map((item) => (item.menuId === menuId ? { ...item, quantity: newQty } : item))
      );
    }
  };

  const handleUpdateNote = (menuId, note) => {
    setCart((prev) =>
      prev.map((item) => (item.menuId === menuId ? { ...item, note } : item))
    );
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.1);
  const grandTotal = subtotal + tax;
  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSubmitOrder = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);
    try {
      const dto = {
        tableId: Number(tableNumber),
        tableNumber: Number(tableNumber),
        orderType: 'DineIn',
        customerName: customerName || `Tamu Meja #${tableNumber}`,
        items: cart.map((item) => ({
          menuId: item.menuId,
          quantity: item.quantity,
          note: item.note,
          price: item.price,
        })),
      };

      const res = await (orderService.createGuestOrder ? orderService.createGuestOrder(dto) : orderService.create(dto));
      if (res.success && res.data) {
        setSubmittedOrder({ ...res.data, customerName: res.data.customerName || customerName || `Tamu Meja #${tableNumber}` });
        setCart([]);
      }
    } catch (err) {
      console.error('Error submitting self order:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS CONFIRMATION SCREEN
  if (submittedOrder) {
    return (
      <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-white border border-stone-200 p-8 text-center space-y-5 shadow-sm">
          <div className="w-12 h-1 bg-[#fbb710] mx-auto mb-2" />
          <div className="w-14 h-14 rounded-full bg-[#fbb710]/20 text-stone-950 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-stone-950" />
          </div>

          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">
              PESANAN DITERIMA DAPUR
            </span>
            <h1 className="text-2xl font-black text-stone-950 mt-1">
              Terima Kasih, {submittedOrder.customerName || customerName || 'Tamu'}!
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Pesanan untuk <span className="font-bold text-stone-900">Meja #{tableNumber}</span> sedang diteruskan ke Barista & Dapur.
            </p>
          </div>

          <div className="p-4 bg-stone-50 border border-stone-200 text-left space-y-2 text-xs">
            <div className="flex justify-between font-mono font-bold text-stone-900 pb-2 border-b border-stone-200">
              <span>No. Order:</span>
              <span>{submittedOrder.orderNumber}</span>
            </div>
            <div className="space-y-1 pt-1">
              {(submittedOrder.items || []).map((item, idx) => (
                <div key={idx} className="flex justify-between text-stone-700">
                  <span>
                    {item.quantity}x {item.menuName}
                  </span>
                  <span className="font-bold">{formatRupiah(item.subtotal)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-stone-950 font-black pt-2 border-t border-stone-200 text-sm">
              <span>Total Tagihan:</span>
              <span>{formatRupiah(submittedOrder.totalAmount)}</span>
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <Button
              variant="primary"
              size="md"
              onClick={() => setSubmittedOrder(null)}
              className="w-full uppercase font-black tracking-wider text-xs"
            >
              + Pesan Menu Tambahan Lagi
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7] text-stone-900 font-sans pb-32">
      {/* Mobile Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 py-3 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1">
            <span className="font-extrabold text-lg text-stone-950">Caffè</span>
            <span className="w-2 h-2 rounded-full bg-[#fbb710]" />
            <span className="font-extrabold text-lg text-stone-950">ra</span>
          </div>
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
            Self-Order Menu
          </p>
        </div>

        <div className="bg-[#fbb710] text-stone-950 px-3 py-1 font-black text-xs uppercase tracking-wider shadow-xs">
          MEJA #{tableNumber}
        </div>
      </header>

      {/* Hero Welcome Banner */}
      <div className="bg-white border-b border-stone-200 p-6">
        <div className="max-w-xl mx-auto space-y-2">
          <div className="w-8 h-1 bg-[#fbb710]" />
          <h2 className="text-xl sm:text-2xl font-black text-stone-950">
            Pesan Menu Langsung dari Meja #{tableNumber}
          </h2>
          <p className="text-xs text-stone-500 leading-relaxed">
            Pilih makanan dan minuman favorit Anda, masukkan catatan porsi, dan pesanan akan langsung diantar pelayan ke meja Anda.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-xl mx-auto p-4 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kopi, pastry, snack..."
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-stone-200 placeholder:text-stone-400 focus:outline-none focus:border-[#fbb710]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 text-xs font-black uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#fbb710] text-stone-950'
                : 'bg-white border border-stone-200 text-stone-600'
            }`}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 text-xs font-black uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
                String(selectedCategory) === String(cat.id)
                  ? 'bg-[#fbb710] text-stone-950'
                  : 'bg-white border border-stone-200 text-stone-600'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Menus Grid */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-stone-400">
            <div className="w-8 h-8 border-4 border-[#fbb710] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs font-semibold">Memuat menu café...</p>
          </div>
        ) : filteredMenus.length === 0 ? (
          <div className="text-center py-12 bg-white border border-stone-200 p-6">
            <Coffee className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-stone-700">Menu tidak ditemukan</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredMenus.map((menu) => {
              const inCart = cart.find((i) => i.menuId === menu.id);
              return (
                <div
                  key={menu.id}
                  className={`bg-white border border-stone-200 overflow-hidden flex flex-col justify-between ${
                    !menu.isAvailable ? 'opacity-60' : ''
                  }`}
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-stone-100">
                    <img
                      src={menu.imageUrl}
                      alt={menu.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {!menu.isAvailable && (
                      <div className="absolute inset-0 bg-stone-950/70 flex items-center justify-center">
                        <span className="text-[10px] font-black text-white uppercase tracking-wider px-2 py-0.5 bg-rose-600">
                          Habis
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-black text-stone-950 line-clamp-1">
                        {menu.name}
                      </h4>
                      <p className="text-xs font-bold text-stone-600 mt-0.5">
                        {formatRupiah(menu.price)}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-stone-100">
                      {inCart ? (
                        <div className="flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(menu.id, inCart.quantity - 1)}
                            className="w-6 h-6 bg-stone-100 border border-stone-300 text-stone-900 flex items-center justify-center text-xs font-black"
                          >
                            -
                          </button>
                          <span className="text-xs font-black text-stone-950">
                            {inCart.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(menu.id, inCart.quantity + 1)}
                            className="w-6 h-6 bg-[#fbb710] text-stone-950 flex items-center justify-center text-xs font-black"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          disabled={!menu.isAvailable}
                          onClick={() => handleAddToCart(menu)}
                          className="w-full py-1.5 bg-[#fbb710] hover:bg-[#e5a607] disabled:opacity-40 text-stone-950 font-black text-[11px] uppercase tracking-wider transition-all"
                        >
                          + Tambah
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Bottom Cart Sheet */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-stone-300 shadow-2xl p-4 animate-in slide-in-from-bottom">
          <div className="max-w-xl mx-auto space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-stone-950" />
                <span className="text-xs font-black uppercase tracking-wider text-stone-950">
                  Keranjang ({totalItemCount} item)
                </span>
              </div>
              <span className="text-sm font-black text-stone-950">
                Total: {formatRupiah(grandTotal)}
              </span>
            </div>

            {/* Guest Name Input */}
            <div>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Nama Anda (e.g. Kak Rian)..."
                className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 focus:bg-white focus:outline-none focus:border-[#fbb710]"
              />
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handleSubmitOrder}
              isLoading={isSubmitting}
              className="w-full uppercase tracking-wider font-black text-xs"
              iconRight={<ArrowRight className="w-4 h-4" />}
            >
              Kirim Pesanan ke Dapur (Meja #{tableNumber})
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
export default TableSelfOrderPage;
