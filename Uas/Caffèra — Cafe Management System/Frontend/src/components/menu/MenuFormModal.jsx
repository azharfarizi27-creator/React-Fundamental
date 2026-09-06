import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';

export const MenuFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  categories = [],
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    price: '',
    description: '',
    imageUrl: '',
    isAvailable: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        categoryId: initialData.categoryId || (categories[0]?.id || ''),
        price: initialData.price || '',
        description: initialData.description || '',
        imageUrl: initialData.imageUrl || '',
        isAvailable: initialData.isAvailable !== undefined ? initialData.isAvailable : true,
      });
    } else {
      setFormData({
        name: '',
        categoryId: categories[0]?.id || '',
        price: '',
        description: '',
        imageUrl: '',
        isAvailable: true,
      });
    }
    setErrors({});
  }, [initialData, categories, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Nama menu wajib diisi';
    if (!formData.categoryId) newErrors.categoryId = 'Kategori wajib dipilih';
    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = 'Harga menu harus lebih besar dari 0';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...formData,
      categoryId: Number(formData.categoryId),
      price: Number(formData.price),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Menu Caffèra' : 'Tambah Menu Baru'}
      subtitle={initialData ? `ID: #${initialData.id}` : 'Isi form berikut untuk menambahkan produk ke katalog'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
            Nama Menu <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Kyoto Uji Matcha Latte"
            className={`w-full px-3.5 py-2 text-sm bg-stone-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all ${
              errors.name ? 'border-rose-400' : 'border-stone-200 focus:border-amber-500'
            }`}
          />
          {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
        </div>

        {/* Category & Price Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Kategori <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className={`w-full px-3.5 py-2 text-sm bg-stone-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all ${
                errors.categoryId ? 'border-rose-400' : 'border-stone-200 focus:border-amber-500'
              }`}
            >
              <option value="">-- Pilih Kategori --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <p className="text-xs text-rose-500 mt-1">{errors.categoryId}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Harga (Rp) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="e.g. 28000"
              min="0"
              step="500"
              className={`w-full px-3.5 py-2 text-sm bg-stone-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all ${
                errors.price ? 'border-rose-400' : 'border-stone-200 focus:border-amber-500'
              }`}
            />
            {errors.price && <p className="text-xs text-rose-500 mt-1">{errors.price}</p>}
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
            URL Foto Produk
          </label>
          <input
            type="url"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
          />
          <p className="text-[11px] text-stone-400 mt-1">
            Gunakan tautan gambar HTTPS (Unsplash / CDN image).
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
            Deskripsi Produk
          </label>
          <textarea
            rows="3"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Tuliskan komposisi atau deskripsi rasa..."
            className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
          />
        </div>

        {/* Availability Toggle */}
        <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200/80">
          <input
            type="checkbox"
            id="isAvailableCheckbox"
            checked={formData.isAvailable}
            onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
            className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500 border-stone-300"
          />
          <label htmlFor="isAvailableCheckbox" className="text-sm font-semibold text-stone-800 cursor-pointer">
            Menu Tersedia untuk Dipesan (Available)
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {initialData ? 'Simpan Perubahan' : 'Tambah Menu'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
export default MenuFormModal;
