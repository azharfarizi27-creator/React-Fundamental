import api, { getStorageData, setStorageData, STORAGE_KEYS } from './api';

export const tableService = {
  /**
   * Get all tables with optional status filter
   */
  getAll: async (status = '') => {
    try {
      const response = await api.get('/tables', { params: { status } });
      if (response.data && response.data.success) {
        if (response.data.data && !status) {
          setStorageData(STORAGE_KEYS.TABLES, response.data.data);
        }
        return response.data;
      }
    } catch (err) {
      console.warn('API /tables unavailable, using Mock Engine:', err.message);
    }

    let tables = getStorageData(STORAGE_KEYS.TABLES);

    if (status && status.trim()) {
      tables = tables.filter(
        (t) => t.status.toLowerCase() === status.toLowerCase().trim()
      );
    }

    // Sort by table number
    tables.sort((a, b) => a.number - b.number);

    return {
      success: true,
      message: 'Berhasil mengambil data meja',
      data: tables,
    };
  },

  /**
   * Get table by ID
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/tables/${id}`);
      if (response.data && response.data.success) {
        return response.data;
      }
    } catch (err) {
      console.warn(`API /tables/${id} unavailable, using Mock Engine:`, err.message);
    }

    const tables = getStorageData(STORAGE_KEYS.TABLES);
    const table = tables.find((t) => t.id === Number(id));

    if (!table) {
      return { success: false, message: 'Meja tidak ditemukan' };
    }

    return {
      success: true,
      data: table,
    };
  },

  /**
   * Create Table
   */
  create: async (dto) => {
    try {
      const response = await api.post('/tables', dto);
      if (response.data && response.data.success) {
        return response.data;
      }
    } catch (err) {
      console.warn('API POST /tables unavailable, using Mock Engine:', err.message);
    }

    const tables = getStorageData(STORAGE_KEYS.TABLES);
    const newId = tables.length > 0 ? Math.max(...tables.map((t) => t.id)) + 1 : 1;
    const newTable = {
      id: newId,
      number: Number(dto.number),
      capacity: Number(dto.capacity),
      status: dto.status || 'Available',
      createdAt: new Date().toISOString(),
    };

    tables.push(newTable);
    setStorageData(STORAGE_KEYS.TABLES, tables);

    return {
      success: true,
      message: 'Meja berhasil ditambahkan',
      data: newTable,
    };
  },

  /**
   * Update Table
   */
  update: async (id, dto) => {
    try {
      const response = await api.put(`/tables/${id}`, dto);
      if (response.data && response.data.success) {
        return response.data;
      }
    } catch (err) {
      console.warn(`API PUT /tables/${id} unavailable, using Mock Engine:`, err.message);
    }

    const tables = getStorageData(STORAGE_KEYS.TABLES);
    const index = tables.findIndex((t) => t.id === Number(id));

    if (index === -1) {
      return { success: false, message: 'Meja tidak ditemukan' };
    }

    tables[index] = {
      ...tables[index],
      number: Number(dto.number),
      capacity: Number(dto.capacity),
      status: dto.status || tables[index].status,
      updatedAt: new Date().toISOString(),
    };

    setStorageData(STORAGE_KEYS.TABLES, tables);

    return {
      success: true,
      message: 'Data meja berhasil diperbarui',
      data: tables[index],
    };
  },

  /**
   * Quick update table status
   */
  updateStatus: async (id, status) => {
    try {
      const response = await api.patch(`/tables/${id}/status`, { status });
      if (response.data && response.data.success) {
        return response.data;
      }
    } catch (err) {
      console.warn(`API PATCH /tables/${id}/status unavailable, using Mock Engine:`, err.message);
    }

    const tables = getStorageData(STORAGE_KEYS.TABLES);
    const index = tables.findIndex((t) => t.id === Number(id));

    if (index === -1) {
      return { success: false, message: 'Meja tidak ditemukan' };
    }

    tables[index].status = status;
    setStorageData(STORAGE_KEYS.TABLES, tables);

    return {
      success: true,
      message: `Status Meja ${tables[index].number} diubah menjadi ${status}`,
      data: tables[index],
    };
  },

  /**
   * Delete Table
   */
  delete: async (id) => {
    try {
      const response = await api.delete(`/tables/${id}`);
      if (response.data && response.data.success) {
        return response.data;
      }
    } catch (err) {
      console.warn(`API DELETE /tables/${id} unavailable, using Mock Engine:`, err.message);
    }

    let tables = getStorageData(STORAGE_KEYS.TABLES);
    tables = tables.filter((t) => t.id !== Number(id));
    setStorageData(STORAGE_KEYS.TABLES, tables);

    return {
      success: true,
      message: 'Meja berhasil dihapus',
      data: true,
    };
  },
};
