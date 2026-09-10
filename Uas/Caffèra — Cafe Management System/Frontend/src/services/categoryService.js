import api, { getStorageData, setStorageData, STORAGE_KEYS } from './api';

export const categoryService = {
  /**
   * Get all categories with optional search
   */
  getAll: async (search = '') => {
    try {
      const response = await api.get('/categories', { params: { search } });
      if (response.data && response.data.success) {
        if (response.data.data && !search) {
          setStorageData(STORAGE_KEYS.CATEGORIES, response.data.data);
        }
        return response.data;
      }
    } catch (err) {
      console.warn('API /categories unavailable, using Mock Engine:', err.message);
    }

    let categories = getStorageData(STORAGE_KEYS.CATEGORIES);
    const menus = getStorageData(STORAGE_KEYS.MENUS);

    // Calculate real menu count per category
    categories = categories.map((cat) => ({
      ...cat,
      totalMenus: menus.filter((m) => m.categoryId === cat.id).length,
    }));

    if (search && search.trim()) {
      const query = search.toLowerCase().trim();
      categories = categories.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          (c.description && c.description.toLowerCase().includes(query))
      );
    }

    return {
      success: true,
      message: 'Berhasil mengambil data kategori',
      data: categories,
    };
  },

  /**
   * Get Category by ID
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/categories/${id}`);
      if (response.data && response.data.success) {
        return response.data;
      }
    } catch (err) {
      console.warn(`API /categories/${id} unavailable, using Mock Engine:`, err.message);
    }

    const categories = getStorageData(STORAGE_KEYS.CATEGORIES);
    const category = categories.find((c) => c.id === Number(id));

    if (!category) {
      return { success: false, message: 'Kategori tidak ditemukan' };
    }

    const menus = getStorageData(STORAGE_KEYS.MENUS);
    return {
      success: true,
      data: {
        ...category,
        totalMenus: menus.filter((m) => m.categoryId === category.id).length,
      },
    };
  },

  /**
   * Create Category
   */
  create: async (dto) => {
    try {
      const response = await api.post('/categories', dto);
      if (response.data && response.data.success) {
        return response.data;
      }
    } catch (err) {
      console.warn('API POST /categories unavailable, using Mock Engine:', err.message);
    }

    const categories = getStorageData(STORAGE_KEYS.CATEGORIES);
    const newId = categories.length > 0 ? Math.max(...categories.map((c) => c.id)) + 1 : 1;
    const newCategory = {
      id: newId,
      name: dto.name,
      description: dto.description || '',
      totalMenus: 0,
      createdAt: new Date().toISOString(),
    };

    categories.push(newCategory);
    setStorageData(STORAGE_KEYS.CATEGORIES, categories);

    return {
      success: true,
      message: 'Kategori berhasil ditambahkan',
      data: newCategory,
    };
  },

  /**
   * Update Category
   */
  update: async (id, dto) => {
    try {
      const response = await api.put(`/categories/${id}`, dto);
      if (response.data && response.data.success) {
        return response.data;
      }
    } catch (err) {
      console.warn(`API PUT /categories/${id} unavailable, using Mock Engine:`, err.message);
    }

    const categories = getStorageData(STORAGE_KEYS.CATEGORIES);
    const index = categories.findIndex((c) => c.id === Number(id));

    if (index === -1) {
      return { success: false, message: 'Kategori tidak ditemukan' };
    }

    categories[index] = {
      ...categories[index],
      name: dto.name,
      description: dto.description,
      updatedAt: new Date().toISOString(),
    };

    setStorageData(STORAGE_KEYS.CATEGORIES, categories);

    return {
      success: true,
      message: 'Kategori berhasil diperbarui',
      data: categories[index],
    };
  },

  /**
   * Delete Category
   */
  delete: async (id) => {
    try {
      const response = await api.delete(`/categories/${id}`);
      if (response.data && response.data.success) {
        return response.data;
      }
    } catch (err) {
      console.warn(`API DELETE /categories/${id} unavailable, using Mock Engine:`, err.message);
    }

    let categories = getStorageData(STORAGE_KEYS.CATEGORIES);
    categories = categories.filter((c) => c.id !== Number(id));
    setStorageData(STORAGE_KEYS.CATEGORIES, categories);

    return {
      success: true,
      message: 'Kategori berhasil dihapus',
      data: true,
    };
  },
};
