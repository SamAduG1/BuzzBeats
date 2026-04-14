'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRoom } from '@/context/RoomContext';

export default function Home() {
  const [roomCode, setRoomCode] = useState('');
  const router = useRouter();
  const { createRoom, isLoading, error } = useRoom();

  const handleCreateGame = async () => {
    const code = await createRoom();
    if (code) {
      router.push(`/host/lobby?code=${code}`);
    }
  };

  const handleJoinGame = () => {
    if (roomCode.trim()) {
      router.push(`/play?code=${roomCode.trim().toUpperCase()}`);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">

        {/* Logo */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="12" y="4" width="24" height="40" rx="2" stroke="url(#speaker-gradient)" strokeWidth="2" fill="#0a0a0f"/>
              <circle cx="24" cy="16" r="6" stroke="#00f0ff" strokeWidth="2" fill="none"
                style={{ filter: 'drop-shadow(0 0 8px rgba(0, 240, 255, 0.6))' }}/>
              <circle cx="24" cy="16" r="3" fill="#00f0ff"
                style={{ filter: 'drop-shadow(0 0 6px rgba(0, 240, 255, 0.8))' }}/>
              <circle cx="24" cy="32" r="6" stroke="#ff00e5" strokeWidth="2" fill="none"
                style={{ filter: 'drop-shadow(0 0 8px rgba(255, 0, 229, 0.6))' }}/>
              <circle cx="24" cy="32" r="3" fill="#ff00e5"
                style={{ filter: 'drop-shadow(0 0 6px rgba(255, 0, 229, 0.8))' }}/>
              <defs>
                <linearGradient id="speaker-gradient" x1="24" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#ff00e5" stopOpacity="0.8"/>
                </linearGradient>
              </defs>
            </svg>
            <h1
              className="text-6xl tracking-tight"
              style={{ fontFamily: 'var(--font-orbitron), sans-serif' }}
            >
              <span style={{ color: '#00f0ff', textShadow: '0 0 20px rgba(0, 240, 255, 0.5), 0 0 40px rgba(0, 240, 255, 0.3)' }}>
                Buzz
              </span>
              <span style={{ color: '#ff00e5', textShadow: '0 0 20px rgba(255, 0, 229, 0.5), 0 0 40px rgba(255, 0, 229, 0.3)' }}>
                Beats
              </span>
            </h1>
          </div>
          <p className="text-[#8888aa] text-lg">Real-time multiplayer music trivia</p>
        </div>

        {error && (
          <p className="text-center text-sm" style={{ color: '#ff1744' }}>{error}</p>
        )}

        <div className="space-y-4">
          {/* Create Game */}
          <button
            onClick={handleCreateGame}
            disabled={isLoading}
            className="w-full py-6 rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #00f0ff 0%, #0088ff 100%)',
              boxShadow: '0 0 30px rgba(0, 240, 255, 0.4), 0 8px 24px rgba(0, 0, 0, 0.3)',
              fontFamily: 'var(--font-orbitron), sans-serif',
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#0a0a0f',
            }}
          >
            {isLoading ? 'CREATING...' : 'CREATE GAME'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#00f0ff]/30 to-transparent" />
            <span className="text-[#8888aa] text-sm">OR</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#ff00e5]/30 to-transparent" />
          </div>

          {/* Join Game */}
          <div className="space-y-3">
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleJoinGame()}
              placeholder="ENTER ROOM CODE"
              maxLength={6}
              className="w-full px-6 py-4 rounded-xl text-center uppercase tracking-[0.3em] focus:outline-none transition-all duration-200"
              style={{
                background: '#12121a',
                border: roomCode ? '1px solid rgba(255, 0, 229, 0.4)' : '1px solid rgba(255, 0, 229, 0.15)',
                color: '#e0e0ff',
                fontFamily: 'var(--font-jetbrains-mono), monospace',
                fontSize: '1.5rem',
                boxShadow: roomCode ? '0 0 20px rgba(255, 0, 229, 0.2)' : 'none',
              }}
            />
            <button
              onClick={handleJoinGame}
              disabled={!roomCode.trim()}
              className="w-full py-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:scale-105 cursor-pointer"
              style={{
                background: '#1a1a2e',
                border: '1px solid rgba(255, 0, 229, 0.3)',
                color: '#ff00e5',
                fontFamily: 'var(--font-orbitron), sans-serif',
                fontSize: '1.125rem',
                boxShadow: '0 0 20px rgba(255, 0, 229, 0.2)',
              }}
            >
              JOIN GAME
            </button>
          </div>
        </div>

        <p className="text-center text-[#8888aa] text-sm">
          No app needed • Works on any device
        </p>

      </div>

      {/* Footer */}
      <div className="mt-10 flex items-center gap-6">
        <a
          href="https://buymeacoffee.com/samadug"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105"
          style={{
            background: 'rgba(255,213,0,0.08)',
            border: '1px solid rgba(255,213,0,0.25)',
            color: '#ffd500',
            fontSize: '0.85rem',
            fontWeight: 600,
            fontFamily: 'var(--font-orbitron), sans-serif',
            letterSpacing: '0.05em',
          }}
        >
          <span>☕</span>
          <span>Buy me a coffee</span>
        </a>

        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSeH5TffvCKjgswAm17vQ35N1s7ZixpFbnkpwEY8cVX8FNiTZw/viewform?usp=publish-editor"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105"
          style={{
            background: 'rgba(0,240,255,0.05)',
            border: '1px solid rgba(0,240,255,0.2)',
            color: '#00f0ff',
            fontSize: '0.85rem',
            fontWeight: 600,
            fontFamily: 'var(--font-orbitron), sans-serif',
            letterSpacing: '0.05em',
          }}
        >
          <span>💬</span>
          <span>Leave feedback</span>
        </a>
      </div>
    </main>
  );
}
