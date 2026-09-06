import React from 'react';
import Modal from '../common/Modal';
import { TABLE_STATUS } from '../../utils/constants';

export const TableStatusModal = ({
  isOpen,
  onClose,
  table,
  onUpdateStatus,
}) => {
  if (!table) return null;

  const statuses = [
    {
      key: TABLE_STATUS.AVAILABLE,
      label: 'Available (Kosong)',
      desc: 'Meja bersih dan siap ditempati tamu baru.',
      color: 'hover:border-emerald-500 hover:bg-emerald-50/50',
      activeColor: 'border-emerald-500 bg-emerald-50 text-emerald-900',
    },
    {
      key: TABLE_STATUS.OCCUPIED,
      label: 'Occupied (Terisi)',
      desc: 'Sedang digunakan pelanggan untuk makan/minum.',
      color: 'hover:border-amber-500 hover:bg-amber-50/50',
      activeColor: 'border-amber-500 bg-amber-50 text-amber-900',
    },
    {
      key: TABLE_STATUS.RESERVED,
      label: 'Reserved (Dipesan)',
      desc: 'Telah dipesan oleh pelanggan untuk waktu tertentu.',
      color: 'hover:border-indigo-500 hover:bg-indigo-50/50',
      activeColor: 'border-indigo-500 bg-indigo-50 text-indigo-900',
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Ubah Status Meja #${table.number}`}
      subtitle={`Kapasitas ${table.capacity} Orang • Status Sekarang: ${table.status}`}
      maxWidth="max-w-md"
    >
      <div className="space-y-3">
        {statuses.map((item) => {
          const isCurrent = table.status === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                onUpdateStatus(table.id, item.key);
                onClose();
              }}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                isCurrent ? item.activeColor : `border-stone-200 ${item.color}`
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-stone-900">{item.label}</span>
                {isCurrent && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-stone-900 text-white">
                    Aktif
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 mt-1">{item.desc}</p>
            </button>
          );
        })}
      </div>
    </Modal>
  );
};
export default TableStatusModal;
