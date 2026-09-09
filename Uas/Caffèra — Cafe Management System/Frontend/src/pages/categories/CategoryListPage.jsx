import React, { useState, useEffect, useCallback } from 'react';
import { Layers, Plus, Edit2, Trash2, Coffee } from 'lucide-react';
import { categoryService } from '../../services/categoryService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import CategoryFormModal from '../../components/category/CategoryFormModal';
import SearchInput from '../../components/common/SearchInput';
import EmptyState from '../../components/common/EmptyState';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export const CategoryListPage = () => {
  const { isAdmin } = useAuth();
  const { success, error } = useToast();

  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await categoryService.getAll(search);
      if (res.success && res.data) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleOpenCreate = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setSelectedCategory(cat);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    setIsLoading(true);
    try {
      let res;
      if (selectedCategory) {
        res = await categoryService.update(selectedCategory.id, formData);
      } else {
        res = await categoryService.create(formData);
      }

      if (res.success) {
        success(selectedCategory ? 'Kategori berhasil diperbarui!' : 'Kategori baru berhasil ditambahkan!');
        setIsModalOpen(false);
        fetchCategories();
      } else {
        error(res.message || 'Gagal menyimpan kategori');
      }
    } catch (err) {
      error(err.message || 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    setIsDeleting(true);
    const res = await categoryService.delete(categoryToDelete.id);
    setIsDeleting(false);
    if (res.success) {
      success(`Kategori "${categoryToDelete.name}" berhasil dihapus`);
      setCategoryToDelete(null);
      fetchCategories();
    } else {
      error(res.message || 'Gagal menghapus kategori');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="w-8 h-1 bg-[#fbb710] mb-2" />
          <h1 className="text-2xl sm:text-3xl font-black text-stone-950 tracking-tight flex items-center gap-2.5">
            <span>Kategori Menu Café</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Kelola klasifikasi produk makanan, minuman, snack, dan hidangan penutup.
          </p>
        </div>

        {isAdmin && (
          <Button
            variant="primary"
            size="md"
            onClick={handleOpenCreate}
            icon={<Plus className="w-4 h-4" />}
            className="uppercase tracking-wider font-extrabold text-xs"
          >
            + Tambah Kategori Baru
          </Button>
        )}
      </div>

      {/* Search Input */}
      <div className="max-w-md">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Cari nama kategori..."
        />
      </div>

      {/* Category Cards Grid */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-stone-400">
          <div className="w-8 h-8 border-4 border-[#fbb710] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs font-semibold">Memuat kategori...</p>
        </div>
      ) : categories.length === 0 ? (
        <EmptyState
          title="Tidak ada kategori ditemukan"
          description="Coba ubah kata kunci pencarian Anda."
          actionLabel={isAdmin ? 'Tambah Kategori Baru' : undefined}
          onAction={isAdmin ? handleOpenCreate : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white border border-stone-200/90 p-6 flex flex-col justify-between transition-all hover:shadow-md"
            >
              <div>
                <div className="w-8 h-1 bg-[#fbb710] mb-3" />
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-stone-400">
                      Kategori Produk
                    </span>
                    <h3 className="font-black text-xl text-stone-950 mt-0.5">{cat.name}</h3>
                  </div>

                  <span className="px-2.5 py-1 bg-[#fbb710]/20 text-stone-950 text-xs font-black">
                    {cat.totalMenus || 0} Menu
                  </span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed min-h-[36px]">
                  {cat.description || 'Tidak ada deskripsi kategori.'}
                </p>
              </div>

              {isAdmin && (
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 border border-stone-200 text-stone-700 hover:bg-stone-100 transition-colors text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setCategoryToDelete(cat)}
                    className="p-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedCategory}
        isLoading={isLoading}
      />

      {/* Delete Confirmation Modal */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-stone-200 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-stone-900">Konfirmasi Hapus Kategori</h3>
            <p className="text-xs text-stone-600">
              Apakah Anda yakin ingin menghapus kategori{' '}
              <span className="font-bold text-stone-900">"{categoryToDelete.name}"</span>?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCategoryToDelete(null)}
                disabled={isDeleting}
              >
                Batal
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDeleteConfirm}
                isLoading={isDeleting}
              >
                Hapus Kategori
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default CategoryListPage;
