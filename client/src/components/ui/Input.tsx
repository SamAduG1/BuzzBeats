'use client';

import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-1.5">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-3 rounded-lg
          bg-bg-secondary border border-text-secondary/30
          text-text-primary placeholder:text-text-secondary/50
          focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_10px_#00f0ff33]
          transition-all duration-200
          ${error ? 'border-neon-red focus:border-neon-red focus:shadow-[0_0_10px_#ff174433]' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-neon-red">{error}</p>
      )}
    </div>
  );
}
