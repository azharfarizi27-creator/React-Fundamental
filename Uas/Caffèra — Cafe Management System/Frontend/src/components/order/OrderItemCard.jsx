import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';

export const OrderItemCard = ({
  item,
  onIncrement,
  onDecrement,
  onRemove,
  onNoteChange,
}) => {
  return (
    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={item.imageUrl || 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=100&auto=format&fit=crop&q=80'}
            alt={item.name}
            className="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0"
          />
          <div className="min-w-0">
            <h5 className="text-xs font-bold text-stone-900 truncate">{item.name}</h5>
            <p className="text-[11px] font-semibold text-amber-700">
              {formatRupiah(item.price)}
            </p>
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onDecrement}
            className="w-6 h-6 rounded-md bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="w-6 text-center text-xs font-bold text-stone-900">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={onIncrement}
            className="w-6 h-6 rounded-md bg-amber-600 text-white hover:bg-amber-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <Plus className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="p-1 text-stone-400 hover:text-rose-600 ml-1 rounded transition-colors"
            title="Hapus Item"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Note Input */}
      {onNoteChange && (
        <input
          type="text"
          value={item.note || ''}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="Catatan khusus (e.g. Less ice, no sugar)..."
          className="w-full px-2.5 py-1 text-[11px] bg-white border border-stone-200 rounded-lg placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500/30"
        />
      )}
    </div>
  );
};
export default OrderItemCard;
