'use client';

import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles = {
  primary:
    'border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 hover:shadow-[0_0_20px_#00f0ff55] active:bg-neon-cyan/20',
  secondary:
    'border-neon-magenta text-neon-magenta hover:bg-neon-magenta/10 hover:shadow-[0_0_20px_#ff00e555] active:bg-neon-magenta/20',
  danger:
    'border-neon-red text-neon-red hover:bg-neon-red/10 hover:shadow-[0_0_20px_#ff174455] active:bg-neon-red/20',
};

const sizeStyles = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        font-[family-name:var(--font-display)] font-bold uppercase tracking-wider
        border-2 rounded-lg bg-transparent
        transition-all duration-200 ease-out
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabled ? 'opacity-30 cursor-not-allowed hover:bg-transparent hover:shadow-none' : 'cursor-pointer'}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
