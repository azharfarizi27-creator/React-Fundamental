import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Coffee,
  ArrowRight,
} from 'lucide-react';
import { menuService } from '../../services/menuService';
import { categoryService } from '../../services/categoryService';
import { tableService } from '../../services/tableService';
import { useOrder } from '../../context/OrderContext';
import { formatRupiah } from '../../utils/formatters';
import SearchInput from '../../components/common/SearchInput';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import PaymentModal from '../../components/order/PaymentModal';

export const CreateOrderPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    tableId,
    tableNumber,
    orderType,
    customerName,
    discountCode,
    discountAmount,
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
    applyDiscount,
    removeDiscount,
    clearCart,
    submitOrder,
  } = useOrder();

  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tables, setTables] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

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

  const handleOpenPaymentModal = () => {
    setIsPaymentModalOpen(true);
  };

  const handleConfirmPayment = async (paymentDetails) => {
    const res = await submitOrder(paymentDetails);
    if (res.success && res.data) {
      setIsPaymentModalOpen(false);
      navigate(`/orders/${res.data.id}`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="w-8 h-1 bg-[#fbb710] mb-2" />
          <h1 className="text-2xl sm:text-3xl font-black text-stone-950 tracking-tight flex items-center gap-2.5">
            <span>Point of Sales (POS) — Buat Order</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Pilih katalog menu untuk pesanan pelanggan dan tentukan meja makan / take away.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {cartItems.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearCart}
              className="text-xs font-bold uppercase tracking-wider"
            >
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
              placeholder="Cari menu café..."
            />

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 text-xs font-black uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-[#fbb710] text-stone-950 shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                Semua ({menus.length})
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 text-xs font-black uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
                    String(selectedCategory) === String(cat.id)
                      ? 'bg-[#fbb710] text-stone-950 shadow-xs'
                      : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
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
              <div className="w-8 h-8 border-4 border-[#fbb710] border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-xs font-semibold">Memuat menu...</p>
            </div>
          ) : filteredMenus.length === 0 ? (
            <div className="text-center py-16 bg-white border border-stone-200 p-8">
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
                    className={`relative bg-white border transition-all duration-200 overflow-hidden flex flex-col justify-between group ${
                      menu.isAvailable
                        ? 'hover:border-stone-950 hover:shadow-md cursor-pointer border-stone-200'
                        : 'opacity-60 cursor-not-allowed border-stone-200 bg-stone-50'
                    }`}
                  >
                    {/* Header bar */}
                    <div className="p-3 pb-2">
                      <div className="w-6 h-0.5 bg-[#fbb710] mb-1.5" />
                      <p className="text-[10px] font-bold text-stone-500 tracking-wide">
                        {formatRupiah(menu.price)}
                      </p>
                      <h4 className="text-xs font-black text-stone-950 line-clamp-1 group-hover:text-[#e59e07] transition-colors">
                        {menu.name}
                      </h4>
                    </div>

                    {/* Image */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                      <img
                        src={menu.imageUrl}
                        alt={menu.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {!menu.isAvailable && (
                        <div className="absolute inset-0 bg-stone-950/70 flex items-center justify-center">
                          <span className="text-[10px] font-extrabold text-white uppercase tracking-wider px-2 py-0.5 bg-rose-600">
                            Habis
                          </span>
                        </div>
                      )}

                      {/* Quantity in cart badge */}
                      {inCart && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-[#fbb710] text-stone-950 font-black text-xs flex items-center justify-center shadow-md">
                          {inCart.quantity}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Active Order Cart (5 Cols) */}
        <div id="order-cart-section" className="lg:col-span-5 lg:sticky lg:top-20">
          <div className="border border-stone-200 bg-white p-4 sm:p-6 shadow-xs">
            {/* Cart Header */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#fbb710]" />
                <h3 className="font-black text-base text-stone-950 uppercase tracking-wider">
                  Pesanan Aktif ({totalItemCount})
                </h3>
              </div>
              {cartItems.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-stone-400 hover:text-rose-600 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Kosongkan</span>
                </button>
              )}
            </div>

            {/* Order Settings (Type, Customer, Table) */}
            <div className="py-4 border-b border-stone-100 space-y-3">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOrderType('DineIn')}
                  className={`py-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    orderType === 'DineIn'
                      ? 'bg-stone-950 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  Dine In (Makan di Tempat)
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('TakeAway')}
                  className={`py-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    orderType === 'TakeAway'
                      ? 'bg-stone-950 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  Take Away (Bungkus)
                </button>
              </div>

              {/* Customer Name */}
              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">
                  Nama Pelanggan (Opsional)
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Contoh: Budi / Meja Depan"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 focus:outline-none focus:border-[#fbb710] focus:bg-white transition-colors"
                />
              </div>

              {/* Table Selector (If Dine In) */}
              {orderType === 'DineIn' && (
                <div>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">
                    Pilih Nomor Meja <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-5 gap-1.5 max-h-36 overflow-y-auto p-1 border border-stone-100 bg-stone-50">
                    {tables.map((t) => {
                      const isSelected = tableId === t.id;
                      const isOccupied = t.status === 'Occupied';
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => selectTable(t.id, t.number)}
                          className={`py-2 text-center text-xs font-black transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#fbb710] text-stone-950 ring-2 ring-stone-950'
                              : isOccupied
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-white border border-stone-200 text-stone-800 hover:border-stone-950'
                          }`}
                        >
                          #{t.number}
                        </button>
                      );
                    })}
                  </div>
                  {!tableId && (
                    <p className="text-[10px] font-bold text-rose-500 mt-1">
                      Wajib memilih meja untuk pesanan Dine In
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Cart Items List */}
            <div className="py-4 space-y-3 max-h-64 overflow-y-auto">
              {cartItems.length === 0 ? (
                <div className="py-8 text-center text-stone-400 space-y-1">
                  <ShoppingBag className="w-8 h-8 text-stone-300 mx-auto" />
                  <p className="text-xs font-bold text-stone-600">Keranjang masih kosong</p>
                  <p className="text-[10px]">Klik item menu di sebelah kiri untuk menambahkan pesanan.</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.menuId} className="p-2.5 bg-stone-50 border border-stone-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1 pr-2">
                        <h4 className="text-xs font-black text-stone-950 truncate">{item.name}</h4>
                        <p className="text-[10px] text-stone-500 font-bold">{formatRupiah(item.price)}</p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.menuId, item.quantity - 1)}
                          className="w-6 h-6 bg-white border border-stone-200 text-stone-800 hover:bg-stone-200 font-bold text-xs flex items-center justify-center cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-black text-xs text-stone-950">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.menuId, item.quantity + 1)}
                          className="w-6 h-6 bg-white border border-stone-200 text-stone-800 hover:bg-stone-200 font-bold text-xs flex items-center justify-center cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Note input */}
                    <input
                      type="text"
                      value={item.note || ''}
                      onChange={(e) => updateItemNote(item.menuId, e.target.value)}
                      placeholder="Catatan pesanan..."
                      className="w-full px-2 py-1 text-[11px] bg-white border border-stone-200 placeholder:text-stone-400 focus:outline-none focus:border-[#fbb710]"
                    />
                  </div>
                ))
              )}
            </div>

            {/* Calculations & Submit */}
            <div className="pt-4 border-t border-stone-100 space-y-2">
              <div className="flex justify-between text-xs text-stone-500 font-semibold">
                <span>Subtotal ({totalItemCount} item):</span>
                <span className="font-bold text-stone-900">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-stone-500 font-semibold">
                <span>PB1 Restoran (10%):</span>
                <span className="font-bold text-stone-900">{formatRupiah(tax)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-xs text-emerald-600 font-semibold">
                  <span>Voucher Diskon ({discountCode}):</span>
                  <span className="font-bold">-{formatRupiah(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-base font-black text-stone-950 pt-2 border-t border-stone-200">
                <span>Total Bayar:</span>
                <span className="text-stone-950 font-black">{formatRupiah(totalAmount)}</span>
              </div>

              <Button
                variant="primary"
                size="lg"
                disabled={cartItems.length === 0 || (orderType === 'DineIn' && !tableId)}
                onClick={handleOpenPaymentModal}
                isLoading={isSubmitting}
                className="w-full mt-3 uppercase tracking-wider font-black text-xs"
                iconRight={<ArrowRight className="w-4 h-4" />}
              >
                Lanjut Pembayaran (POS Checkout)
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Mobile Cart Bar (Sticky at bottom on small screens) */}
      {totalItemCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-3 bg-stone-950/95 text-white backdrop-blur-md border-t border-stone-800 z-40 lg:hidden flex items-center justify-between shadow-2xl animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#fbb710] text-stone-950 flex items-center justify-center font-black text-xs shadow-sm shrink-0">
              {totalItemCount}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-stone-400 font-bold uppercase leading-tight">Total Tagihan</p>
              <p className="text-xs font-black text-[#fbb710] truncate">{formatRupiah(totalAmount)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('order-cart-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-2.5 py-1.5 text-[10px] font-extrabold uppercase tracking-wider bg-stone-800 hover:bg-stone-700 text-stone-200 cursor-pointer"
            >
              Cek Item
            </button>
            <button
              type="button"
              disabled={orderType === 'DineIn' && !tableId}
              onClick={handleOpenPaymentModal}
              className="px-3 py-1.5 text-[11px] font-black uppercase tracking-wider bg-[#fbb710] hover:bg-[#e59e07] text-stone-950 flex items-center gap-1 shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <span>Bayar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Multi-Payment Modal with Cash/QRIS/Debit & Voucher */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        subtotal={subtotal}
        tax={tax}
        discountAmount={discountAmount}
        discountCode={discountCode}
        totalAmount={totalAmount}
        onApplyVoucher={applyDiscount}
        onRemoveVoucher={removeDiscount}
        onConfirmPayment={handleConfirmPayment}
        isProcessing={isSubmitting}
      />
    </div>
  );
};
export default CreateOrderPage;
