import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5B3FD9] disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

    const variants = {
      primary: 'bg-[#5B3FD9] text-white hover:bg-[#4a32b8]',
      secondary: 'bg-[#F7F5FF] text-[#5B3FD9] hover:bg-[#ede8fc]',
      outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
      danger: 'bg-[#B3261E] text-white hover:bg-[#931f18]',
      ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm min-h-[44px]',
      lg: 'px-6 py-3 text-base min-h-[44px]',
    };

    return (
      <button
        ref={ref}
        className={clsx(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
