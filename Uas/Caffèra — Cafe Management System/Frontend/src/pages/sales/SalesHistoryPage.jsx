import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Receipt,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Calendar,
  Eye,
  Printer,
  Grid,
  Clock,
  ArrowUpDown,
} from 'lucide-react';
import { salesService } from '../../services/salesService';
import { formatRupiah, formatDateTime } from '../../utils/formatters';
import SearchInput from '../../components/common/SearchInput';
import StatCard from '../../components/common/StatCard';
import OrderStatusBadge from '../../components/order/OrderStatusBadge';
import OrderReceiptModal from '../../components/order/OrderReceiptModal';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export const SalesHistoryPage = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState(null);
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('Completed');
  const [receiptOrder, setReceiptOrder] = useState(null);

  const fetchSales = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        search,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        status: statusFilter !== 'All' ? statusFilter : undefined,
        pageNumber: pagination.pageNumber,
        pageSize: pagination.pageSize,
      };

      const [historyRes, summaryRes] = await Promise.all([
        salesService.getHistory(params),
        salesService.getSummary(startDate || null, endDate || null),
      ]);

      if (historyRes.success && historyRes.data) {
        setOrders(historyRes.data.items);
        setPagination({
          pageNumber: historyRes.data.pageNumber,
          pageSize: historyRes.data.pageSize,
          totalCount: historyRes.data.totalCount,
          totalPages: historyRes.data.totalPages,
        });
      }

      if (summaryRes.success && summaryRes.data) {
        setSummary(summaryRes.data);
      }
    } catch (err) {
      console.error('Error fetching sales:', err);
    } finally {
      setIsLoading(false);
    }
  }, [search, startDate, endDate, statusFilter, pagination.pageNumber, pagination.pageSize]);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const handleResetFilters = () => {
    setSearch('');
    setStartDate('');
    setEndDate('');
    setStatusFilter('Completed');
    setPagination((prev) => ({ ...prev, pageNumber: 1 }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2.5">
          <Receipt className="w-6 h-6 text-amber-600" />
          <span>Laporan Riwayat Transaksi & Penjualan</span>
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Rekapitulasi seluruh transaksi penjualan café, filter periode tanggal, dan audit pendapatan.
        </p>
      </div>

      {/* Summary Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Total Omset Selesai"
          value={formatRupiah(summary?.totalRevenue || 0)}
          subtitle="Akumulasi pendapatan order sukses"
          icon={<DollarSign className="w-6 h-6" />}
          iconBg="bg-emerald-50 text-emerald-700 border border-emerald-200"
        />

        <StatCard
          title="Total Transaksi Sukses"
          value={`${summary?.totalOrders || 0} Transaksi`}
          subtitle="Jumlah order berstatus Completed"
          icon={<ShoppingBag className="w-6 h-6" />}
          iconBg="bg-amber-50 text-amber-700 border border-amber-200"
        />

        <StatCard
          title="Rata-rata Order (AOV)"
          value={formatRupiah(summary?.averageOrderValue || 0)}
          subtitle="Rata-rata pengeluaran per transaksi"
          icon={<TrendingUp className="w-6 h-6" />}
          iconBg="bg-blue-50 text-blue-700 border border-blue-200"
        />
      </div>

      {/* Filter Toolbar Card */}
      <Card className="bg-white border-stone-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div>
            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1">
              Pencarian
            </label>
            <SearchInput
              value={search}
              onChange={(val) => {
                setSearch(val);
                setPagination((prev) => ({ ...prev, pageNumber: 1 }));
              }}
              placeholder="No. order, kasir..."
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1">
              Dari Tanggal
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPagination((prev) => ({ ...prev, pageNumber: 1 }));
              }}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-sans"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1">
              Sampai Tanggal
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPagination((prev) => ({ ...prev, pageNumber: 1 }));
              }}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-sans"
            />
          </div>

          {/* Status & Reset */}
          <div>
            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1">
              Filter Status
            </label>
            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPagination((prev) => ({ ...prev, pageNumber: 1 }));
                }}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-semibold cursor-pointer"
              >
                <option value="All">Semua Status</option>
                <option value="Completed">Completed (Selesai)</option>
                <option value="Cancelled">Cancelled (Batal)</option>
                <option value="Pending">Pending</option>
                <option value="Preparing">Preparing</option>
                <option value="Ready">Ready</option>
              </select>

              {(startDate || endDate || search || statusFilter !== 'Completed') && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-2.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors shrink-0"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Sales History Table */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-stone-400">
          <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs font-semibold">Memuat riwayat transaksi...</p>
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          title="Tidak ada riwayat transaksi"
          description="Coba ubah rentang tanggal atau kata kunci filter pencarian."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">No. Transaksi</th>
                  <th className="py-3.5 px-4">Tipe / Meja</th>
                  <th className="py-3.5 px-4">Kasir</th>
                  <th className="py-3.5 px-4">Waktu Transaksi</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Total Omset</th>
                  <th className="py-3.5 px-4 text-right">Struk / Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-stone-900 font-mono">
                      {order.orderNumber}
                    </td>

                    <td className="py-3.5 px-4 font-medium">
                      {order.orderType === 'DineIn' ? (
                        <span className="inline-flex items-center gap-1 text-stone-800">
                          <Grid className="w-3 h-3 text-amber-600" />
                          Meja #{order.tableNumber}
                        </span>
                      ) : (
                        <span className="text-stone-500">Take Away</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-stone-700">
                      {order.userName || 'Staff'}
                    </td>

                    <td className="py-3.5 px-4 text-stone-500">
                      {formatDateTime(order.createdAt)}
                    </td>

                    <td className="py-3.5 px-4">
                      <OrderStatusBadge status={order.status} />
                    </td>

                    <td className="py-3.5 px-4 font-bold text-stone-900 font-sans">
                      {formatRupiah(order.totalAmount)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setReceiptOrder(order)}
                          className="p-1.5 rounded-lg text-amber-700 hover:bg-amber-50 transition-colors"
                          title="Cetak Struk Transaksi"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate(`/orders/${order.id}`)}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                          title="Detail Order"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
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
        onPageChange={(p) => setPagination((prev) => ({ ...prev, pageNumber: p }))}
      />

      {/* Receipt Modal */}
      <OrderReceiptModal
        isOpen={!!receiptOrder}
        onClose={() => setReceiptOrder(null)}
        order={receiptOrder}
      />
    </div>
  );
};
export default SalesHistoryPage;
