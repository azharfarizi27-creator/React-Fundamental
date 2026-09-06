import React from 'react';
import { ORDER_STATUS_CONFIG } from '../../utils/constants';

export const OrderStatusBadge = ({ status, className = '' }) => {
  const config = ORDER_STATUS_CONFIG[status] || {
    label: status || 'Unknown',
    color: 'bg-stone-50 text-stone-700 border-stone-200',
    dot: 'bg-stone-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border shadow-xs ${config.color} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
};
export default OrderStatusBadge;
