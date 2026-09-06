import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  UtensilsCrossed,
  Grid,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  Coffee,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { menuService } from '../../services/menuService';
import { categoryService } from '../../services/categoryService';
import { tableService } from '../../services/tableService';
import { useOrder } from '../../context/OrderContext';
import { formatRupiah } from '../../utils/formatters';
import SearchInput from '../../components/common/SearchInput';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export const CreateOrderPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    tableId,
    tableNumber,
    orderType,
    customerName,
    isSubmitting,
    subtotal,
    tax,
    totalAmount,
    totalItemCount,
    addItem,
    removeItem,
    updateQuantity,
    updateItemNote,
    selectTable,
    setOrderType,
    setCustomerName,
    clearCart,
    submitOrder,
  } = useOrder();

  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tables, setTables] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [menuRes, catRes, tableRes] = await Promise.all([
          menuService.getAll({ pageSize: 100 }),
          categoryService.getAll(),
          tableService.getAll(),
        ]);

        if (menuRes.success && menuRes.data) setMenus(menuRes.data.items);
        if (catRes.success && catRes.data) setCategories(catRes.data);
        if (tableRes.success && tableRes.data) setTables(tableRes.data);
      } catch (err) {
        console.error('Error fetching POS data:', err);
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

  const handleCheckout = async () => {
    const res = await submitOrder();
    if (res.success && res.data) {
      navigate(`/orders/${res.data.id}`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2.5">
            <ShoppingBag className="w-6 h-6 text-amber-600" />
            <span>Point of Sales (POS) — Buat Order</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Pilih menu untuk pesanan pelanggan dan konfirmasi meja/take away.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {cartItems.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearCart}>
              Kosongkan Keranjang
            </Button>
          )}
        </div>
      </div>

      {/* POS 2-Column Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Menu Catalog (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search & Category Tabs */}
          <div className="space-y-3">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Cari menu untuk dipesan..."
            />

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/30'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                Semua ({menus.length})
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    String(selectedCategory) === String(cat.id)
                      ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/30'
                      : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Menus Grid */}
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-stone-400">
              <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-xs font-semibold">Memuat menu...</p>
            </div>
          ) : filteredMenus.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8">
              <Coffee className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-stone-700">Menu tidak ditemukan</p>
              <p className="text-xs text-stone-400 mt-1">Coba pilih kategori lain atau kata kunci pencarian berbeda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filteredMenus.map((menu) => {
                const inCart = cartItems.find((i) => i.menuId === menu.id);
                return (
                  <div
                    key={menu.id}
                    onClick={() => menu.isAvailable && addItem(menu)}
                    className={`relative bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between group ${
                      menu.isAvailable
                        ? 'hover:shadow-card hover:-translate-y-1 hover:border-amber-500/40 cursor-pointer border-stone-200'
                        : 'opacity-60 cursor-not-allowed border-stone-200 bg-stone-50'
                    }`}
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                      <img
                        src={menu.imageUrl}
                        alt={menu.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {!menu.isAvailable && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                          <span className="text-[11px] font-extrabold text-white uppercase tracking-wider px-2 py-1 bg-rose-600 rounded-md">
                            Habis
                          </span>
                        </div>
                      )}

                      {/* Quantity in cart badge */}
                      {inCart && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-amber-600 text-white font-extrabold text-xs flex items-center justify-center shadow-md">
                          {inCart.quantity}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-3">
                      <h4 className="text-xs font-bold text-stone-900 line-clamp-1 group-hover:text-amber-700">
                        {menu.name}
                      </h4>
                      <p className="text-xs font-black text-amber-800 mt-1">
                        {formatRupiah(menu.price)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Active Order Cart (5 Cols) */}
        <div className="lg:col-span-5 sticky top-20">
          <Card className="shadow-card border-stone-200 bg-white">
            {/* Cart Header */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-600" />
                <h3 className="font-extrabold text-base text-stone-900">
                  Keranjang Pesanan
                </h3>
              </div>
              <Badge variant="primary" size="sm">
                {totalItemCount} Item
              </Badge>
            </div>

            {/* Order Type & Table Selection */}
            <div className="py-4 space-y-3 border-b border-stone-100">
              {/* Dine In vs Take Away Switch */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setOrderType('DineIn')}
                  className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    orderType === 'DineIn'
                      ? 'bg-white text-stone-900 shadow-sm'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  🍽️ Dine In (Makan di Tempat)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOrderType('TakeAway');
                    selectTable(null, null);
                  }}
                  className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    orderType === 'TakeAway'
                      ? 'bg-white text-stone-900 shadow-sm'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  🥡 Take Away (Bungkus)
                </button>
              </div>

              {/* Table Selector (if DineIn) */}
              {orderType === 'DineIn' && (
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1">
                    Pilih Meja <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={tableId || ''}
                    onChange={(e) => {
                      const id = e.target.value ? Number(e.target.value) : null;
                      const matched = tables.find((t) => t.id === id);
                      selectTable(id, matched ? matched.number : null);
                    }}
                    className="w-full px-3 py-2 text-xs font-semibold bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/30 transition-all cursor-pointer"
                  >
                    <option value="">-- Pilih Nomor Meja --</option>
                    {tables.map((tbl) => (
                      <option key={tbl.id} value={tbl.id}>
                        Meja #{tbl.number} (Kapasitas {tbl.capacity} org) — [{tbl.status}]
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Customer Name (Optional) */}
              <div>
                <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1">
                  Nama Pelanggan (Opsional)
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Mas Rian / Meja Pojok"
                  className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/30"
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="py-3 max-h-64 overflow-y-auto space-y-2.5">
              {cartItems.length === 0 ? (
                <div className="text-center py-8 text-stone-400">
                  <Coffee className="w-8 h-8 mx-auto mb-1 opacity-50" />
                  <p className="text-xs font-semibold">Keranjang masih kosong</p>
                  <p className="text-[11px] mt-0.5">Klik menu di sebelah kiri untuk menambahkan</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.menuId}
                    className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/70 space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <h5 className="text-xs font-bold text-stone-900 truncate">
                          {item.name}
                        </h5>
                        <p className="text-[11px] font-semibold text-amber-700">
                          {formatRupiah(item.price)}
                        </p>
                      </div>

                      {/* Qty controls */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.menuId, item.quantity - 1)}
                          className="w-6 h-6 rounded-md bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 flex items-center justify-center text-xs font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-5 text-center text-xs font-bold text-stone-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.menuId, item.quantity + 1)}
                          className="w-6 h-6 rounded-md bg-amber-600 text-white hover:bg-amber-700 flex items-center justify-center text-xs font-bold cursor-pointer"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(item.menuId)}
                          className="p-1 text-stone-400 hover:text-rose-600 transition-colors ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Note input */}
                    <input
                      type="text"
                      value={item.note || ''}
                      onChange={(e) => updateItemNote(item.menuId, e.target.value)}
                      placeholder="Catatan pesanan..."
                      className="w-full px-2 py-0.5 text-[11px] bg-white border border-stone-200 rounded-md placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500/30"
                    />
                  </div>
                ))
              )}
            </div>

            {/* Calculations & Submit */}
            <div className="pt-4 border-t border-stone-100 space-y-2">
              <div className="flex justify-between text-xs text-stone-500">
                <span>Subtotal ({totalItemCount} item):</span>
                <span className="font-semibold text-stone-800">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-stone-500">
                <span>PB1 Restoran (10%):</span>
                <span className="font-semibold text-stone-800">{formatRupiah(tax)}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-stone-900 pt-2 border-t border-stone-100">
                <span>Total Bayar:</span>
                <span className="text-amber-800 font-sans">{formatRupiah(totalAmount)}</span>
              </div>

              <Button
                variant="primary"
                size="lg"
                disabled={cartItems.length === 0 || (orderType === 'DineIn' && !tableId)}
                onClick={handleCheckout}
                isLoading={isSubmitting}
                className="w-full mt-3 shadow-lg shadow-amber-600/30"
                iconRight={<ArrowRight className="w-4 h-4" />}
              >
                Proses & Simpan Pesanan
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default CreateOrderPage;
