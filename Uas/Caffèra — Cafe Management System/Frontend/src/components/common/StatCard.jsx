import React from 'react';
import Card from './Card';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  iconBg = 'bg-amber-100 text-amber-800',
  trend,
  trendType = 'up', // 'up' | 'down' | 'neutral'
  className = '',
}) => {
  return (
    <Card hoverEffect className={`relative overflow-hidden ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-stone-900 mt-1.5 font-sans tracking-tight">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-stone-500 mt-1 flex items-center gap-1">
              {subtitle}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-2xl shrink-0 ${iconBg}`}>{icon}</div>
      </div>

      {trend && (
        <div className="mt-3 pt-3 border-t border-stone-100 flex items-center gap-1.5 text-xs">
          <span
            className={`font-semibold ${
              trendType === 'up'
                ? 'text-emerald-600'
                : trendType === 'down'
                ? 'text-rose-600'
                : 'text-stone-600'
            }`}
          >
            {trend}
          </span>
          <span className="text-stone-400">vs kemarin</span>
        </div>
      )}
    </Card>
  );
};
export default StatCard;
