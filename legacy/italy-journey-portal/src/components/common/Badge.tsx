import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'amber' | 'rose' | 'sky' | 'purple' | 'slate' | 'teal';
  size?: 'xs' | 'sm';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'slate',
  size = 'xs',
  dot = false,
  className = '',
}) => {
  const sizeStyles = {
    xs: 'text-[11px] px-2 py-0.5',
    sm: 'text-xs px-2.5 py-1',
  };

  const variantStyles = {
    emerald: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
    amber: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
    rose: 'bg-rose-500/15 text-rose-300 border border-rose-500/30',
    sky: 'bg-sky-500/15 text-sky-300 border border-sky-500/30',
    purple: 'bg-purple-500/15 text-purple-300 border border-purple-500/30',
    teal: 'bg-teal-500/15 text-teal-300 border border-teal-500/30',
    slate: 'bg-slate-800/90 text-slate-300 border border-slate-700/80',
  };

  const dotStyles = {
    emerald: 'bg-emerald-400',
    amber: 'bg-amber-400',
    rose: 'bg-rose-400',
    sky: 'bg-sky-400',
    purple: 'bg-purple-400',
    teal: 'bg-teal-400',
    slate: 'bg-slate-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-lg shrink-0 ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotStyles[variant]} shrink-0`}
        />
      )}
      <span>{children}</span>
    </span>
  );
};

