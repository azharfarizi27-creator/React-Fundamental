import React from 'react';
import { Coffee } from 'lucide-react';
import Button from './Button';

export const EmptyState = ({
  icon,
  title = 'Tidak ada data ditemukan',
  description = 'Coba ubah filter atau kata kunci pencarian Anda.',
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl bg-stone-50/60 border border-dashed border-stone-200 ${className}`}
    >
      <div className="p-4 rounded-2xl bg-amber-50 text-amber-600 mb-4 shadow-sm border border-amber-100">
        {icon || <Coffee className="w-8 h-8" />}
      </div>
      <h4 className="text-base font-bold text-stone-800">{title}</h4>
      <p className="text-xs sm:text-sm text-stone-500 max-w-sm mt-1 mb-5">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
export default EmptyState;
