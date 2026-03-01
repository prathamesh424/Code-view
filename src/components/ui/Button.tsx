import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
        {
          'bg-accent text-white hover:bg-accent-hover shadow-sm shadow-accent/20': variant === 'primary',
          'bg-surface-secondary text-foreground border border-border hover:bg-surface-tertiary hover:border-border-hover': variant === 'secondary',
          'text-muted hover:text-foreground hover:bg-surface-secondary': variant === 'ghost',
          'bg-error/10 text-error hover:bg-error/20': variant === 'danger',
        },
        {
          'text-xs px-2 py-1 gap-1': size === 'sm',
          'text-sm px-3 py-1.5 gap-1.5': size === 'md',
          'text-base px-4 py-2 gap-2': size === 'lg',
          'w-8 h-8 p-0': size === 'icon',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
