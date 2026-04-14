'use client';

import { useRouter } from 'next/navigation';

interface BackButtonProps {
  href?: string;
  label?: string;
  variant?: 'cyan' | 'magenta';
}

export default function BackButton({ href, label = 'Back', variant = 'cyan' }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  const hoverColor = variant === 'magenta'
    ? 'hover:text-neon-magenta hover:border-neon-magenta/40'
    : 'hover:text-neon-cyan hover:border-neon-cyan/40';

  return (
    <button
      onClick={handleClick}
      className={`
        flex items-center gap-2 text-text-secondary text-base
        border border-text-secondary/20 rounded-lg px-4 py-2
        ${hoverColor}
        transition-all duration-200
        cursor-pointer group
      `}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 16 16"
        fill="none"
        className="transition-transform duration-200 group-hover:-translate-x-0.5"
      >
        <path
          d="M10 12L6 8L10 4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {label}
    </button>
  );
}
