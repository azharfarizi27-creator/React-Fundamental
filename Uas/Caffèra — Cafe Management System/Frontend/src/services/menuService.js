import api, { getStorageData, setStorageData, STORAGE_KEYS } from './api';

export const menuService = {
  /**
   * Get all menus with filtering, sorting, searching, and pagination
   */
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/menus', { params });
      if (response.data && response.data.success) {
        if (response.data.data?.items && (!params.search && (!params.categoryId || params.categoryId === 'all'))) {
          setStorageData(STORAGE_KEYS.MENUS, response.data.data.items);
        }
        return response.data;
      }
    } catch (err) {
      console.warn('API /menus unavailable, using Mock Engine:', err.message);
    }

    // Mock processing
    let items = getStorageData(STORAGE_KEYS.MENUS);

    // Filter by search
    if (params.search && params.search.trim()) {
      const query = params.search.toLowerCase().trim();
      items = items.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          (m.description && m.description.toLowerCase().includes(query)) ||
          m.categoryName.toLowerCase().includes(query)
      );
    }

    // Filter by Category
    if (params.categoryId && Number(params.categoryId) > 0) {
      items = items.filter((m) => m.categoryId === Number(params.categoryId));
    }

    // Filter by Availability
    if (params.isAvailable !== undefined && params.isAvailable !== null && params.isAvailable !== '') {
      const isAvail = String(params.isAvailable) === 'true';
      items = items.filter((m) => m.isAvailable === isAvail);
    }

    // Sorting
    const sortBy = params.sortBy || 'name';
    const isDesc = params.sortOrder === 'desc';

    items.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'price') {
        comparison = Number(a.price) - Number(b.price);
      } else if (sortBy === 'createdAt') {
        comparison = new Date(a.createdAt) - new Date(b.createdAt);
      } else {
        comparison = a.name.localeCompare(b.name);
      }
      return isDesc ? -comparison : comparison;
    });

    const totalCount = items.length;
    const pageNumber = Number(params.pageNumber) || 1;
    const pageSize = Number(params.pageSize) || 8;
    const startIndex = (pageNumber - 1) * pageSize;
    const pagedItems = items.slice(startIndex, startIndex + pageSize);

    return {
      success: true,
      message: 'Berhasil mengambil data menu',
      data: {
        items: pagedItems,
        pageNumber,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
        hasPreviousPage: pageNumber > 1,
        hasNextPage: pageNumber < Math.ceil(totalCount / pageSize),
      },
    };
  },

  /**
   * Get single menu by ID
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/menus/${id}`);
      if (response.data && response.data.success) {
        return response.data;
      }
    } catch (err) {
      console.warn(`API /menus/${id} unavailable, using Mock Engine:`, err.message);
    }

    const items = getStorageData(STORAGE_KEYS.MENUS);
    const item = items.find((m) => m.id === Number(id));

    if (!item) {
      return { success: false, message: 'Menu tidak ditemukan' };
    }

    return {
      success: true,
      data: item,
    };
  },

  /**
   * Create new menu
   */
  create: async (dto) => {
    try {
      const response = await api.post('/menus', dto);
      if (response.data && response.data.success) {
        return response.data;
      }
    } catch (err) {
      console.warn('API POST /menus unavailable, using Mock Engine:', err.message);
    }

    const items = getStorageData(STORAGE_KEYS.MENUS);
    const categories = getStorageData(STORAGE_KEYS.CATEGORIES);
    const category = categories.find((c) => c.id === Number(dto.categoryId));

    const newId = items.length > 0 ? Math.max(...items.map((m) => m.id)) + 1 : 1;
    const newMenu = {
      id: newId,
      categoryId: Number(dto.categoryId),
      categoryName: category ? category.name : 'Unknown',
      name: dto.name,
      description: dto.description || '',
      price: Number(dto.price),
      imageUrl:
        dto.imageUrl ||
        'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&auto=format&fit=crop&q=80',
      isAvailable: dto.isAvailable !== undefined ? dto.isAvailable : true,
      createdAt: new Date().toISOString(),
    };

    items.unshift(newMenu);
    setStorageData(STORAGE_KEYS.MENUS, items);

    return {
      success: true,
      message: 'Menu berhasil ditambahkan',
      data: newMenu,
    };
  },

  /**
   * Update existing menu
   */
  update: async (id, dto) => {
    try {
      const response = await api.put(`/menus/${id}`, dto);
      if (response.data && response.data.success) {
        return response.data;
      }
    } catch (err) {
      console.warn(`API PUT /menus/${id} unavailable, using Mock Engine:`, err.message);
    }

    const items = getStorageData(STORAGE_KEYS.MENUS);
    const index = items.findIndex((m) => m.id === Number(id));

    if (index === -1) {
      return { success: false, message: 'Menu tidak ditemukan' };
    }

    const categories = getStorageData(STORAGE_KEYS.CATEGORIES);
    const category = categories.find((c) => c.id === Number(dto.categoryId));

    items[index] = {
      ...items[index],
      categoryId: Number(dto.categoryId),
      categoryName: category ? category.name : items[index].categoryName,
      name: dto.name,
      description: dto.description,
      price: Number(dto.price),
      imageUrl: dto.imageUrl || items[index].imageUrl,
      isAvailable: dto.isAvailable,
      updatedAt: new Date().toISOString(),
    };

    setStorageData(STORAGE_KEYS.MENUS, items);

    return {
      success: true,
      message: 'Menu berhasil diperbarui',
      data: items[index],
    };
  },

  /**
   * Delete menu
   */
  delete: async (id) => {
    try {
      const response = await api.delete(`/menus/${id}`);
      if (response.data && response.data.success) {
        return response.data;
      }
    } catch (err) {
      console.warn(`API DELETE /menus/${id} unavailable, using Mock Engine:`, err.message);
    }

    let items = getStorageData(STORAGE_KEYS.MENUS);
    items = items.filter((m) => m.id !== Number(id));
    setStorageData(STORAGE_KEYS.MENUS, items);

    return {
      success: true,
      message: 'Menu berhasil dihapus',
      data: true,
    };
  },

  /**
   * Toggle Availability
   */
  toggleAvailability: async (id) => {
    try {
      const response = await api.patch(`/menus/${id}/toggle-availability`);
      if (response.data && response.data.success) {
        return response.data;
      }
    } catch (err) {
      console.warn(`API PATCH /menus/${id}/toggle-availability unavailable, using Mock Engine:`, err.message);
    }

    const items = getStorageData(STORAGE_KEYS.MENUS);
    const index = items.findIndex((m) => m.id === Number(id));

    if (index === -1) {
      return { success: false, message: 'Menu tidak ditemukan' };
    }

    items[index].isAvailable = !items[index].isAvailable;
    setStorageData(STORAGE_KEYS.MENUS, items);

    return {
      success: true,
      message: `Status menu diubah menjadi ${items[index].isAvailable ? 'Available' : 'Unavailable'}`,
      data: items[index].isAvailable,
    };
  },
};
