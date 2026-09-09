import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, ExternalLink, Printer, X, Check } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';

export const TableQrModal = ({ isOpen, onClose, table }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = React.useState(false);

  if (!table) return null;

  const orderUrl = `${window.location.origin}/table-order/${table.number}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(orderUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenGuestPage = () => {
    window.open(`/table-order/${table.number}`, '_blank');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`QR Code Meja #${table.number}`}
      subtitle="Stiker QR Code Akrilik untuk Pemesanan Mandiri Pelanggan di Meja"
      maxWidth="max-w-md"
    >
      <div className="space-y-6 text-center">
        {/* Printable QR Acrylic Badge Preview */}
        <div className="p-6 bg-stone-50 border-2 border-dashed border-stone-300 rounded-none flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-1 bg-[#fbb710] mb-1" />
          <div className="flex items-center gap-1">
            <span className="font-extrabold text-xl tracking-tight text-stone-950">
              Caffè
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#fbb710] inline-block" />
            <span className="font-extrabold text-xl tracking-tight text-stone-950">
              ra
            </span>
          </div>
          <p className="text-[10px] font-black tracking-[0.2em] text-stone-400 uppercase">
            SELF-ORDER QR CODE
          </p>

          {/* Simulated High-Res QR SVG */}
          <div className="p-4 bg-white border border-stone-200 shadow-xs my-2">
            <svg
              className="w-44 h-44 text-stone-950"
              viewBox="0 0 100 100"
              fill="currentColor"
            >
              {/* QR Pattern Representation */}
              <rect width="100" height="100" fill="#ffffff" />
              {/* Corners */}
              <rect x="5" y="5" width="30" height="30" fill="#131212" />
              <rect x="9" y="9" width="22" height="22" fill="#ffffff" />
              <rect x="13" y="13" width="14" height="14" fill="#fbb710" />

              <rect x="65" y="5" width="30" height="30" fill="#131212" />
              <rect x="69" y="9" width="22" height="22" fill="#ffffff" />
              <rect x="73" y="13" width="14" height="14" fill="#fbb710" />

              <rect x="5" y="65" width="30" height="30" fill="#131212" />
              <rect x="9" y="69" width="22" height="22" fill="#ffffff" />
              <rect x="13" y="73" width="14" height="14" fill="#fbb710" />

              {/* Data modules */}
              <rect x="42" y="10" width="8" height="8" fill="#131212" />
              <rect x="52" y="18" width="6" height="6" fill="#131212" />
              <rect x="40" y="28" width="10" height="6" fill="#131212" />
              <rect x="10" y="42" width="6" height="10" fill="#131212" />
              <rect x="22" y="48" width="10" height="6" fill="#131212" />
              <rect x="40" y="42" width="20" height="20" fill="#131212" />
              <rect x="45" y="47" width="10" height="10" fill="#fbb710" />
              <rect x="68" y="42" width="8" height="8" fill="#131212" />
              <rect x="80" y="50" width="10" height="6" fill="#131212" />
              <rect x="42" y="68" width="8" height="10" fill="#131212" />
              <rect x="55" y="78" width="10" height="8" fill="#131212" />
              <rect x="70" y="70" width="12" height="8" fill="#131212" />
              <rect x="85" y="80" width="8" height="12" fill="#131212" />
            </svg>
          </div>

          <div className="bg-stone-950 text-white px-4 py-1.5 font-black text-sm uppercase tracking-wider">
            MEJA #{table.number}
          </div>
          <p className="text-[11px] text-stone-500">
            Scan untuk melihat menu & memesan langsung dari kursi Anda
          </p>
        </div>

        {/* Link URL Bar */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={orderUrl}
            className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-200 text-stone-600 font-mono select-all focus:outline-none"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="shrink-0 text-xs font-bold"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : 'Salin Link'}
          </Button>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-stone-100">
          <Button variant="outline" size="md" onClick={onClose}>
            Tutup
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={handleOpenGuestPage}
            iconRight={<ExternalLink className="w-4 h-4" />}
            className="uppercase tracking-wider font-extrabold text-xs"
          >
            Buka Halaman Tamu Meja #{table.number}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
export default TableQrModal;
