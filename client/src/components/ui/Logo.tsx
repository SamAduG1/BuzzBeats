import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'text-2xl',
  md: 'text-4xl md:text-5xl',
  lg: 'text-5xl md:text-7xl',
};

export default function Logo({ size = 'md' }: LogoProps) {
  return (
    <Link href="/" className="inline-block">
      <h1
        className={`
          font-[family-name:var(--font-display)] font-bold tracking-wider cursor-pointer
          ${sizeStyles[size]}
        `}
      >
        <span className="text-neon-cyan text-glow-cyan">Buzz</span>
        <span className="text-neon-magenta text-glow-magenta">Beats</span>
      </h1>
    </Link>
  );
}
