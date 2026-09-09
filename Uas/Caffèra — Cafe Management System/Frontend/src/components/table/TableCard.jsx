import React from 'react';
import { Users, Coffee, Edit, Trash2, QrCode, PlusCircle } from 'lucide-react';
import { TABLE_STATUS_CONFIG } from '../../utils/constants';

export const TableCard = ({
  table,
  onSelectStatus,
  onCreateOrder,
  onViewQr,
  onEdit,
  onDelete,
  isAdmin = false,
}) => {
  return (
    <div className="bg-white border border-stone-200/90 p-5 flex flex-col justify-between transition-all hover:shadow-md">
      {/* Top Accent Line */}
      <div>
        <div
          className={`w-8 h-1 mb-3 ${
            table.status === 'Available'
              ? 'bg-emerald-500'
              : table.status === 'Occupied'
              ? 'bg-[#fbb710]'
              : 'bg-indigo-500'
          }`}
        />

        {/* Top Bar: Table Number & Status */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-stone-400">
              Meja Makan
            </p>
            <h4 className="font-black text-stone-950 text-xl mt-0.5">Meja #{table.number}</h4>
            <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-1">
              <Users className="w-3.5 h-3.5" />
              <span>Kapasitas {table.capacity} Orang</span>
            </div>
          </div>

          {/* Status Badge */}
          <span
            className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
              table.status === 'Available'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : table.status === 'Occupied'
                ? 'bg-[#fbb710]/20 text-stone-950 border border-[#fbb710]/40'
                : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
            }`}
          >
            {table.status}
          </span>
        </div>
      </div>

      {/* Center Table Visualization Graphic */}
      <div className="my-5 py-3 flex items-center justify-between px-3 bg-stone-50 border border-stone-100">
        <div className="flex items-center gap-2">
          {Array.from({ length: Math.min(table.capacity, 6) }).map((_, idx) => (
            <div
              key={idx}
              className={`w-2.5 h-2.5 rounded-full ${
                table.status === 'Occupied'
                  ? 'bg-[#fbb710]'
                  : table.status === 'Reserved'
                  ? 'bg-indigo-400'
                  : 'bg-emerald-400'
              }`}
            />
          ))}
        </div>

        {/* QR Code Self-Order Trigger */}
        {onViewQr && (
          <button
            type="button"
            onClick={() => onViewQr(table)}
            className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-stone-700 hover:text-black bg-white hover:bg-neutral-100 border border-stone-200 px-2 py-1 transition cursor-pointer"
            title="Lihat QR Code Meja"
          >
            <QrCode className="w-3.5 h-3.5 text-[#fbb710]" />
            <span>QR Menu</span>
          </button>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
        {/* Quick status selector */}
        <button
          type="button"
          onClick={() => onSelectStatus(table)}
          className="text-xs font-bold text-stone-700 hover:text-stone-950 bg-stone-100 hover:bg-stone-200 px-2.5 py-1.5 transition-colors cursor-pointer"
        >
          Status
        </button>

        <div className="flex items-center gap-1">
          {/* Create / Add Order Button for this table */}
          {onCreateOrder && (
            <button
              type="button"
              onClick={() => onCreateOrder(table)}
              className={`inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider px-2.5 py-1.5 transition-colors shadow-xs cursor-pointer ${
                table.status === 'Occupied'
                  ? 'bg-black text-white hover:bg-neutral-800'
                  : 'bg-[#fbb710] text-stone-950 hover:bg-[#e5a607]'
              }`}
            >
              {table.status === 'Occupied' ? (
                <>
                  <PlusCircle className="w-3 h-3 text-[#fbb710]" />
                  <span>+ Tambah</span>
                </>
              ) : (
                <>
                  <Coffee className="w-3 h-3" />
                  <span>Order</span>
                </>
              )}
            </button>
          )}

          {isAdmin && onEdit && (
            <button
              type="button"
              onClick={() => onEdit(table)}
              className="p-1.5 border border-stone-200 text-stone-600 hover:text-stone-950 hover:bg-stone-100 transition-colors"
              title="Edit Meja"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>
          )}

          {isAdmin && onDelete && (
            <button
              type="button"
              onClick={() => onDelete(table)}
              className="p-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
              title="Hapus Meja"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default TableCard;
