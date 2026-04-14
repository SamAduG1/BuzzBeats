'use client';

import { useEffect } from 'react';
import { ClientGameState } from '@shared/types/game';
import { useSoundEffects } from '@/hooks/useSoundEffects';

interface Props {
  gameState: ClientGameState;
}

export default function TiebreakerDisplay({ gameState }: Props) {
  const { playTiebreakerStinger, startTiebreakerPulse, stopTiebreakerPulse } = useSoundEffects();

  // Play stinger and start pulse when this screen mounts (= phase enters 'tiebreaker')
  // Clean up the pulse when it unmounts (= phase leaves 'tiebreaker')
  useEffect(() => {
    playTiebreakerStinger().catch(() => {});
    const t = setTimeout(() => {
      startTiebreakerPulse().catch(() => {});
    }, 350);
    return () => {
      clearTimeout(t);
      stopTiebreakerPulse().catch(() => {});
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const tiebreakerNames = (gameState.tiebreakerIds ?? [])
    .map((id) => gameState.scores.find((s) => s.playerId === id)?.displayName)
    .filter(Boolean) as string[];

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[80vh] gap-8 w-full overflow-hidden">
      {/* Pulsing gold vignette */}
      <div
        className="pointer-events-none absolute inset-0 animate-elim-vignette"
        style={{ background: 'radial-gradient(ellipse at center, transparent 25%, rgba(255,230,0,0.18) 100%)' }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6 text-center w-full max-w-2xl mx-auto">
        <p
          className="text-xs uppercase tracking-[0.5em]"
          style={{ color: '#8888aa', fontFamily: 'var(--font-orbitron), sans-serif' }}
        >
          It&apos;s a tie
        </p>

        <p
          className="glitch-text font-bold"
          data-text="SUDDEN DEATH"
          style={{
            fontFamily: 'var(--font-orbitron), sans-serif',
            fontSize: 'clamp(2.5rem, 8vw, 5rem)',
            color: '#ffe600',
            textShadow: '0 0 40px rgba(255,230,0,0.9), 0 0 80px rgba(255,230,0,0.4)',
            letterSpacing: '0.1em',
          }}
        >
          SUDDEN DEATH
        </p>

        <p className="text-xl" style={{ color: '#8888aa' }}>
          First to answer correctly wins!
        </p>

        {/* Tied players with live vote counts */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
          {(gameState.tiebreakerIds ?? []).map((id, i) => {
            const name = gameState.scores.find((s) => s.playerId === id)?.displayName ?? id;
            const votes = gameState.tiebreakerVoteCounts?.[id] ?? 0;
            return (
              <div key={id} className="flex items-center gap-3">
                <div
                  className="rounded-2xl px-6 py-4 text-center min-w-[140px]"
                  style={{
                    background: 'rgba(255,230,0,0.07)',
                    border: '1px solid rgba(255,230,0,0.4)',
                    boxShadow: '0 0 16px rgba(255,230,0,0.15)',
                  }}
                >
                  <p
                    className="font-bold text-xl"
                    style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: '#ffe600', textShadow: '0 0 12px rgba(255,230,0,0.6)' }}
                  >
                    {name}
                  </p>
                  {votes > 0 && (
                    <p className="text-sm mt-1" style={{ color: '#8888aa' }}>
                      {votes} vote{votes !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
                {i < (gameState.tiebreakerIds ?? []).length - 1 && (
                  <span
                    className="text-2xl font-bold"
                    style={{ color: '#8888aa', fontFamily: 'var(--font-orbitron), sans-serif' }}
                  >
                    vs
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div
          className="rounded-full px-8 py-3 mt-2"
          style={{ background: 'rgba(255,230,0,0.08)', border: '1px solid rgba(255,230,0,0.25)' }}
        >
          <p
            className="text-4xl font-bold font-[family-name:var(--font-mono)]"
            style={{ color: '#ffe600', textShadow: '0 0 20px rgba(255,230,0,0.7)' }}
          >
            {gameState.timeRemaining}
          </p>
        </div>
      </div>
    </div>
  );
}
