import React from 'react';

export const Card = ({
  children,
  className = '',
  hoverEffect = false,
  glass = false,
  padding = 'p-5',
  ...props
}) => {
  return (
    <div
      className={`rounded-2xl border transition-all duration-200 ${
        glass
          ? 'bg-white/85 backdrop-blur-md border-white/60 shadow-soft'
          : 'bg-white border-stone-200/80 shadow-soft'
      } ${
        hoverEffect
          ? 'hover:shadow-card hover:-translate-y-0.5 hover:border-amber-500/30'
          : ''
      } ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
export default Card;
