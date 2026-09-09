import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Grid,
  Clock,
  Printer,
  CheckCircle2,
  XCircle,
  Coffee,
  Receipt,
  User,
  AlertTriangle,
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import { formatRupiah, formatDateTime } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import OrderStatusBadge from '../../components/order/OrderStatusBadge';
import OrderReceiptModal from '../../components/order/OrderReceiptModal';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export const OrderDetailPage = () => {
  const { id } = useParams(); // Requirement React Router useParams()
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const fetchOrderDetail = async () => {
    setIsLoading(true);
    try {
      const res = await orderService.getById(id);
      if (res.success && res.data) {
        setOrder(res.data);
      } else {
        error(res.message || 'Pesanan tidak ditemukan');
      }
    } catch (err) {
      error(err.message || 'Gagal memuat detail pesanan');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrderDetail();
    }
  }, [id]);

  const handleUpdateStatus = async (newStatus) => {
    if (!order) return;
    const res = await orderService.updateStatus(order.id, newStatus);
    if (res.success) {
      success(`Status berhasil diubah menjadi ${newStatus}`);
      fetchOrderDetail();
    } else {
      error(res.message || 'Gagal mengubah status');
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-stone-400">
        <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold">Memuat detail pesanan...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <h3 className="text-lg font-bold text-stone-800">Pesanan tidak ditemukan</h3>
        <p className="text-xs text-stone-500 mt-1 mb-6">Order ID #{id} tidak ada di database.</p>
        <Button variant="outline" onClick={() => navigate('/orders')}>
          Kembali ke Daftar Pesanan
        </Button>
      </div>
    );
  }

  const subtotal = (order.items || []).reduce(
    (sum, item) => sum + (Number(item.subtotal) || item.price * item.quantity),
    0
  );
  const tax = Math.round(subtotal * 0.1);

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate('/orders')}
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-amber-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Pesanan</span>
        </button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsReceiptOpen(true)}
            icon={<Printer className="w-4 h-4 text-stone-900" />}
            className="uppercase tracking-wider font-extrabold text-xs"
          >
            Cetak Struk Transaksi
          </Button>
        </div>
      </div>

      {/* Main Order Card */}
      <Card className="bg-white border-stone-200 shadow-card">
        {/* Order Header Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-stone-900 font-mono tracking-tight">
                {order.orderNumber}
              </h1>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="text-xs text-stone-500 mt-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Dibuat pada {formatDateTime(order.createdAt)}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs">
              <span className="text-stone-400 block text-[10px] font-bold uppercase">Kasir</span>
              <span className="font-bold text-stone-800">{order.userName || 'Staff'}</span>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs">
              <span className="text-amber-700 block text-[10px] font-bold uppercase">Tipe</span>
              <span className="font-bold text-amber-950">
                {order.orderType === 'DineIn' ? `Meja #${order.tableNumber}` : 'Take Away'}
              </span>
            </div>
          </div>
        </div>

        {/* Status Workflow Actions */}
        <div className="py-4 border-b border-stone-100 bg-stone-50/50 -mx-5 px-5 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs">
            <span className="font-bold text-stone-700">Ubah Status Alur Dapur / Bar:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleUpdateStatus('Pending')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                order.status === 'Pending'
                  ? 'bg-amber-500 text-white border-amber-600'
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
            >
              1. Pending
            </button>
            <button
              onClick={() => handleUpdateStatus('Preparing')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                order.status === 'Preparing'
                  ? 'bg-blue-600 text-white border-blue-700'
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
            >
              2. Preparing
            </button>
            <button
              onClick={() => handleUpdateStatus('Ready')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                order.status === 'Ready'
                  ? 'bg-purple-600 text-white border-purple-700'
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
            >
              3. Ready
            </button>
            <button
              onClick={() => handleUpdateStatus('Completed')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                order.status === 'Completed'
                  ? 'bg-emerald-600 text-white border-emerald-700'
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
            >
              4. Completed
            </button>
            <button
              onClick={() => handleUpdateStatus('Cancelled')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                order.status === 'Cancelled'
                  ? 'bg-rose-600 text-white border-rose-700'
                  : 'bg-white text-rose-600 border-rose-200 hover:bg-rose-50'
              }`}
            >
              Batal (Cancel)
            </button>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="py-4">
          <h3 className="font-bold text-sm text-stone-900 mb-3">Detail Menu Dipesan</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Menu</th>
                  <th className="py-2.5 px-3">Harga Satuan</th>
                  <th className="py-2.5 px-3 text-center">Jumlah</th>
                  <th className="py-2.5 px-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {(order.items || []).map((item, idx) => (
                  <tr key={idx} className="hover:bg-amber-50/20">
                    <td className="py-3 px-3 font-semibold text-stone-900">
                      {item.menuName}
                      {item.note && (
                        <span className="block text-[11px] text-amber-700 font-normal italic">
                          Catatan: {item.note}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-stone-600">{formatRupiah(item.price)}</td>
                    <td className="py-3 px-3 text-center font-bold">{item.quantity}</td>
                    <td className="py-3 px-3 text-right font-bold text-stone-900">
                      {formatRupiah(item.subtotal || item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Total Calculation Section */}
        <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row justify-end">
          <div className="w-full sm:max-w-xs space-y-2 text-xs">
            <div className="flex justify-between text-stone-500">
              <span>Subtotal Item:</span>
              <span className="font-semibold text-stone-800">{formatRupiah(subtotal)}</span>
            </div>
            <div className="flex justify-between text-stone-500">
              <span>Pajak Restoran PB1 (10%):</span>
              <span className="font-semibold text-stone-800">{formatRupiah(tax)}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-stone-900 pt-2 border-t border-stone-200">
              <span>TOTAL PEMBAYARAN:</span>
              <span className="text-amber-800 font-sans">
                {formatRupiah(order.totalAmount || subtotal + tax)}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Printable Receipt Modal */}
      <OrderReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        order={order}
      />
    </div>
  );
};
export default OrderDetailPage;
