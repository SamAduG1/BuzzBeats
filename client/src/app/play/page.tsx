'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useRoom } from '@/context/RoomContext';

function PlayContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCode = searchParams.get('code') || '';
  const { joinRoom, isLoading, error, clearError } = useRoom();
  const [roomCode, setRoomCode] = useState(initialCode.toUpperCase());
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCode.trim() || !displayName.trim()) return;
    const success = await joinRoom(roomCode.trim().toUpperCase(), displayName.trim());
    if (success) {
      router.push(`/play/lobby?code=${roomCode.trim().toUpperCase()}&name=${encodeURIComponent(displayName.trim())}`);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      {/* Back arrow */}
      <button
        onClick={() => router.push('/')}
        className="absolute top-6 left-6 flex items-center gap-2 transition-opacity hover:opacity-70 cursor-pointer"
        style={{ color: '#ff00e5' }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M12.5 5L7.5 10L12.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span style={{ fontFamily: 'var(--font-orbitron), sans-serif', fontSize: '0.75rem' }}>HOME</span>
      </button>

      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-3 mb-1">
            <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="12" y="4" width="24" height="40" rx="2" stroke="#ff00e5" strokeWidth="2" fill="#0a0a0f"
                style={{ filter: 'drop-shadow(0 0 6px rgba(255,0,229,0.5))' }}/>
              <circle cx="24" cy="16" r="6" stroke="#ff00e5" strokeWidth="2" fill="none"
                style={{ filter: 'drop-shadow(0 0 8px rgba(255,0,229,0.6))' }}/>
              <circle cx="24" cy="16" r="3" fill="#ff00e5"
                style={{ filter: 'drop-shadow(0 0 6px rgba(255,0,229,0.8))' }}/>
              <circle cx="24" cy="32" r="6" stroke="#ff00e5" strokeWidth="2" fill="none"
                style={{ filter: 'drop-shadow(0 0 8px rgba(255,0,229,0.4))' }}/>
              <circle cx="24" cy="32" r="3" fill="#ff00e5"
                style={{ filter: 'drop-shadow(0 0 6px rgba(255,0,229,0.6))' }}/>
            </svg>
            <h1
              className="text-4xl tracking-tight"
              style={{ fontFamily: 'var(--font-orbitron), sans-serif' }}
            >
              <span style={{ color: '#ff00e5', textShadow: '0 0 20px rgba(255,0,229,0.5), 0 0 40px rgba(255,0,229,0.3)' }}>
                BuzzBeats
              </span>
            </h1>
          </div>
          <p className="text-[#8888aa] text-sm">Join the game</p>
        </div>

        {/* Join form */}
        <form onSubmit={handleJoin} className="space-y-4">
          {/* Room code field — pre-filled from URL */}
          <div className="space-y-2">
            <label
              className="block text-xs uppercase tracking-widest"
              style={{ color: '#8888aa', fontFamily: 'var(--font-orbitron), sans-serif' }}
            >
              Room Code
            </label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase().slice(0, 6))}
              placeholder="XXXXXX"
              maxLength={6}
              autoComplete="off"
              className="w-full px-5 py-4 rounded-xl text-center uppercase tracking-[0.4em] focus:outline-none transition-all duration-200"
              style={{
                background: '#12121a',
                border: roomCode ? '1px solid rgba(255, 0, 229, 0.5)' : '1px solid rgba(255, 0, 229, 0.15)',
                color: '#e0e0ff',
                fontFamily: 'var(--font-jetbrains-mono), monospace',
                fontSize: '1.75rem',
                boxShadow: roomCode ? '0 0 20px rgba(255, 0, 229, 0.2)' : 'none',
              }}
            />
          </div>

          {/* Name field */}
          <div className="space-y-2">
            <label
              className="block text-xs uppercase tracking-widest"
              style={{ color: '#8888aa', fontFamily: 'var(--font-orbitron), sans-serif' }}
            >
              Your Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value.slice(0, 20))}
              onKeyDown={(e) => e.key === 'Enter' && handleJoin(e as unknown as React.FormEvent)}
              placeholder="Enter your name"
              maxLength={20}
              autoComplete="off"
              className="w-full px-5 py-4 rounded-xl focus:outline-none transition-all duration-200"
              style={{
                background: '#12121a',
                border: displayName ? '1px solid rgba(255, 0, 229, 0.4)' : '1px solid rgba(255, 0, 229, 0.15)',
                color: '#e0e0ff',
                fontFamily: 'var(--font-jetbrains-mono), monospace',
                fontSize: '1rem',
                boxShadow: displayName ? '0 0 16px rgba(255, 0, 229, 0.15)' : 'none',
              }}
            />
          </div>

          {error && (
            <p className="text-center text-sm" style={{ color: '#ff1744' }}>{error}</p>
          )}

          {/* Join button */}
          <button
            type="submit"
            disabled={!roomCode.trim() || !displayName.trim() || isLoading}
            className="w-full py-5 rounded-xl transition-all duration-300 hover:enabled:scale-105 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #ff00e5 0%, #b400ff 100%)',
              boxShadow: '0 0 30px rgba(255, 0, 229, 0.4), 0 8px 24px rgba(0, 0, 0, 0.3)',
              fontFamily: 'var(--font-orbitron), sans-serif',
              fontSize: '1.125rem',
              fontWeight: 600,
              color: '#ffffff',
            }}
          >
            {isLoading ? 'JOINING...' : 'JOIN GAME'}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function PlayPage() {
  return (
    <Suspense>
      <PlayContent />
    </Suspense>
  );
}
