'use client';

import { ClientGameState } from '@shared/types/game';

interface Props {
  gameState: ClientGameState;
}

export default function PreRoundDisplay({ gameState }: Props) {
  const label = gameState.gameMode === 'snippet' ? 'Song' : 'Round';

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 w-full">
      {/* GET READY label */}
      <p
        className="text-xs uppercase tracking-[0.4em]"
        style={{ color: '#8888aa', fontFamily: 'var(--font-orbitron), sans-serif' }}
      >
        Get Ready
      </p>

      {/* Round / Song number */}
      <div className="text-center">
        <p
          className="font-bold leading-none"
          style={{
            fontFamily: 'var(--font-orbitron), sans-serif',
            fontSize: 'clamp(4rem, 12vw, 8rem)',
            color: '#00f0ff',
            textShadow: '0 0 30px rgba(0,240,255,0.7), 0 0 60px rgba(0,240,255,0.4), 0 0 100px rgba(0,240,255,0.2)',
          }}
        >
          {label} {gameState.currentRound}
        </p>
        <p
          className="text-xl mt-3"
          style={{ color: '#8888aa' }}
        >
          of {gameState.totalRounds}
        </p>
      </div>

      {/* Countdown number */}
      <div
        className="w-24 h-24 rounded-2xl flex items-center justify-center mt-4"
        style={{
          background: '#12121a',
          border: '1px solid rgba(255,230,0,0.2)',
          boxShadow: '0 0 30px rgba(255,230,0,0.15)',
        }}
      >
        <span
          className="text-5xl font-bold"
          style={{
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            color: '#ffe600',
            textShadow: '0 0 20px rgba(255,230,0,0.6)',
          }}
        >
          {gameState.timeRemaining}
        </span>
      </div>
    </div>
  );
}
