'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon: Icon,
      iconPosition = 'left',
      isLoading = false,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      inline-flex items-center justify-center font-semibold rounded-xl
      transition-all duration-250 cubic-bezier(0.4, 0, 0.2, 1)
      disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
      focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background
    `;

    const variants = {
      primary: `
        bg-gradient-primary text-white border border-white/10
        shadow-button hover:shadow-button-hover hover:-translate-y-0.5
        active:translate-y-0 active:shadow-sm
      `,
      secondary: `
        bg-white/5 text-foreground border border-card-border
        backdrop-blur-sm hover:bg-white/10 hover:border-card-border-hover hover:-translate-y-0.5
        active:translate-y-0
      `,
      ghost: `
        bg-transparent text-muted border border-transparent
        hover:bg-muted-bg hover:text-foreground hover:border-card-border
      `,
      danger: `
        bg-gradient-to-r from-error to-error/80 text-white border border-error-border
        shadow-md hover:shadow-lg hover:-translate-y-0.5
        active:translate-y-0
      `,
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2.5 text-[0.938rem] gap-2',
      lg: 'px-6 py-3.5 text-base gap-2.5',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : Icon ? (
          iconPosition === 'left' ? (
            <Icon className="w-5 h-5" />
          ) : (
            <Icon className="w-5 h-5" />
          )
        ) : null}
        {children}
        {Icon && iconPosition === 'right' && <Icon className="w-5 h-5 ml-auto" />}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
