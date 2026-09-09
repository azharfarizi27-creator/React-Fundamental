import React from 'react';
import { Printer, Coffee, Check } from 'lucide-react';
import { formatRupiah, formatDateTime } from '../../utils/formatters';
import Modal from '../common/Modal';
import Button from '../common/Button';

export const OrderReceiptModal = ({ isOpen, onClose, order }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const subtotal = (order.items || []).reduce(
    (sum, item) => sum + (Number(item.subtotal) || item.price * item.quantity),
    0
  );
  const tax = Math.round(subtotal * 0.1);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Struk Transaksi Caffèra"
      subtitle={`No. Pesanan: ${order.orderNumber}`}
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        {/* Thermal Receipt Visual Paper */}
        <div className="p-6 bg-[#fbfaf6] border border-dashed border-stone-300 rounded-2xl font-mono text-xs text-stone-800 space-y-4 shadow-inner">
          {/* Header */}
          <div className="text-center border-b border-dashed border-stone-300 pb-4">
            <div className="flex items-center justify-center gap-1.5 text-amber-700 font-sans font-black text-lg">
              <Coffee className="w-5 h-5" />
              <span>CAFFÈRA</span>
            </div>
            <p className="text-[10px] text-stone-500 font-sans mt-0.5">
              Artisan Coffee & Culinary Experience
            </p>
            <p className="text-[10px] text-stone-400 font-sans">
              Jl. Mahasiswa No. 27, Kampus Selatan
            </p>
          </div>

          {/* Meta Information */}
          <div className="space-y-1 text-[11px] border-b border-dashed border-stone-300 pb-3">
            <div className="flex justify-between">
              <span className="text-stone-500">Order:</span>
              <span className="font-bold">{order.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Waktu:</span>
              <span>{formatDateTime(order.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Kasir:</span>
              <span>{order.userName || 'Staff'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Tipe / Meja:</span>
              <span className="font-bold">
                {order.orderType === 'DineIn' ? `Dine In (Meja #${order.tableNumber})` : 'Take Away'}
              </span>
            </div>
          </div>

          {/* Itemized List */}
          <div className="space-y-2 border-b border-dashed border-stone-300 pb-3">
            {(order.items || []).map((item, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex justify-between font-medium">
                  <span className="line-clamp-1">{item.menuName}</span>
                  <span>{formatRupiah(item.subtotal || item.price * item.quantity)}</span>
                </div>
                <div className="flex justify-between text-[10px] text-stone-500">
                  <span>
                    {item.quantity} x {formatRupiah(item.price)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Calculations */}
          <div className="space-y-1 text-[11px] border-b border-dashed border-stone-300 pb-3">
            <div className="flex justify-between">
              <span className="text-stone-500">Subtotal:</span>
              <span>{formatRupiah(order.subtotal || subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">PB1 Restoran (10%):</span>
              <span>{formatRupiah(order.tax !== undefined ? order.tax : tax)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-stone-700 font-bold">
                <span>Diskon ({order.discountCode || 'Promo'}):</span>
                <span>-{formatRupiah(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold pt-1 text-stone-900 border-t border-dashed border-stone-200">
              <span>TOTAL BAYAR:</span>
              <span>{formatRupiah(order.totalAmount || subtotal + tax)}</span>
            </div>
            <div className="flex justify-between text-[11px] pt-1 text-stone-600">
              <span>Metode Bayar:</span>
              <span className="font-bold uppercase">{order.paymentMethod || 'Tunai (Cash)'}</span>
            </div>
            {order.cashReceived && (
              <>
                <div className="flex justify-between text-[11px] text-stone-500">
                  <span>Uang Diterima:</span>
                  <span>{formatRupiah(order.cashReceived)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-stone-500">
                  <span>Kembalian:</span>
                  <span>{formatRupiah(order.cashChange || 0)}</span>
                </div>
              </>
            )}
          </div>

          {/* Footer Note */}
          <div className="text-center pt-2 text-[10px] text-stone-400 font-sans">
            <p>Terima kasih atas kunjungan Anda!</p>
            <p>Password WiFi: <span className="font-mono text-stone-600 font-bold">cafferabrew2026</span></p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
          <Button
            variant="primary"
            onClick={handlePrint}
            icon={<Printer className="w-4 h-4" />}
          >
            Cetak Struk
          </Button>
        </div>
      </div>
    </Modal>
  );
};
export default OrderReceiptModal;
