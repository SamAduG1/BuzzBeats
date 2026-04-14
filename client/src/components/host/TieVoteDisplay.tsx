'use client';

import { ClientGameState } from '@shared/types/game';

interface Props {
  gameState: ClientGameState;
}

export default function TieVoteDisplay({ gameState }: Props) {
  const tiedNames = (gameState.tiebreakerIds ?? [])
    .map((id) => gameState.scores.find((s) => s.playerId === id)?.displayName)
    .filter(Boolean) as string[];

  const counts = gameState.tieVoteCounts ?? { suddenDeath: 0, share: 0 };
  const total = counts.suddenDeath + counts.share;

  const pct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[80vh] gap-8 w-full overflow-hidden">
      {/* Gold vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(255,230,0,0.12) 100%)' }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6 text-center w-full max-w-2xl mx-auto">
        <p className="text-xs uppercase tracking-[0.5em]" style={{ color: '#8888aa', fontFamily: 'var(--font-orbitron), sans-serif' }}>
          It&apos;s a tie!
        </p>

        {/* Tied player names */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {tiedNames.map((name, i) => (
              <span key={name}>
                <span className="font-bold text-2xl" style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: '#ffe600', textShadow: '0 0 16px rgba(255,230,0,0.7)' }}>
                  {name}
                </span>
                {i < tiedNames.length - 1 && (
                  <span className="mx-3 text-xl" style={{ color: '#8888aa' }}>&</span>
                )}
              </span>
            ))}
          </div>
          <span className="text-xl" style={{ color: '#8888aa' }}>are level</span>
        </div>

        <p className="text-lg" style={{ color: '#c0c0d8' }}>
          Players are voting — what happens next?
        </p>

        {/* Live vote bars */}
        <div className="w-full flex flex-col gap-4 mt-2">
          {/* Sudden death bar */}
          <div
            className="w-full rounded-2xl px-6 py-5"
            style={{ background: 'rgba(255,230,0,0.06)', border: '1px solid rgba(255,230,0,0.3)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="font-bold" style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: '#ffe600', fontSize: '0.9rem', letterSpacing: '0.1em' }}>
                ⚡ SUDDEN DEATH
              </p>
              <p className="font-bold text-xl" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#ffe600' }}>
                {counts.suddenDeath}
              </p>
            </div>
            <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255,230,0,0.15)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct(counts.suddenDeath)}%`, background: '#ffe600', boxShadow: '0 0 8px rgba(255,230,0,0.6)' }}
              />
            </div>
          </div>

          {/* Share win bar */}
          <div
            className="w-full rounded-2xl px-6 py-5"
            style={{ background: 'rgba(0,240,255,0.05)', border: '1px solid rgba(0,240,255,0.25)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="font-bold" style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: '#00f0ff', fontSize: '0.9rem', letterSpacing: '0.1em' }}>
                🏆 SHARE THE WIN
              </p>
              <p className="font-bold text-xl" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#00f0ff' }}>
                {counts.share}
              </p>
            </div>
            <div className="w-full h-2 rounded-full" style={{ background: 'rgba(0,240,255,0.15)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct(counts.share)}%`, background: '#00f0ff', boxShadow: '0 0 8px rgba(0,240,255,0.5)' }}
              />
            </div>
          </div>
        </div>

        {/* Timer + note */}
        <div className="flex items-center gap-4 mt-2">
          <div
            className="rounded-xl px-5 py-2"
            style={{ background: '#12121a', border: '1px solid rgba(255,230,0,0.2)' }}
          >
            <span className="text-2xl font-bold" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#ffe600' }}>
              {gameState.timeRemaining}s
            </span>
          </div>
          <p className="text-sm" style={{ color: '#8888aa' }}>
            Tie or no votes → sudden death
          </p>
        </div>
      </div>
    </div>
  );
}
