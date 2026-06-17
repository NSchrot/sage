import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border uppercase tracking-wider select-none';

  const variants = {
    success: 'bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/20',
    warning: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
    danger: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20',
    info: 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20',
    neutral: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
