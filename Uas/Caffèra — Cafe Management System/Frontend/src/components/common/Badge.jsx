import React from 'react';

const variants = {
  default: 'bg-stone-100 text-stone-700 border-stone-200',
  primary: 'bg-amber-50 text-amber-800 border-amber-200',
  secondary: 'bg-purple-50 text-purple-800 border-purple-200',
  success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  warning: 'bg-amber-50 text-amber-800 border-amber-200',
  danger: 'bg-rose-50 text-rose-800 border-rose-200',
  info: 'bg-sky-50 text-sky-800 border-sky-200',
};

const sizes = {
  sm: 'px-2 py-0.5 text-[11px] font-semibold',
  md: 'px-2.5 py-1 text-xs font-semibold',
  lg: 'px-3 py-1.5 text-sm font-semibold',
};

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  dotColor,
  className = '',
  ...props
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${
        variants[variant] || variants.default
      } ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            dotColor ||
            (variant === 'success'
              ? 'bg-emerald-500'
              : variant === 'danger'
              ? 'bg-rose-500'
              : variant === 'warning'
              ? 'bg-amber-500'
              : variant === 'info'
              ? 'bg-sky-500'
              : 'bg-stone-400')
          }`}
        />
      )}
      {children}
    </span>
  );
};
export default Badge;
