import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  UtensilsCrossed,
  Grid,
  TrendingUp,
  ArrowRight,
  Coffee,
  Clock,
  Sparkles,
  Eye,
} from 'lucide-react';
import { dashboardService } from '../../services/dashboardService';
import { formatRupiah, formatDateTime } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import OrderStatusBadge from '../../components/order/OrderStatusBadge';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      setIsLoading(true);
      try {
        const res = await dashboardService.getStats();
        if (res.success && res.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const maxRevenue = stats?.salesLast7Days
    ? Math.max(...stats.salesLast7Days.map((d) => d.totalRevenue), 1)
    : 1;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner (Amado Clean Studio Style) */}
      <div className="bg-white border border-stone-200/90 p-6 sm:p-8 relative overflow-hidden shadow-xs">
        <div className="w-12 h-1.5 bg-[#fbb710] mb-4" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5">
            <p className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">
              Live Operations & Management
            </p>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-950 tracking-tight">
              Selamat Datang, {user?.name || 'Staff Caffèra'}!
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 max-w-xl leading-relaxed">
              Pantau transaksi café secara real-time, proses pesanan kasir POS baru, dan kelola ketersediaan stok menu hari ini.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate('/menus')}
              icon={<UtensilsCrossed className="w-4 h-4" />}
              className="uppercase tracking-wider font-extrabold text-xs"
            >
              Katalog Menu
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/orders/create')}
              icon={<ShoppingBag className="w-4 h-4" />}
              className="uppercase tracking-wider font-extrabold text-xs"
            >
              + Buat Order POS
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Pendapatan Hari Ini"
          value={formatRupiah(stats?.todayRevenue || 0)}
          subtitle="Total omset dari order aktif & selesai"
          icon={<DollarSign className="w-6 h-6 text-stone-950" />}
          iconBg="bg-[#fbb710]/20 border border-[#fbb710]/40"
          trend="+14.2%"
          trendType="up"
        />

        <StatCard
          title="Total Pesanan Hari Ini"
          value={`${stats?.todayOrdersCount || 0} Order`}
          subtitle="Transaksi masuk hari ini"
          icon={<ShoppingBag className="w-6 h-6 text-stone-950" />}
          iconBg="bg-stone-100 border border-stone-200"
          trend="+8.5%"
          trendType="up"
        />

        <StatCard
          title="Total Menu Aktif"
          value={`${stats?.totalMenuItems || 0} Menu`}
          subtitle="Katalog makanan & minuman"
          icon={<Coffee className="w-6 h-6 text-stone-950" />}
          iconBg="bg-[#fbb710]/15 border border-[#fbb710]/30"
        />

        <StatCard
          title="Status Meja"
          value={`${stats?.availableTablesCount || 0} Kosong`}
          subtitle={`${stats?.occupiedTablesCount || 0} Meja sedang terisi`}
          icon={<Grid className="w-6 h-6 text-stone-950" />}
          iconBg="bg-stone-100 border border-stone-200"
        />
      </div>

      {/* 2-Column Analytics Section: 7-Day Chart & Top Menus */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 7-Day Revenue Trend Chart */}
        <div className="lg:col-span-2 bg-white border border-stone-200/90 p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="w-8 h-1 bg-[#fbb710] mb-3" />
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-black text-base text-stone-950 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#e59e07]" />
                  <span>Tren Pendapatan 7 Hari Terakhir</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Grafik omset harian café dalam seminggu
                </p>
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-stone-900 bg-[#fbb710]/20 px-3 py-1 border border-[#fbb710]/40">
                Weekly Report
              </span>
            </div>

            {/* Visual Bar Chart */}
            <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 px-2 border-b border-stone-100">
              {(stats?.salesLast7Days || []).map((day, idx) => {
                const heightPercent = Math.max(15, Math.round((day.totalRevenue / maxRevenue) * 100));
                return (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer"
                  >
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold bg-stone-950 text-white px-2 py-1 shadow-md pointer-events-none mb-1 text-center whitespace-nowrap">
                      {formatRupiah(day.totalRevenue)}
                    </div>

                    {/* Bar */}
                    <div
                      className="w-full max-w-[42px] bg-[#fbb710] group-hover:bg-[#e59e07] transition-all duration-300 shadow-xs"
                      style={{ height: `${heightPercent}%` }}
                    />

                    {/* Label */}
                    <span className="text-[11px] font-bold text-stone-500 group-hover:text-stone-950">
                      {day.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-stone-500 pt-2">
            <span>Rata-rata Harian: ~Rp 450.000</span>
            <button
              onClick={() => navigate('/sales')}
              className="font-bold text-stone-950 hover:text-[#e59e07] inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Lihat Detail Laporan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Top Selling Menus */}
        <div className="bg-white border border-stone-200/90 p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="w-8 h-1 bg-[#fbb710] mb-3" />
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-base text-stone-950">Menu Terlaris</h3>
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Top 4</span>
            </div>

            <div className="space-y-3">
              {(stats?.topSellingMenus || []).map((menu, idx) => (
                <div
                  key={menu.menuId}
                  className="flex items-center justify-between p-2.5 bg-stone-50 hover:bg-[#fbb710]/10 border border-stone-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 flex items-center justify-center text-xs font-black ${
                        idx === 0
                          ? 'bg-[#fbb710] text-stone-950'
                          : idx === 1
                          ? 'bg-stone-900 text-white'
                          : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-stone-950 line-clamp-1">
                        {menu.menuName}
                      </h4>
                      <p className="text-[10px] text-stone-500">
                        Terjual: <span className="font-bold text-stone-800">{menu.totalQuantitySold} porsi</span>
                      </p>
                    </div>
                  </div>

                  <p className="text-xs font-black text-stone-950 shrink-0">
                    {formatRupiah(menu.totalRevenue)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('/menus')}
            className="w-full mt-4 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-stone-900 hover:text-white bg-stone-100 hover:bg-stone-950 transition-colors cursor-pointer"
          >
            Kelola Seluruh Menu
          </button>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white border border-stone-200/90 p-6 shadow-xs">
        <div className="w-8 h-1 bg-[#fbb710] mb-3" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-stone-100">
          <div>
            <h3 className="font-black text-base text-stone-950">Pesanan Terbaru</h3>
            <p className="text-xs text-stone-500">Daftar transaksi yang baru saja masuk ke sistem</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/orders')}
            iconRight={<ArrowRight className="w-3.5 h-3.5" />}
            className="text-xs font-bold uppercase tracking-wider"
          >
            Semua Pesanan
          </Button>
        </div>

        {/* Table container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-3">No. Order</th>
                <th className="py-3 px-3">Tipe / Meja</th>
                <th className="py-3 px-3">Kasir</th>
                <th className="py-3 px-3">Waktu</th>
                <th className="py-3 px-3">Total</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {(stats?.recentOrders || []).map((order) => (
                <tr key={order.id} className="hover:bg-[#fbb710]/5 transition-colors">
                  <td className="py-3 px-3 font-bold text-stone-950 font-mono">
                    {order.orderNumber}
                  </td>
                  <td className="py-3 px-3 font-medium">
                    {order.orderType === 'DineIn' ? (
                      <span className="inline-flex items-center gap-1 text-stone-900 font-bold">
                        <Grid className="w-3 h-3 text-[#e59e07]" />
                        Meja #{order.tableNumber}
                      </span>
                    ) : (
                      <span className="text-stone-500 font-bold">Take Away</span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-medium">{order.userName || 'Staff'}</td>
                  <td className="py-3 px-3 text-stone-500 flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatDateTime(order.createdAt)}</span>
                  </td>
                  <td className="py-3 px-3 font-black text-stone-950">
                    {formatRupiah(order.totalAmount)}
                  </td>
                  <td className="py-3 px-3">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="p-1.5 text-stone-600 hover:text-stone-950 hover:bg-stone-100 transition-colors inline-flex items-center gap-1 font-bold text-[11px] cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Detail</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default DashboardPage;
