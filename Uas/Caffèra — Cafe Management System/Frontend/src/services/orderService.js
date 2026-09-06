import api, { getStorageData, setStorageData, STORAGE_KEYS } from './api';

export const orderService = {
  /**
   * Get all orders with filtering, searching, and pagination
   */
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/orders', { params });
      if (response.data && response.data.success) {
        return response.data;
      }
    } catch (err) {
      console.warn('API /orders unavailable, using Mock Engine:', err.message);
    }

    let orders = getStorageData(STORAGE_KEYS.ORDERS);

    // Search filter
    if (params.search && params.search.trim()) {
      const query = params.search.toLowerCase().trim();
      orders = orders.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(query) ||
          (o.userName && o.userName.toLowerCase().includes(query)) ||
          (o.tableNumber && String(o.tableNumber).includes(query))
      );
    }

    // Status filter
    if (params.status && params.status !== 'All' && params.status.trim()) {
      orders = orders.filter(
        (o) => o.status.toLowerCase() === params.status.toLowerCase().trim()
      );
    }

    // Order Type filter
    if (params.orderType && params.orderType !== 'All' && params.orderType.trim()) {
      orders = orders.filter(
        (o) => o.orderType.toLowerCase() === params.orderType.toLowerCase().trim()
      );
    }

    // Table filter
    if (params.tableId && Number(params.tableId) > 0) {
      orders = orders.filter((o) => o.tableId === Number(params.tableId));
    }

    // Date range filter
    if (params.startDate) {
      const start = new Date(params.startDate);
      orders = orders.filter((o) => new Date(o.createdAt) >= start);
    }
    if (params.endDate) {
      const end = new Date(params.endDate);
      end.setHours(23, 59, 59, 999);
      orders = orders.filter((o) => new Date(o.createdAt) <= end);
    }

    // Sort by latest createdAt by default
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const totalCount = orders.length;
    const pageNumber = Number(params.pageNumber) || 1;
    const pageSize = Number(params.pageSize) || 10;
    const startIndex = (pageNumber - 1) * pageSize;
    const pagedItems = orders.slice(startIndex, startIndex + pageSize);

    return {
      success: true,
      message: 'Berhasil mengambil daftar pesanan',
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
   * Get order by ID
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/orders/${id}`);
      if (response.data && response.data.success) {
        return response.data;
      }
    } catch (err) {
      console.warn(`API /orders/${id} unavailable, using Mock Engine:`, err.message);
    }

    const orders = getStorageData(STORAGE_KEYS.ORDERS);
    const order = orders.find((o) => o.id === Number(id));

    if (!order) {
      return { success: false, message: 'Pesanan tidak ditemukan' };
    }

    return {
      success: true,
      data: order,
    };
  },

  /**
   * Create New Order (POS checkout)
   */
  create: async (dto) => {
    try {
      const response = await api.post('/orders', dto);
      if (response.data && response.data.success) {
        return response.data;
      }
    } catch (err) {
      console.warn('API POST /orders unavailable, using Mock Engine:', err.message);
    }

    const orders = getStorageData(STORAGE_KEYS.ORDERS);
    const menus = getStorageData(STORAGE_KEYS.MENUS);
    const tables = getStorageData(STORAGE_KEYS.TABLES);
    const users = getStorageData(STORAGE_KEYS.USERS);

    const currentUser = JSON.parse(localStorage.getItem('caffera_user') || 'null') || users[0];
    const table = dto.tableId ? tables.find((t) => t.id === Number(dto.tableId)) : null;

    const newId = orders.length > 0 ? Math.max(...orders.map((o) => o.id)) + 1 : 1;
    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const orderNumber = `ORD-${todayStr}-${String(newId).padStart(3, '0')}`;

    // Process order items
    let calculatedTotal = 0;
    const orderItems = (dto.items || []).map((item, idx) => {
      const menu = menus.find((m) => m.id === Number(item.menuId));
      const price = menu ? menu.price : item.price || 0;
      const quantity = Number(item.quantity) || 1;
      const subtotal = price * quantity;
      calculatedTotal += subtotal;

      return {
        id: idx + 1,
        orderId: newId,
        menuId: Number(item.menuId),
        menuName: menu ? menu.name : 'Unknown Item',
        quantity,
        price,
        subtotal,
      };
    });

    const newOrder = {
      id: newId,
      orderNumber,
      userId: currentUser.id,
      userName: currentUser.name,
      tableId: dto.tableId ? Number(dto.tableId) : null,
      tableNumber: table ? table.number : null,
      orderType: dto.orderType || 'DineIn',
      status: 'Pending',
      totalAmount: calculatedTotal,
      createdAt: new Date().toISOString(),
      items: orderItems,
    };

    // Update table status if DineIn
    if (table) {
      table.status = 'Occupied';
      setStorageData(STORAGE_KEYS.TABLES, tables);
    }

    orders.unshift(newOrder);
    setStorageData(STORAGE_KEYS.ORDERS, orders);

    return {
      success: true,
      message: 'Pesanan berhasil dibuat',
      data: newOrder,
    };
  },

  /**
   * Update Order Status
   */
  updateStatus: async (id, status) => {
    try {
      const response = await api.patch(`/orders/${id}/status`, { status });
      if (response.data && response.data.success) {
        return response.data;
      }
    } catch (err) {
      console.warn(`API PATCH /orders/${id}/status unavailable, using Mock Engine:`, err.message);
    }

    const orders = getStorageData(STORAGE_KEYS.ORDERS);
    const index = orders.findIndex((o) => o.id === Number(id));

    if (index === -1) {
      return { success: false, message: 'Pesanan tidak ditemukan' };
    }

    orders[index].status = status;
    orders[index].updatedAt = new Date().toISOString();

    // If order is completed or cancelled, optionally release table if no other active orders on that table
    if (status === 'Completed' || status === 'Cancelled') {
      const tableId = orders[index].tableId;
      if (tableId) {
        const tables = getStorageData(STORAGE_KEYS.TABLES);
        const tableIndex = tables.findIndex((t) => t.id === tableId);
        if (tableIndex !== -1) {
          const hasOtherActive = orders.some(
            (o) =>
              o.id !== Number(id) &&
              o.tableId === tableId &&
              (o.status === 'Pending' || o.status === 'Preparing' || o.status === 'Ready')
          );
          if (!hasOtherActive) {
            tables[tableIndex].status = 'Available';
            setStorageData(STORAGE_KEYS.TABLES, tables);
          }
        }
      }
    }

    setStorageData(STORAGE_KEYS.ORDERS, orders);

    return {
      success: true,
      message: `Status pesanan diubah menjadi ${status}`,
      data: orders[index],
    };
  },

  /**
   * Cancel / Delete Order
   */
  cancel: async (id) => {
    try {
      const response = await api.delete(`/orders/${id}/cancel`);
      if (response.data && response.data.success) {
        return response.data;
      }
    } catch (err) {
      console.warn(`API DELETE /orders/${id}/cancel unavailable, using Mock Engine:`, err.message);
    }

    return orderService.updateStatus(id, 'Cancelled');
  },
};
