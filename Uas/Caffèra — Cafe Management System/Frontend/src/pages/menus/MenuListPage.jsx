import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Coffee, Edit2, Trash2, CheckCircle, XCircle, Eye } from 'lucide-react';
import { menuService } from '../../services/menuService';
import { categoryService } from '../../services/categoryService';
import { formatRupiah } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import MenuCard from '../../components/menu/MenuCard';
import MenuFormModal from '../../components/menu/MenuFormModal';
import MenuFilterBar from '../../components/menu/MenuFilterBar';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export const MenuListPage = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { success, error } = useToast();

  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 8,
    totalCount: 0,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [availability, setAvailability] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState(null);

  // Fetch Categories
  useEffect(() => {
    const fetchCats = async () => {
      const res = await categoryService.getAll();
      if (res.success && res.data) {
        setCategories(res.data);
      }
    };
    fetchCats();
  }, []);

  // Fetch Menus
  const fetchMenus = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        search,
        categoryId: selectedCategory !== 'all' ? selectedCategory : undefined,
        isAvailable: availability !== 'all' ? availability : undefined,
        sortBy,
        sortOrder,
        pageNumber: pagination.pageNumber,
        pageSize: pagination.pageSize,
      };

      const res = await menuService.getAll(params);
      if (res.success && res.data) {
        setMenus(res.data.items);
        setPagination({
          pageNumber: res.data.pageNumber,
          pageSize: res.data.pageSize,
          totalCount: res.data.totalCount,
          totalPages: res.data.totalPages,
        });
      }
    } catch (err) {
      console.error('Error fetching menus:', err);
    } finally {
      setIsLoading(false);
    }
  }, [search, selectedCategory, availability, sortBy, sortOrder, pagination.pageNumber, pagination.pageSize]);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  // Handlers
  const handleSearchChange = (val) => {
    setSearch(val);
    setPagination((prev) => ({ ...prev, pageNumber: 1 }));
  };

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    setPagination((prev) => ({ ...prev, pageNumber: 1 }));
  };

  const handleAvailabilityChange = (avail) => {
    setAvailability(avail);
    setPagination((prev) => ({ ...prev, pageNumber: 1 }));
  };

  const handleSortChange = (sb, so) => {
    setSortBy(sb);
    setSortOrder(so);
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, pageNumber: page }));
  };

  // CRUD Handlers
  const handleOpenCreateModal = () => {
    setSelectedMenu(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (menu) => {
    setSelectedMenu(menu);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    setIsLoading(true);
    try {
      let res;
      if (selectedMenu) {
        res = await menuService.update(selectedMenu.id, formData);
      } else {
        res = await menuService.create(formData);
      }

      if (res.success) {
        success(selectedMenu ? 'Menu berhasil diperbarui!' : 'Menu baru berhasil ditambahkan!');
        setIsModalOpen(false);
        fetchMenus();
      } else {
        error(res.message || 'Gagal menyimpan menu');
      }
    } catch (err) {
      error(err.message || 'Terjadi kesalahan sistem');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAvailability = async (id) => {
    const res = await menuService.toggleAvailability(id);
    if (res.success) {
      success(res.message);
      fetchMenus();
    } else {
      error(res.message);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!menuToDelete) return;
    setIsDeleting(true);
    const res = await menuService.delete(menuToDelete.id);
    setIsDeleting(false);
    if (res.success) {
      success(`Menu "${menuToDelete.name}" berhasil dihapus`);
      setMenuToDelete(null);
      fetchMenus();
    } else {
      error(res.message || 'Gagal menghapus menu');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2.5">
            <Coffee className="w-6 h-6 text-amber-600" />
            <span>Katalog Menu Café</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Kelola daftar minuman, makanan, harga, dan ketersediaan stok produk.
          </p>
        </div>

        {isAdmin && (
          <Button
            variant="primary"
            size="md"
            onClick={handleOpenCreateModal}
            icon={<Plus className="w-4 h-4" />}
          >
            Tambah Menu
          </Button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <MenuFilterBar
        search={search}
        onSearchChange={handleSearchChange}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        categories={categories}
        availability={availability}
        onAvailabilityChange={handleAvailabilityChange}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Menu Catalog Content */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-stone-400">
          <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs font-semibold">Memuat katalog menu...</p>
        </div>
      ) : menus.length === 0 ? (
        <EmptyState
          title="Tidak ada menu ditemukan"
          description="Coba ubah kata kunci pencarian atau filter kategori Anda."
          actionLabel={isAdmin ? 'Tambah Menu Pertama' : undefined}
          onAction={isAdmin ? handleOpenCreateModal : undefined}
        />
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {menus.map((menu) => (
            <MenuCard
              key={menu.id}
              menu={menu}
              isAdmin={isAdmin}
              onEdit={handleOpenEditModal}
              onDelete={(m) => setMenuToDelete(m)}
              onToggleAvailability={handleToggleAvailability}
              onViewDetail={(id) => navigate(`/menus/${id}`)}
            />
          ))}
        </div>
      ) : (
        /* TABLE LIST VIEW */
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Menu</th>
                  <th className="py-3.5 px-4">Kategori</th>
                  <th className="py-3.5 px-4">Harga</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {menus.map((menu) => (
                  <tr key={menu.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={menu.imageUrl}
                          alt={menu.name}
                          className="w-10 h-10 rounded-lg object-cover border border-stone-200"
                        />
                        <div>
                          <p
                            onClick={() => navigate(`/menus/${menu.id}`)}
                            className="font-bold text-stone-900 hover:text-amber-700 cursor-pointer"
                          >
                            {menu.name}
                          </p>
                          <p className="text-[11px] text-stone-400 line-clamp-1">
                            {menu.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-stone-600">
                      {menu.categoryName}
                    </td>
                    <td className="py-3 px-4 font-bold text-amber-800">
                      {formatRupiah(menu.price)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={menu.isAvailable ? 'success' : 'danger'}
                        size="sm"
                        dot
                      >
                        {menu.isAvailable ? 'Available' : 'Sold Out'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => navigate(`/menus/${menu.id}`)}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-amber-700 hover:bg-stone-100 transition-colors"
                          title="Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleAvailability(menu.id)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            menu.isAvailable
                              ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                              : 'text-rose-700 bg-rose-50 border-rose-200'
                          }`}
                          title="Toggle Status"
                        >
                          {menu.isAvailable ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <XCircle className="w-4 h-4" />
                          )}
                        </button>
                        {isAdmin && (
                          <>
                            <button
                              onClick={() => handleOpenEditModal(menu)}
                              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setMenuToDelete(menu)}
                              className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={pagination.pageNumber}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalCount}
        pageSize={pagination.pageSize}
        onPageChange={handlePageChange}
      />

      {/* Create / Edit Modal */}
      <MenuFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedMenu}
        categories={categories}
        isLoading={isLoading}
      />

      {/* Delete Confirmation Modal */}
      {menuToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-stone-200 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-stone-900">Konfirmasi Hapus Menu</h3>
            <p className="text-xs text-stone-600">
              Apakah Anda yakin ingin menghapus menu{' '}
              <span className="font-bold text-stone-900">"{menuToDelete.name}"</span>? Aksi ini tidak dapat dibatalkan.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMenuToDelete(null)}
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
                Hapus Menu
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default MenuListPage;
