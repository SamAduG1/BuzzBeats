'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const BREAKPOINT = 1024; // px — below this we show the warning

export default function HostLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  // null = not yet measured, true = small screen warning active, false = fine
  const [showWarning, setShowWarning] = useState<boolean | null>(null);
  const [dismissed, setDismissed] = useState(false);

  // Keep the screen on for the duration of the host session
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('wakeLock' in navigator)) return;
    let lock: { release: () => Promise<void> } | null = null;
    const acquire = async () => {
      try {
        lock = await (navigator as Navigator & { wakeLock: { request: (t: string) => Promise<{ release: () => Promise<void> }> } }).wakeLock.request('screen');
      } catch {}
    };
    acquire();
    const onVisibility = () => { if (document.visibilityState === 'visible') acquire(); };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      lock?.release().catch(() => {});
    };
  }, []);

  useEffect(() => {
    // Only measure once per session (dismissed persists in state)
    if (dismissed) return;
    const check = () => {
      setShowWarning(window.innerWidth < BREAKPOINT);
    };
    check();
    // Also re-check on resize (e.g. rotating a tablet)
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [dismissed]);

  // Not yet measured — render nothing to avoid flash
  if (showWarning === null) return null;

  if (showWarning && !dismissed) {
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center px-6 py-10 text-center"
        style={{ background: '#0a0a0f' }}
      >
        {/* BuzzBeats logo */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="12" y="4" width="24" height="40" rx="2" stroke="#00f0ff" strokeWidth="2" fill="#0a0a0f"
              style={{ filter: 'drop-shadow(0 0 6px rgba(0,240,255,0.5))' }}/>
            <circle cx="24" cy="16" r="6" stroke="#00f0ff" strokeWidth="2" fill="none"/>
            <circle cx="24" cy="16" r="3" fill="#00f0ff"/>
            <circle cx="24" cy="32" r="6" stroke="#00f0ff" strokeWidth="2" fill="none"/>
            <circle cx="24" cy="32" r="3" fill="#00f0ff"/>
          </svg>
          <span
            className="text-xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: '#00f0ff', textShadow: '0 0 16px rgba(0,240,255,0.5)' }}
          >
            BuzzBeats
          </span>
        </div>

        {/* Monitor icon */}
        <div
          className="rounded-2xl p-5 mb-8"
          style={{ background: 'rgba(0,240,255,0.06)', border: '1px solid rgba(0,240,255,0.2)' }}
        >
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="8" width="56" height="38" rx="4" stroke="#00f0ff" strokeWidth="2.5" fill="none"
              style={{ filter: 'drop-shadow(0 0 8px rgba(0,240,255,0.4))' }}/>
            <line x1="4" y1="34" x2="60" y2="34" stroke="#00f0ff" strokeWidth="1" opacity="0.3"/>
            <line x1="32" y1="46" x2="32" y2="54" stroke="#00f0ff" strokeWidth="2.5"/>
            <line x1="20" y1="54" x2="44" y2="54" stroke="#00f0ff" strokeWidth="2.5"
              style={{ filter: 'drop-shadow(0 0 6px rgba(0,240,255,0.5))' }}/>
            <rect x="14" y="16" width="36" height="14" rx="2" stroke="#00f0ff" strokeWidth="1.5" fill="none" opacity="0.4"/>
          </svg>
        </div>

        {/* Heading */}
        <h1
          className="text-2xl font-bold mb-3"
          style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: '#e0e0ff', letterSpacing: '0.04em' }}
        >
          Heads up, host!
        </h1>

        {/* Body */}
        <p className="text-base mb-2 max-w-xs leading-relaxed" style={{ color: '#8888aa' }}>
          The host screen is designed to be displayed on a{' '}
          <span style={{ color: '#00f0ff' }}>TV, laptop, or large monitor</span>{' '}
          that everyone in the room can see.
        </p>
        <p className="text-sm mb-10 max-w-xs leading-relaxed" style={{ color: '#555577' }}>
          Running it on a phone works, but the layout is not optimized for small screens.
          Players join on their own phones — this screen is just for the host.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={() => router.push('/')}
            className="w-full py-4 rounded-2xl font-bold text-base transition-all duration-200 active:scale-95 cursor-pointer"
            style={{
              fontFamily: 'var(--font-orbitron), sans-serif',
              background: 'rgba(0,240,255,0.08)',
              border: '2px solid #00f0ff',
              color: '#00f0ff',
              boxShadow: '0 0 20px rgba(0,240,255,0.15)',
            }}
          >
            Take me back
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="w-full py-4 rounded-2xl font-bold text-base transition-all duration-200 active:scale-95 cursor-pointer"
            style={{
              fontFamily: 'var(--font-orbitron), sans-serif',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#555577',
            }}
          >
            Continue anyway
          </button>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
