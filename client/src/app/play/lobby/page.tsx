'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import PlayerGameScreen from '@/components/player/GameScreen';
import { useRoom } from '@/context/RoomContext';

function PlayerLobbyContent() {
  const searchParams = useSearchParams();
  const roomCode = searchParams.get('code') || '';
  const playerName = searchParams.get('name') || '';
  const { room, error, joinRoom, leaveRoom, socket } = useRoom();

  useEffect(() => {
    if (!room && !error && roomCode && playerName) {
      joinRoom(roomCode, playerName);
    }
  }, [room, error, roomCode, playerName, joinRoom]);

  const players = room?.players || [];

  if (error) {
    return (
      <main className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-sm w-full">
          <div className="flex items-center justify-center gap-3 mb-1">
            <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="12" y="4" width="24" height="40" rx="2" stroke="#ff00e5" strokeWidth="2" fill="#0a0a0f"
                style={{ filter: 'drop-shadow(0 0 6px rgba(255,0,229,0.5))' }}/>
              <circle cx="24" cy="16" r="6" stroke="#ff00e5" strokeWidth="2" fill="none"/>
              <circle cx="24" cy="16" r="3" fill="#ff00e5"/>
              <circle cx="24" cy="32" r="6" stroke="#ff00e5" strokeWidth="2" fill="none"/>
              <circle cx="24" cy="32" r="3" fill="#ff00e5"/>
            </svg>
            <h1
              className="text-4xl tracking-tight"
              style={{ fontFamily: 'var(--font-orbitron), sans-serif' }}
            >
              <span style={{ color: '#ff00e5', textShadow: '0 0 20px rgba(255,0,229,0.5)' }}>BuzzBeats</span>
            </h1>
          </div>
          <div
            className="rounded-2xl p-6 text-center"
            style={{ background: '#12121a', border: '1px solid rgba(255, 23, 68, 0.3)' }}
          >
            <p className="text-lg mb-4" style={{ color: '#ff1744' }}>{error}</p>
            <a
              href="/play"
              style={{
                color: '#00f0ff',
                fontFamily: 'var(--font-orbitron), sans-serif',
                fontSize: '0.75rem',
                textDecoration: 'none',
              }}
            >
              ← BACK TO JOIN
            </a>
          </div>
        </div>
      </main>
    );
  }

  // Show game screen when game is in progress
  if (room?.status === 'playing' || room?.status === 'finished') {
    return (
      <main className="min-h-screen bg-[#0a0a0f] flex flex-col items-center px-4">
        <PlayerGameScreen />
      </main>
    );
  }

  // Team assignment lookup
  const teamId = socket?.id ? room?.teamAssignments?.[socket.id] : undefined;
  const team = teamId !== undefined ? room?.teams?.find((t) => t.id === teamId) : null;
  const teamColorStyle: Record<string, string> = {
    cyan: '#00f0ff', magenta: '#ff00e5', yellow: '#ffe600', green: '#39ff14',
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-4">
      {/* Leave button */}
      <button
        onClick={() => { leaveRoom(); window.location.href = '/'; }}
        className="absolute top-6 left-6 flex items-center gap-2 transition-opacity hover:opacity-70 cursor-pointer"
        style={{ color: '#ff00e5' }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M12.5 5L7.5 10L12.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span style={{ fontFamily: 'var(--font-orbitron), sans-serif', fontSize: '0.75rem' }}>LEAVE</span>
      </button>

      <div className="w-full max-w-sm space-y-6">
        {/* Room code badge */}
        <div className="text-center space-y-1">
          <p
            className="text-xs uppercase tracking-widest"
            style={{ color: '#8888aa', fontFamily: 'var(--font-orbitron), sans-serif' }}
          >
            Room Code
          </p>
          <p
            className="text-5xl font-bold tracking-[0.3em]"
            style={{
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              color: '#00f0ff',
              textShadow: '0 0 30px rgba(0, 240, 255, 0.6), 0 0 60px rgba(0, 240, 255, 0.3)',
            }}
          >
            {room?.code || roomCode}
          </p>
        </div>

        {/* Waiting status */}
        <div
          className="rounded-2xl p-6 text-center space-y-3"
          style={{ background: '#12121a', border: '1px solid rgba(0, 240, 255, 0.1)' }}
        >
          <div className="flex items-center justify-center gap-3">
            <div
              className="w-2.5 h-2.5 rounded-full animate-pulse"
              style={{ background: '#00f0ff', boxShadow: '0 0 10px rgba(0, 240, 255, 0.8)' }}
            />
            <p className="text-lg" style={{ color: '#e0e0ff', fontFamily: 'var(--font-orbitron), sans-serif', fontSize: '0.875rem' }}>
              WAITING FOR HOST
            </p>
          </div>
          <p className="text-sm" style={{ color: '#8888aa' }}>
            Joined as{' '}
            <span style={{ color: '#ff00e5', fontWeight: 600 }}>{playerName}</span>
          </p>
          {team && (
            <div
              className="inline-block px-4 py-1.5 rounded-full text-sm font-bold mt-1"
              style={{
                background: `${teamColorStyle[team.color] || '#00f0ff'}15`,
                border: `1px solid ${teamColorStyle[team.color] || '#00f0ff'}40`,
                color: teamColorStyle[team.color] || '#00f0ff',
                fontFamily: 'var(--font-orbitron), sans-serif',
                fontSize: '0.75rem',
              }}
            >
              Team {team.name}
            </div>
          )}
        </div>

        {/* Player list */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: '#12121a', border: '1px solid rgba(0, 240, 255, 0.1)' }}
        >
          <div className="px-5 py-3 border-b" style={{ borderColor: 'rgba(0, 240, 255, 0.08)' }}>
            <p
              className="text-xs uppercase tracking-widest"
              style={{ color: '#8888aa', fontFamily: 'var(--font-orbitron), sans-serif' }}
            >
              Players ({players.length})
            </p>
          </div>
          <div className="divide-y" style={{ borderColor: 'rgba(0, 240, 255, 0.06)' }}>
            {players.length === 0 ? (
              <p className="px-5 py-4 text-sm" style={{ color: '#8888aa' }}>No players yet...</p>
            ) : (
              players.map((p) => (
                <div key={p.id} className="px-5 py-3 flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{
                      background: p.isConnected ? '#39ff14' : '#ff1744',
                      boxShadow: p.isConnected ? '0 0 8px rgba(57, 255, 20, 0.7)' : '0 0 8px rgba(255, 23, 68, 0.7)',
                    }}
                  />
                  <span style={{ color: '#e0e0ff', fontSize: '0.9rem' }}>{p.displayName}</span>
                  {p.displayName === playerName && (
                    <span
                      className="ml-auto text-xs"
                      style={{ color: '#ff00e5', fontFamily: 'var(--font-orbitron), sans-serif' }}
                    >
                      YOU
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function PlayerLobbyPage() {
  return (
    <Suspense>
      <PlayerLobbyContent />
    </Suspense>
  );
}
