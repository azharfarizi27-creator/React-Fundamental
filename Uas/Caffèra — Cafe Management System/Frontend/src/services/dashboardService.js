import api, { getStorageData, STORAGE_KEYS } from './api';

export const dashboardService = {
  /**
   * Get Dashboard Metrics & Analytics
   */
  getStats: async () => {
    try {
      const response = await api.get('/dashboard/stats');
      if (response.data && response.data.success) {
        return response.data;
      }
    } catch (err) {
      console.warn('API /dashboard/stats unavailable, using Mock Engine:', err.message);
    }

    const orders = getStorageData(STORAGE_KEYS.ORDERS);
    const menus = getStorageData(STORAGE_KEYS.MENUS);
    const tables = getStorageData(STORAGE_KEYS.TABLES);

    const todayStr = new Date().toISOString().slice(0, 10);
    const todayOrders = orders.filter(
      (o) => o.createdAt && o.createdAt.slice(0, 10) === todayStr
    );

    const todayRevenue = todayOrders
      .filter((o) => o.status === 'Completed' || o.status === 'Preparing' || o.status === 'Ready')
      .reduce((acc, curr) => acc + (Number(curr.totalAmount) || 0), 0);

    const availableTablesCount = tables.filter((t) => t.status === 'Available').length;
    const occupiedTablesCount = tables.filter((t) => t.status === 'Occupied').length;

    // Recent 5 orders
    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    // Sales Last 7 Days chart data
    const salesLast7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' });

      const dayOrders = orders.filter(
        (o) => o.createdAt && o.createdAt.slice(0, 10) === dateStr && o.status !== 'Cancelled'
      );
      const dayRev = dayOrders.reduce((acc, curr) => acc + (Number(curr.totalAmount) || 0), 0);

      salesLast7Days.push({
        date: dateStr,
        label,
        totalRevenue: dayRev,
        totalOrders: dayOrders.length,
      });
    }

    // Top Selling Menus
    const menuSalesMap = {};
    orders.forEach((o) => {
      if (o.status !== 'Cancelled' && Array.isArray(o.items)) {
        o.items.forEach((item) => {
          if (!menuSalesMap[item.menuId]) {
            menuSalesMap[item.menuId] = {
              menuId: item.menuId,
              menuName: item.menuName,
              totalQuantitySold: 0,
              totalRevenue: 0,
            };
          }
          menuSalesMap[item.menuId].totalQuantitySold += item.quantity || 1;
          menuSalesMap[item.menuId].totalRevenue += item.subtotal || (item.price || 0) * (item.quantity || 1);
        });
      }
    });

    const topSellingMenus = Object.values(menuSalesMap).sort(
      (a, b) => b.totalQuantitySold - a.totalQuantitySold
    );

    return {
      success: true,
      data: {
        todayRevenue,
        todayOrdersCount: todayOrders.length,
        totalMenuItems: menus.length,
        availableTablesCount,
        occupiedTablesCount,
        recentOrders,
        salesLast7Days,
        topSellingMenus: topSellingMenus.slice(0, 4),
      },
    };
  },
};
