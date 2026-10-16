import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'sm',
  icon,
  iconPosition = 'left',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const sizeStyles = {
    xs: 'text-xs py-1 px-2.5 gap-1.5',
    sm: 'text-xs py-1.5 px-3.5 gap-2',
    md: 'text-sm py-2 px-4 gap-2',
    lg: 'text-base py-2.5 px-5 gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white shadow-sm shadow-emerald-950/40 border border-emerald-500/40',
    secondary:
      'bg-slate-800/90 hover:bg-slate-800 active:bg-slate-850 text-slate-200 border border-slate-700/80 hover:border-slate-650',
    outline:
      'bg-transparent hover:bg-slate-800/50 active:bg-slate-800 text-slate-300 hover:text-white border border-slate-750 hover:border-slate-600',
    ghost:
      'bg-transparent hover:bg-slate-850 text-slate-400 hover:text-slate-200 active:bg-slate-800',
    danger:
      'bg-rose-500/10 hover:bg-rose-500/20 active:bg-rose-500/30 text-rose-300 border border-rose-500/30 hover:border-rose-500/50',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      ) : (
        icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>
      )}
      {children}
      {!isLoading && icon && iconPosition === 'right' && (
        <span className="shrink-0">{icon}</span>
      )}
    </button>
  );
};

