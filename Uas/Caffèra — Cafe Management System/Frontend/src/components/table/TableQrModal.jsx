import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, ExternalLink, Printer, Check, Copy, Sparkles } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';

export const TableQrModal = ({ isOpen, onClose, table }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [isImgLoaded, setIsImgLoaded] = useState(false);

  if (!table) return null;

  // Real URL that customer phone will open when scanning
  const orderUrl = `${window.location.origin}/table-order/${table.number}`;
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    orderUrl
  )}&margin=10&color=1c1917&bgcolor=ffffff`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(orderUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenGuestPage = () => {
    window.open(`/table-order/${table.number}`, '_blank');
  };

  const handlePrintBadge = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`QR Code Meja #${table.number}`}
      subtitle="Scan dengan kamera HP pelanggan untuk pesan langsung dari meja"
      maxWidth="max-w-md"
    >
      <div className="space-y-5 text-center">
        {/* Printable QR Acrylic Badge Card */}
        <div
          id="printable-table-qr"
          className="p-6 bg-gradient-to-b from-stone-50 to-stone-100 border-2 border-stone-800 shadow-lg flex flex-col items-center justify-center space-y-3 relative"
        >
          {/* Header Brand */}
          <div className="flex items-center gap-1">
            <span className="font-black text-2xl tracking-tight text-stone-950">Caffè</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#fbb710] inline-block" />
            <span className="font-black text-2xl tracking-tight text-stone-950">ra</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-[#fbb710]/20 border border-[#fbb710]/40 rounded-full">
            <Sparkles className="w-3 h-3 text-amber-700" />
            <p className="text-[10px] font-black tracking-widest text-amber-900 uppercase">
              SCAN & ORDER MENU
            </p>
          </div>

          {/* Real Dynamic Scannable QR Code Image */}
          <div className="p-3 bg-white border-2 border-stone-950 shadow-md my-1 rounded-sm relative">
            {!isImgLoaded && (
              <div className="w-48 h-48 flex flex-col items-center justify-center bg-stone-100 text-stone-400">
                <div className="w-6 h-6 border-2 border-[#fbb710] border-t-transparent rounded-full animate-spin mb-2" />
                <span className="text-[10px] font-bold">Membuat QR Code...</span>
              </div>
            )}
            <img
              src={qrApiUrl}
              alt={`QR Code Meja #${table.number}`}
              onLoad={() => setIsImgLoaded(true)}
              className={`w-48 h-48 object-contain transition-opacity duration-300 ${
                isImgLoaded ? 'opacity-100 block' : 'opacity-0 absolute'
              }`}
            />
          </div>

          {/* Table Badge Number */}
          <div className="bg-stone-950 text-white px-6 py-1.5 font-black text-base uppercase tracking-widest shadow-xs">
            MEJA #{table.number}
          </div>

          <p className="text-xs font-bold text-stone-700 max-w-[240px]">
            Arahkan kamera smartphone Anda ke QR Code untuk melihat menu & memesan
          </p>

          <div className="text-[10px] text-stone-400 font-mono">
            Kapasitas: {table.capacity || 4} Orang • Status:{' '}
            <span
              className={
                table.status === 'Available'
                  ? 'text-emerald-600 font-bold'
                  : 'text-amber-600 font-bold'
              }
            >
              {table.status}
            </span>
          </div>
        </div>

        {/* URL Bar & Copy Button */}
        <div className="space-y-1.5 text-left">
          <label className="text-[10px] font-black uppercase tracking-wider text-stone-500">
            Tautan Pemesanan Mandiri (Self-Order URL)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={orderUrl}
              className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-200 text-stone-700 font-mono select-all focus:outline-none focus:border-[#fbb710]"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              icon={copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              className="shrink-0 text-xs font-bold"
            >
              {copied ? 'Tersalin!' : 'Salin'}
            </Button>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-3 border-t border-stone-100">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" onClick={onClose} className="flex-1 sm:flex-initial">
              Tutup
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrintBadge}
              icon={<Printer className="w-3.5 h-3.5" />}
              className="flex-1 sm:flex-initial font-bold"
              title="Cetak Stiker Meja"
            >
              Cetak
            </Button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenGuestPage}
            iconRight={<ExternalLink className="w-3.5 h-3.5" />}
            className="w-full sm:w-auto uppercase tracking-wider font-extrabold text-xs"
          >
            Buka Halaman Tamu Meja #{table.number}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TableQrModal;
