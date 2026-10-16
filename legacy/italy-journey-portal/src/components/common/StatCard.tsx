import React from 'react';
import { ArrowRight } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
  iconColor?: 'emerald' | 'teal' | 'amber' | 'rose' | 'sky';
  badge?: {
    text: string;
    variant?: 'estimate' | 'verified' | 'neutral';
  };
  onClick?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'emerald',
  badge,
  onClick,
  className = '',
}) => {
  const iconBgStyles = {
    emerald: 'bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20',
    teal: 'bg-teal-500/10 text-teal-400 group-hover:bg-teal-500/20',
    amber: 'bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/20',
    sky: 'bg-sky-500/10 text-sky-400 group-hover:bg-sky-500/20',
  };

  const badgeStyles = {
    estimate: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
    verified: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
    neutral: 'bg-slate-800 text-slate-300 border border-slate-700',
  };

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`group relative p-5 rounded-2xl bg-slate-900/90 border border-slate-800/90 transition-all duration-200 ${
        onClick
          ? 'cursor-pointer hover:border-slate-700 hover:bg-slate-900 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500'
          : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-[12px] font-medium uppercase tracking-wider text-slate-400">
            {title}
          </span>
          {badge && (
            <span
              className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider w-fit ${
                badgeStyles[badge.variant || 'neutral']
              }`}
            >
              {badge.text}
            </span>
          )}
        </div>
        <div
          className={`p-2.5 rounded-xl transition-all duration-200 shrink-0 ${iconBgStyles[iconColor]}`}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div
        className={`${
          typeof value === 'string' && value.length > 14
            ? 'text-lg sm:text-xl'
            : 'text-2xl sm:text-[28px]'
        } font-bold text-white tracking-tight leading-tight mb-2.5 break-words`}
      >
        {value}
      </div>

      {subtitle && (
        <div className="text-xs sm:text-[13px] text-slate-400 flex items-center justify-between gap-2 pt-2 border-t border-slate-800/60 leading-relaxed">
          <span className="line-clamp-2 leading-relaxed">{subtitle}</span>
          {onClick && (
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
          )}
        </div>
      )}
    </div>
  );
};

