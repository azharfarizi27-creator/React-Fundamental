import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  Plus,
  Grid,
  Clock,
  CheckCircle,
  Eye,
  Printer,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import { formatRupiah, formatDateTime } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import SearchInput from '../../components/common/SearchInput';
import OrderStatusBadge from '../../components/order/OrderStatusBadge';
import OrderReceiptModal from '../../components/order/OrderReceiptModal';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

export const OrderListPage = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedOrderType, setSelectedOrderType] = useState('All');

  // Receipt Modal
  const [receiptOrder, setReceiptOrder] = useState(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        search,
        status: selectedStatus !== 'All' ? selectedStatus : undefined,
        orderType: selectedOrderType !== 'All' ? selectedOrderType : undefined,
        pageNumber: pagination.pageNumber,
        pageSize: pagination.pageSize,
      };

      const res = await orderService.getAll(params);
      if (res.success && res.data) {
        setOrders(res.data.items);
        setPagination({
          pageNumber: res.data.pageNumber,
          pageSize: res.data.pageSize,
          totalCount: res.data.totalCount,
          totalPages: res.data.totalPages,
        });
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setIsLoading(false);
    }
  }, [search, selectedStatus, selectedOrderType, pagination.pageNumber, pagination.pageSize]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleUpdateStatus = async (orderId, nextStatus) => {
    const res = await orderService.updateStatus(orderId, nextStatus);
    if (res.success) {
      success(`Status order berhasil diubah menjadi ${nextStatus}`);
      fetchOrders();
    } else {
      error(res.message || 'Gagal mengubah status');
    }
  };

  const getNextStatusAction = (status) => {
    switch (status) {
      case 'Pending':
        return { label: 'Proses (Preparing)', next: 'Preparing', color: 'bg-blue-600 hover:bg-blue-700' };
      case 'Preparing':
        return { label: 'Siap Saji (Ready)', next: 'Ready', color: 'bg-purple-600 hover:bg-purple-700' };
      case 'Ready':
        return { label: 'Selesaikan (Completed)', next: 'Completed', color: 'bg-emerald-600 hover:bg-emerald-700' };
      default:
        return null;
    }
  };

  const statusTabs = ['All', 'Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="w-8 h-1 bg-[#fbb710] mb-2" />
          <h1 className="text-2xl sm:text-3xl font-black text-stone-950 tracking-tight flex items-center gap-2.5">
            <span>Daftar Pesanan Café</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Pantau alur pengerjaan pesanan dapur/bar dan perbarui status realtime.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('/orders/create')}
          icon={<Plus className="w-4 h-4" />}
          className="uppercase tracking-wider font-extrabold text-xs"
        >
          Buat Pesanan Baru
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="space-y-4">
        {/* Search & Order Type */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="w-full sm:max-w-md">
            <SearchInput
              value={search}
              onChange={(val) => {
                setSearch(val);
                setPagination((prev) => ({ ...prev, pageNumber: 1 }));
              }}
              placeholder="Cari no. order, kasir, atau meja..."
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedOrderType}
              onChange={(e) => {
                setSelectedOrderType(e.target.value);
                setPagination((prev) => ({ ...prev, pageNumber: 1 }));
              }}
              className="px-3 py-2 bg-white border border-stone-200 text-xs font-bold text-stone-800 focus:outline-none focus:border-[#fbb710] shadow-xs cursor-pointer"
            >
              <option value="All">Semua Tipe Order</option>
              <option value="DineIn">Dine In (Meja)</option>
              <option value="TakeAway">Take Away (Bungkus)</option>
            </select>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {statusTabs.map((status) => {
            const isSelected = selectedStatus === status;
            return (
              <button
                key={status}
                onClick={() => {
                  setSelectedStatus(status);
                  setPagination((prev) => ({ ...prev, pageNumber: 1 }));
                }}
                className={`px-4 py-2 text-xs font-black uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#fbb710] text-stone-950 shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                {status === 'All' ? 'Semua Status' : status}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table Container */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-stone-400">
          <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs font-semibold">Memuat daftar pesanan...</p>
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          title="Tidak ada pesanan ditemukan"
          description="Coba ubah status atau buat transaksi baru dari menu POS."
          actionLabel="Buat Order Sekarang"
          onAction={() => navigate('/orders/create')}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">No. Order</th>
                  <th className="py-3.5 px-4">Tipe / Meja</th>
                  <th className="py-3.5 px-4">Kasir</th>
                  <th className="py-3.5 px-4">Menu Items</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Aksi & Alur Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {orders.map((order) => {
                  const nextAction = getNextStatusAction(order.status);
                  return (
                    <tr key={order.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <p
                          onClick={() => navigate(`/orders/${order.id}`)}
                          className="font-bold text-stone-900 font-mono hover:text-amber-700 cursor-pointer"
                        >
                          {order.orderNumber}
                        </p>
                        <p className="text-[11px] text-stone-400 mt-0.5">
                          {formatDateTime(order.createdAt)}
                        </p>
                      </td>

                      <td className="py-3.5 px-4">
                        {order.orderType === 'DineIn' ? (
                          <span className="inline-flex items-center gap-1.5 font-bold text-stone-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md text-[11px]">
                            <Grid className="w-3 h-3 text-amber-600" />
                            Meja #{order.tableNumber}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md text-[11px]">
                            Take Away
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-stone-700">
                        {order.userName || 'Staff'}
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="space-y-0.5">
                          {(order.items || []).slice(0, 2).map((it, idx) => (
                            <p key={idx} className="text-[11px] text-stone-600 truncate">
                              • <span className="font-semibold">{it.quantity}x</span> {it.menuName}
                            </p>
                          ))}
                          {order.items && order.items.length > 2 && (
                            <p className="text-[10px] text-amber-700 font-bold">
                              +{order.items.length - 2} menu lainnya...
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-amber-900 font-sans">
                        {formatRupiah(order.totalAmount)}
                      </td>

                      <td className="py-3.5 px-4">
                        <OrderStatusBadge status={order.status} />
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Next status progress button */}
                          {nextAction && (
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(order.id, nextAction.next)}
                              className={`px-2.5 py-1 text-[11px] font-bold text-white rounded-lg transition-colors cursor-pointer ${nextAction.color}`}
                            >
                              {nextAction.label}
                            </button>
                          )}

                          {/* Detail Page */}
                          <button
                            type="button"
                            onClick={() => navigate(`/orders/${order.id}`)}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                            title="Detail Order"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Print Receipt */}
                          <button
                            type="button"
                            onClick={() => setReceiptOrder(order)}
                            className="p-1.5 rounded-lg text-amber-700 hover:bg-amber-50 transition-colors"
                            title="Cetak Struk"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
export default OrderListPage;
