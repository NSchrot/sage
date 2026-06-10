import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={`w-full bg-white dark:bg-[#040404] border border-slate-250 dark:border-[#1f1f1f] text-slate-800 dark:text-slate-200 rounded-xl text-sm transition-all outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/80 placeholder-slate-400 dark:placeholder-slate-600 ${
              icon ? 'pl-10' : 'pl-4'
            } pr-4 py-2.5 ${error ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/40' : ''} ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-rose-400 font-medium mt-1 flex items-center gap-1 select-none">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
