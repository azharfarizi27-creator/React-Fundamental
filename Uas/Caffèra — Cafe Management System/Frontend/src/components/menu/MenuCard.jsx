import React from 'react';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, Eye } from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';
import Badge from '../common/Badge';

export const MenuCard = ({
  menu,
  isAdmin = false,
  onEdit,
  onDelete,
  onToggleAvailability,
  onAddToCart,
  onViewDetail,
}) => {
  return (
    <div className="group relative bg-white border border-stone-200/90 rounded-none overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-lg">
      {/* Header Info Area (Amado Editorial Style) */}
      <div className="p-5 pb-3">
        {/* Yellow Top Accent Line */}
        <div className="w-10 h-1 bg-[#fbb710] mb-3" />

        {/* Price Prefix */}
        <p className="text-xs font-bold text-stone-500 tracking-wide">
          From {formatRupiah(menu.price)}
        </p>

        {/* Title */}
        <h3
          onClick={() => onViewDetail && onViewDetail(menu.id)}
          className="text-lg xl:text-xl font-black text-stone-950 mt-1 line-clamp-1 cursor-pointer group-hover:text-[#e59e07] transition-colors"
        >
          {menu.name}
        </h3>

        {/* Category & Status */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
            {menu.categoryName || 'Menu'}
          </span>
          <span className="text-stone-300">•</span>
          <span
            className={`text-[10px] font-bold uppercase tracking-wider ${
              menu.isAvailable ? 'text-emerald-600' : 'text-rose-500'
            }`}
          >
            {menu.isAvailable ? 'In Stock' : 'Sold Out'}
          </span>
        </div>
      </div>

      {/* Product Image Area */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100 mt-2">
        <img
          src={
            menu.imageUrl ||
            'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&auto=format&fit=crop&q=80'
          }
          alt={menu.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Availability Overlay if Sold Out */}
        {!menu.isAvailable && (
          <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center">
            <span className="px-3 py-1 bg-rose-600 text-white text-xs font-black uppercase tracking-widest">
              Habis / Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Bottom Action Footer */}
      <div className="p-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2 bg-stone-50/50">
        {/* Detail Link */}
        {onViewDetail && (
          <button
            onClick={() => onViewDetail(menu.id)}
            className="text-xs font-bold text-stone-600 hover:text-stone-950 inline-flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Detail</span>
          </button>
        )}

        <div className="flex items-center gap-1.5 ml-auto">
          {/* Availability Toggle */}
          {onToggleAvailability && (
            <button
              type="button"
              title={menu.isAvailable ? 'Tandai Kosong' : 'Tandai Tersedia'}
              onClick={() => onToggleAvailability(menu.id)}
              className={`p-1.5 border transition-colors cursor-pointer ${
                menu.isAvailable
                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                  : 'text-rose-700 bg-rose-50 border-rose-200 hover:bg-rose-100'
              }`}
            >
              {menu.isAvailable ? (
                <CheckCircle className="w-3.5 h-3.5" />
              ) : (
                <XCircle className="w-3.5 h-3.5" />
              )}
            </button>
          )}

          {/* Admin Edit */}
          {isAdmin && onEdit && (
            <button
              type="button"
              onClick={() => onEdit(menu)}
              className="p-1.5 border border-stone-200 bg-white text-stone-700 hover:bg-stone-100 hover:text-stone-950 transition-colors cursor-pointer"
              title="Edit Menu"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Admin Delete */}
          {isAdmin && onDelete && (
            <button
              type="button"
              onClick={() => onDelete(menu)}
              className="p-1.5 border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Hapus Menu"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Add to POS Cart */}
          {onAddToCart && (
            <button
              disabled={!menu.isAvailable}
              onClick={() => onAddToCart(menu)}
              className="px-3 py-1.5 bg-[#fbb710] hover:bg-[#e5a607] disabled:opacity-40 disabled:cursor-not-allowed text-stone-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Pilih</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default MenuCard;
