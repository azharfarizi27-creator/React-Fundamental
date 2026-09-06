import React from 'react';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, Eye } from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';

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
    <Card hoverEffect padding="p-0" className="overflow-hidden flex flex-col h-full group bg-white">
      {/* Image & Badges Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        <img
          src={menu.imageUrl || 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&auto=format&fit=crop&q=80'}
          alt={menu.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 bg-stone-900/80 backdrop-blur-md text-amber-300 text-[11px] font-bold rounded-lg border border-amber-400/20 shadow-sm">
            {menu.categoryName || 'Menu'}
          </span>
        </div>

        {/* Availability Badge */}
        <div className="absolute top-3 right-3">
          <Badge
            variant={menu.isAvailable ? 'success' : 'danger'}
            size="sm"
            dot
            className="backdrop-blur-md shadow-sm"
          >
            {menu.isAvailable ? 'Available' : 'Sold Out'}
          </Badge>
        </div>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 left-3">
          <p className="text-white text-base font-extrabold drop-shadow-md">
            {formatRupiah(menu.price)}
          </p>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h4
            onClick={() => onViewDetail && onViewDetail(menu.id)}
            className="font-bold text-stone-900 text-base leading-snug group-hover:text-amber-700 transition-colors cursor-pointer line-clamp-1"
          >
            {menu.name}
          </h4>
          <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
            {menu.description || 'Tidak ada deskripsi tersedia.'}
          </p>
        </div>

        {/* Actions Bar */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          {/* Detail Link */}
          {onViewDetail && (
            <button
              onClick={() => onViewDetail(menu.id)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-amber-700 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Detail</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 ml-auto">
            {/* Quick Toggle Availability for Staff */}
            {onToggleAvailability && (
              <button
                type="button"
                title={menu.isAvailable ? 'Tandai Kosong' : 'Tandai Tersedia'}
                onClick={() => onToggleAvailability(menu.id)}
                className={`p-1.5 rounded-lg border transition-colors ${
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

            {/* Admin Edit / Delete */}
            {isAdmin && onEdit && (
              <button
                type="button"
                onClick={() => onEdit(menu)}
                className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors"
                title="Edit Menu"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}

            {isAdmin && onDelete && (
              <button
                type="button"
                onClick={() => onDelete(menu)}
                className="p-1.5 rounded-lg border border-rose-100 text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors"
                title="Hapus Menu"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Add to POS Cart */}
            {onAddToCart && (
              <Button
                size="sm"
                variant={menu.isAvailable ? 'primary' : 'outline'}
                disabled={!menu.isAvailable}
                onClick={() => onAddToCart(menu)}
                className="px-2.5 py-1.5 text-xs"
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                {menu.isAvailable ? 'Tambah' : 'Habis'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
export default MenuCard;
