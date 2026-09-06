import React from 'react';
import { Users, Coffee, Edit, Trash2 } from 'lucide-react';
import { TABLE_STATUS_CONFIG } from '../../utils/constants';
import Card from '../common/Card';
import Badge from '../common/Badge';

export const TableCard = ({
  table,
  onSelectStatus,
  onCreateOrder,
  onEdit,
  onDelete,
  isAdmin = false,
}) => {
  const statusCfg = TABLE_STATUS_CONFIG[table.status] || TABLE_STATUS_CONFIG.Available;

  return (
    <Card
      hoverEffect
      className={`relative overflow-hidden flex flex-col justify-between border-2 transition-all ${statusCfg.border}`}
    >
      {/* Top Bar: Table Number & Status */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center font-extrabold text-base shadow-sm ${
              table.status === 'Available'
                ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                : table.status === 'Occupied'
                ? 'bg-amber-500 text-white shadow-amber-500/20'
                : 'bg-indigo-500 text-white shadow-indigo-500/20'
            }`}
          >
            {table.number}
          </div>
          <div>
            <h4 className="font-bold text-stone-900 text-base">Meja #{table.number}</h4>
            <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-0.5">
              <Users className="w-3.5 h-3.5" />
              <span>Kapasitas {table.capacity} Orang</span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <Badge
          variant={
            table.status === 'Available'
              ? 'success'
              : table.status === 'Occupied'
              ? 'warning'
              : 'info'
          }
          size="sm"
          dot
        >
          {table.status}
        </Badge>
      </div>

      {/* Center Table Visualization Graphic */}
      <div className="my-5 py-3 flex items-center justify-center bg-stone-50/70 rounded-xl border border-stone-100">
        <div className="flex items-center gap-2">
          {Array.from({ length: Math.min(table.capacity, 6) }).map((_, idx) => (
            <div
              key={idx}
              className={`w-2.5 h-2.5 rounded-full ${
                table.status === 'Occupied'
                  ? 'bg-amber-400'
                  : table.status === 'Reserved'
                  ? 'bg-indigo-400'
                  : 'bg-emerald-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
        {/* Quick status selector */}
        <button
          type="button"
          onClick={() => onSelectStatus(table)}
          className="text-xs font-bold text-stone-600 hover:text-amber-700 bg-stone-100 hover:bg-stone-200/80 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          Ubah Status
        </button>

        <div className="flex items-center gap-1">
          {/* Create Order Button for this table */}
          {onCreateOrder && (
            <button
              type="button"
              onClick={() => onCreateOrder(table)}
              className="inline-flex items-center gap-1 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 px-2.5 py-1.5 rounded-lg transition-colors shadow-sm shadow-amber-600/20 cursor-pointer"
            >
              <Coffee className="w-3 h-3" />
              <span>Order</span>
            </button>
          )}

          {isAdmin && onEdit && (
            <button
              type="button"
              onClick={() => onEdit(table)}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
              title="Edit Meja"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>
          )}

          {isAdmin && onDelete && (
            <button
              type="button"
              onClick={() => onDelete(table)}
              className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Hapus Meja"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};
export default TableCard;
