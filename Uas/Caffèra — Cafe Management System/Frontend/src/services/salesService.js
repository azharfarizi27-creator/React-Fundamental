import api, { getStorageData, STORAGE_KEYS } from './api';
import { orderService } from './orderService';

export const salesService = {
  /**
   * Get Sales History (supports filtering by date range, status, search, pagination)
   */
  getHistory: async (params = {}) => {
    try {
      const response = await api.get('/sales/history', { params });
      if (response.data && response.data.success) {
        return response.data;
      }
    } catch (err) {
      console.warn('API /sales/history unavailable, using Mock Engine:', err.message);
    }

    // Reuse order service with default Completed status filter if not specified
    return orderService.getAll(params);
  },

  /**
   * Get Sales Summary Breakdown (Revenue, Order count, Average order value, Sales by date)
   */
  getSummary: async (startDate = null, endDate = null) => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await api.get('/sales/summary', { params });
      if (response.data && response.data.success) {
        return response.data;
      }
    } catch (err) {
      console.warn('API /sales/summary unavailable, using Mock Engine:', err.message);
    }

    const orders = getStorageData(STORAGE_KEYS.ORDERS);
    let filteredOrders = orders.filter((o) => o.status === 'Completed');

    if (startDate) {
      const start = new Date(startDate);
      filteredOrders = filteredOrders.filter((o) => new Date(o.createdAt) >= start);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filteredOrders = filteredOrders.filter((o) => new Date(o.createdAt) <= end);
    }

    const totalRevenue = filteredOrders.reduce((acc, curr) => acc + (Number(curr.totalAmount) || 0), 0);
    const totalOrders = filteredOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        filteredCount: filteredOrders.length,
      },
    };
  },
};
