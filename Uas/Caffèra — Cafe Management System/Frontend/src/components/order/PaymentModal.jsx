import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Banknote,
  QrCode,
  CheckCircle,
  AlertCircle,
  Tag,
  X,
  Printer,
} from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';
import Button from '../common/Button';

export const PaymentModal = ({
  isOpen,
  onClose,
  subtotal,
  tax,
  discountAmount = 0,
  discountCode = '',
  totalAmount,
  onApplyVoucher,
  onRemoveVoucher,
  onConfirmPayment,
  isProcessing = false,
}) => {
  const [paymentMethod, setPaymentMethod] = useState('Cash'); // Cash, QRIS, Debit
  const [voucherInput, setVoucherInput] = useState('');
  const [cashReceived, setCashReceived] = useState('');
  const [cardRefNumber, setCardRefNumber] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCashReceived(String(totalAmount));
      setVoucherInput(discountCode || '');
    }
  }, [isOpen, totalAmount, discountCode]);

  if (!isOpen) return null;

  const numericCash = Number(cashReceived) || 0;
  const changeAmount = numericCash - totalAmount;
  const isCashSufficient = numericCash >= totalAmount;

  // Preset cash nominals
  const cashPresets = [
    { label: 'Uang Pas', value: totalAmount },
    { label: 'Rp 20.000', value: 20000 },
    { label: 'Rp 50.000', value: 50000 },
    { label: 'Rp 100.000', value: 100000 },
    { label: 'Rp 200.000', value: 200000 },
  ].filter((p) => p.value >= totalAmount || p.label === 'Uang Pas');

  const handleApplyVoucherCode = (e) => {
    e.preventDefault();
    if (voucherInput.trim() && onApplyVoucher) {
      onApplyVoucher(voucherInput.trim());
    }
  };

  const handleFinalSubmit = () => {
    if (paymentMethod === 'Cash' && !isCashSufficient) {
      return;
    }

    onConfirmPayment({
      paymentMethod,
      cashReceived: paymentMethod === 'Cash' ? numericCash : totalAmount,
      cashChange: paymentMethod === 'Cash' ? Math.max(0, changeAmount) : 0,
      cardRefNumber: paymentMethod === 'Debit' ? cardRefNumber : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white max-w-lg w-full border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-stone-950 text-white flex items-center justify-between">
          <div>
            <div className="w-8 h-1 bg-[#fbb710] mb-1.5" />
            <h3 className="text-base font-black uppercase tracking-wider">
              Pembayaran & Checkout POS
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Bill Summary Box */}
          <div className="p-4 bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex justify-between text-xs text-stone-600 font-bold">
              <span>Subtotal Pesanan:</span>
              <span>{formatRupiah(subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs text-stone-600 font-bold">
              <span>PB1 Restoran (10%):</span>
              <span>{formatRupiah(tax)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-xs text-emerald-600 font-bold">
                <span className="flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Voucher Diskon ({discountCode}):</span>
                </span>
                <span>-{formatRupiah(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between items-baseline pt-2 border-t border-stone-200 text-stone-950">
              <span className="text-xs font-black uppercase tracking-wider">Total Tagihan:</span>
              <span className="text-xl font-black text-[#e59e07]">
                {formatRupiah(totalAmount)}
              </span>
            </div>
          </div>

          {/* Voucher Promo Section */}
          <div>
            <label className="block text-[10px] font-black text-stone-700 uppercase tracking-widest mb-1.5">
              Kode Voucher Diskon
            </label>
            <form onSubmit={handleApplyVoucherCode} className="flex gap-2">
              <input
                type="text"
                value={voucherInput}
                onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
                placeholder="e.g. CAFF10 / HEMAT20"
                className="flex-1 px-3 py-2 text-xs font-mono font-bold bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#fbb710] focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-stone-950 hover:bg-stone-800 text-white text-xs font-black uppercase tracking-wider transition cursor-pointer"
              >
                Terapkan
              </button>
              {discountAmount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    onRemoveVoucher();
                    setVoucherInput('');
                  }}
                  className="px-3 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-bold"
                >
                  Hapus
                </button>
              )}
            </form>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-[10px] font-black text-stone-700 uppercase tracking-widest mb-1.5">
              Metode Pembayaran
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('Cash')}
                className={`py-3 px-2 flex flex-col items-center justify-center gap-1.5 border transition cursor-pointer ${
                  paymentMethod === 'Cash'
                    ? 'border-stone-950 bg-[#fbb710]/15 text-stone-950 font-black'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-600 font-bold'
                }`}
              >
                <Banknote className="w-5 h-5 text-stone-900" />
                <span className="text-xs uppercase">Tunai (Cash)</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('QRIS')}
                className={`py-3 px-2 flex flex-col items-center justify-center gap-1.5 border transition cursor-pointer ${
                  paymentMethod === 'QRIS'
                    ? 'border-stone-950 bg-[#fbb710]/15 text-stone-950 font-black'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-600 font-bold'
                }`}
              >
                <QrCode className="w-5 h-5 text-stone-900" />
                <span className="text-xs uppercase">QRIS Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Debit')}
                className={`py-3 px-2 flex flex-col items-center justify-center gap-1.5 border transition cursor-pointer ${
                  paymentMethod === 'Debit'
                    ? 'border-stone-950 bg-[#fbb710]/15 text-stone-950 font-black'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-600 font-bold'
                }`}
              >
                <CreditCard className="w-5 h-5 text-stone-900" />
                <span className="text-xs uppercase">Debit / EDC</span>
              </button>
            </div>
          </div>

          {/* Payment Method Detail Content */}
          {paymentMethod === 'Cash' && (
            <div className="p-4 bg-stone-50 border border-stone-200 space-y-3">
              <div>
                <label className="block text-[10px] font-black text-stone-700 uppercase tracking-widest mb-1">
                  Uang Tunai Diterima (Rp)
                </label>
                <input
                  type="number"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(e.target.value)}
                  placeholder="0"
                  min="0"
                  className="w-full px-3.5 py-2.5 text-base font-black text-stone-950 bg-white border border-stone-300 focus:border-[#fbb710] focus:outline-none"
                />
              </div>

              {/* Quick preset nominal chips */}
              <div className="flex flex-wrap gap-1.5">
                {cashPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCashReceived(String(preset.value))}
                    className={`px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider border transition cursor-pointer ${
                      numericCash === preset.value
                        ? 'bg-stone-950 text-white border-stone-950'
                        : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Live Change Indicator */}
              <div className="pt-2 border-t border-stone-200 flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-wider text-stone-600">
                  Uang Kembalian:
                </span>
                <span
                  className={`text-base font-black ${
                    isCashSufficient ? 'text-emerald-700' : 'text-rose-600'
                  }`}
                >
                  {isCashSufficient
                    ? formatRupiah(changeAmount)
                    : `Kurang ${formatRupiah(Math.abs(changeAmount))}`}
                </span>
              </div>
            </div>
          )}

          {paymentMethod === 'QRIS' && (
            <div className="p-5 bg-stone-50 border border-stone-200 flex flex-col items-center justify-center text-center space-y-3">
              <div className="p-3 bg-white border-2 border-stone-950 shadow-md">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=caffera-qris-payment-${totalAmount}`}
                  alt="QRIS Payment Code"
                  className="w-40 h-40 object-contain"
                />
              </div>
              <div>
                <p className="text-xs font-black text-stone-900 uppercase">
                  Scan QRIS untuk Bayar: {formatRupiah(totalAmount)}
                </p>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Mendukung BCA, GoPay, OVO, ShopeePay, DANA, & LinkAja
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider rounded-full">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Menunggu Konfirmasi Kasir
              </span>
            </div>
          )}

          {paymentMethod === 'Debit' && (
            <div className="p-4 bg-stone-50 border border-stone-200 space-y-3">
              <div>
                <label className="block text-[10px] font-black text-stone-700 uppercase tracking-widest mb-1">
                  Nomor Referensi Mesin EDC / Approval Code (Opsional)
                </label>
                <input
                  type="text"
                  value={cardRefNumber}
                  onChange={(e) => setCardRefNumber(e.target.value)}
                  placeholder="e.g. REF-983172"
                  className="w-full px-3 py-2 text-xs font-mono font-bold bg-white border border-stone-300 focus:border-[#fbb710] focus:outline-none"
                />
              </div>
              <p className="text-[11px] text-stone-500">
                Pastikan transaksi di mesin EDC nasabah telah berhasil (Approval Approved).
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Batal
          </Button>

          <Button
            variant="primary"
            onClick={handleFinalSubmit}
            disabled={isProcessing || (paymentMethod === 'Cash' && !isCashSufficient)}
            isLoading={isProcessing}
            className="font-black uppercase tracking-wider text-xs px-6"
            icon={<Printer className="w-4 h-4" />}
          >
            Selesaikan & Cetak Struk
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
