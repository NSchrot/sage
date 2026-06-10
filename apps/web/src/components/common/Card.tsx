import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  variant?: 'default' | 'institutional' | 'glow';
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  actions,
  variant = 'default',
  className = '',
}) => {
  const baseStyles = 'bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-[#1f1f1f] rounded-2xl relative overflow-hidden transition-all duration-300 shadow-sm dark:shadow-none';
  
  const variants = {
    default: 'hover:border-slate-350 dark:hover:border-[#2f2f2f]',
    institutional: 'border-l-4 border-l-emerald-600 hover:border-slate-350 dark:hover:border-[#2f2f2f]',
    glow: 'border border-emerald-500/20 shadow-lg shadow-emerald-500/5 hover:border-emerald-500/40',
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`}>
      
      {variant === 'glow' && (
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
      )}
      
      
      {(title || subtitle || actions) && (
        <div className="px-6 py-4.5 border-b border-slate-100 dark:border-slate-900 flex items-center justify-between gap-4">
          <div>
            {title && (
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-wide">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-550 dark:text-slate-450 mt-1 font-medium">
                {subtitle}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}

      
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};
