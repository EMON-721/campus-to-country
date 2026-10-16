import React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`p-8 sm:p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col items-center justify-center space-y-3 ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400">
        <Icon className="w-6 h-6" />
      </div>
      <div className="space-y-1 max-w-sm">
        <h4 className="text-sm font-bold text-slate-200">{title}</h4>
        <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
      </div>
      {actionText && onAction && (
        <div className="pt-2">
          <Button variant="primary" size="xs" onClick={onAction}>
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
};

