import React from 'react';

const variants = {
  primary: 'bg-[#fbb710] hover:bg-[#e5a607] text-stone-950 font-bold shadow-xs active:bg-[#d09006]',
  dark: 'bg-stone-950 hover:bg-stone-800 text-white font-bold active:bg-black',
  secondary: 'bg-stone-100 hover:bg-stone-200 text-stone-900 font-semibold active:bg-stone-300',
  outline: 'bg-transparent hover:bg-stone-100 text-stone-900 border border-stone-300 font-semibold active:bg-stone-200',
  danger: 'bg-rose-600 hover:bg-rose-700 text-white font-bold active:bg-rose-800',
  ghost: 'bg-transparent hover:bg-stone-100 text-stone-700 font-semibold active:bg-stone-200',
  success: 'bg-emerald-600 hover:bg-emerald-700 text-white font-bold active:bg-emerald-800',
};

const sizes = {
  sm: 'px-2.5 py-1.5 text-xs font-medium rounded-lg gap-1.5',
  md: 'px-4 py-2 text-sm font-medium rounded-xl gap-2',
  lg: 'px-5 py-2.5 text-base font-semibold rounded-xl gap-2.5',
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon,
  iconRight,
  isLoading = false,
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`inline-flex items-center justify-center transition-all duration-200 font-sans focus:outline-none focus:ring-2 focus:ring-amber-500/40 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
        variants[variant] || variants.primary
      } ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        icon
      )}
      {children}
      {iconRight && !isLoading && iconRight}
    </button>
  );
};
export default Button;
