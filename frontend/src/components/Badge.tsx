'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'accent';
  size?: 'sm' | 'md';
  icon?: LucideIcon;
  children: React.ReactNode;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'default',
      size = 'md',
      icon: Icon,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      inline-flex items-center gap-1.5 font-semibold rounded-full
      border transition-all duration-200
    `;

    const variants = {
      default: 'bg-muted-bg text-muted border-card-border',
      success: 'bg-success-bg text-success border-success-border',
      warning: 'bg-warning-bg text-warning border-warning-border',
      error: 'bg-error-bg text-error border-error-border',
      info: 'bg-info-bg text-info border-info-border',
      accent: 'bg-accent/15 text-accent-light border-accent/35',
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm',
    };

    return (
      <span
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {Icon && <Icon className={`w-3.5 h-3.5 ${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'}`} />}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
