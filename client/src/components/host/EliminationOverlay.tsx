'use client';

import { ClientGameState } from '@shared/types/game';

interface Props {
  gameState: ClientGameState;
}

export default function EliminationOverlay({ gameState }: Props) {
  const alivePlayers = gameState.alivePlayers ?? 0;

  // ── Last Chance phase ──────────────────────────────────────────────────────
  if (gameState.phase === 'last-chance') {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-[80vh] gap-8 w-full overflow-hidden">
        {/* Background vignette — magenta for Last Chance */}
        <div
          className="pointer-events-none absolute inset-0 animate-elim-vignette"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 30%, rgba(255,0,229,0.18) 100%)',
          }}
        />

        <p
          className="text-xs uppercase tracking-[0.4em] relative z-10"
          style={{ color: '#8888aa', fontFamily: 'var(--font-orbitron), sans-serif' }}
        >
          Elimination Mode
        </p>

        <p
          className="font-bold text-center animate-pulse relative z-10"
          style={{
            fontFamily: 'var(--font-orbitron), sans-serif',
            fontSize: 'clamp(3rem, 8vw, 5.5rem)',
            color: '#ff00e5',
            textShadow: '0 0 40px rgba(255,0,229,0.8), 0 0 80px rgba(255,0,229,0.4)',
          }}
        >
          LAST CHANCE!
        </p>

        <p className="text-xl relative z-10" style={{ color: '#8888aa' }}>
          Eliminated players can fight their way back in!
        </p>

        <div
          className="rounded-2xl px-10 py-6 text-center relative z-10"
          style={{ background: 'rgba(255,0,229,0.06)', border: '1px solid rgba(255,0,229,0.3)' }}
        >
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#8888aa', fontFamily: 'var(--font-orbitron), sans-serif' }}>
            Players Remaining
          </p>
          <p
            className="text-5xl font-bold"
            style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#00f0ff', textShadow: '0 0 20px rgba(0,240,255,0.6)' }}
          >
            {alivePlayers}
          </p>
        </div>
      </div>
    );
  }

  // ── Elimination-reveal phase ───────────────────────────────────────────────
  const result = gameState.roundResult;
  const eliminatedNames = gameState.disqualifiedIds
    .map((id) => gameState.scores.find((s) => s.playerId === id)?.displayName)
    .filter(Boolean) as string[];

  const hasEliminations = eliminatedNames.length > 0;

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Full-screen red vignette — only when someone is eliminated */}
      {hasEliminations && (
        <div
          className="pointer-events-none absolute inset-0 animate-elim-vignette z-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 20%, rgba(255,23,68,0.22) 100%)',
          }}
        />
      )}

      <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-3xl mx-auto py-6">

        <p
          className="text-xs uppercase tracking-[0.4em]"
          style={{ color: '#8888aa', fontFamily: 'var(--font-orbitron), sans-serif' }}
        >
          Round {Math.min(gameState.currentRound, gameState.totalRounds)} of {gameState.totalRounds}
        </p>

        {/* ELIMINATED banner — only when someone went out */}
        {hasEliminations && (
          <div className="w-full text-center py-2">
            <p
              className="glitch-text font-bold"
              data-text="ELIMINATED"
              style={{
                fontFamily: 'var(--font-orbitron), sans-serif',
                fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
                color: '#ff1744',
                textShadow: '0 0 30px rgba(255,23,68,0.9), 0 0 60px rgba(255,23,68,0.5)',
                letterSpacing: '0.12em',
              }}
            >
              ELIMINATED
            </p>
          </div>
        )}

        {/* Staggered eliminated names */}
        {hasEliminations && (
          <div className="flex flex-col items-center gap-3 w-full">
            {eliminatedNames.map((name, i) => (
              <div
                key={name}
                className="animate-elim-name w-full rounded-2xl px-8 py-5 text-center"
                style={{
                  animationDelay: `${i * 0.18}s`,
                  background: 'rgba(255,23,68,0.08)',
                  border: '1px solid rgba(255,23,68,0.5)',
                  boxShadow: '0 0 24px rgba(255,23,68,0.2), inset 0 0 16px rgba(255,23,68,0.05)',
                }}
              >
                <p
                  className="font-bold"
                  style={{
                    fontFamily: 'var(--font-orbitron), sans-serif',
                    fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                    color: '#ff1744',
                    textShadow: '0 0 16px rgba(255,23,68,0.7)',
                  }}
                >
                  {name}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* No eliminations this round */}
        {!hasEliminations && (
          <div
            className="w-full rounded-2xl px-6 py-5 text-center"
            style={{ background: 'rgba(0,240,255,0.04)', border: '1px solid rgba(0,240,255,0.12)' }}
          >
            <p style={{ color: '#8888aa' }}>No eliminations this round</p>
          </div>
        )}

        {/* Song reveal */}
        {result && (
          <div
            className="w-full rounded-2xl px-8 py-8 text-center"
            style={{ background: '#12121a', border: '1px solid rgba(0,240,255,0.12)' }}
          >
            {result.albumArtUrl && (
              <img
                src={result.albumArtUrl}
                alt={`${result.songTitle} album art`}
                className="w-40 h-40 mx-auto rounded-xl mb-5"
                style={{ boxShadow: '0 0 30px rgba(0,240,255,0.2)' }}
              />
            )}
            <p
              className="text-2xl md:text-3xl font-bold"
              style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: '#ffe600', textShadow: '0 0 20px rgba(255,230,0,0.5)' }}
            >
              {result.songTitle}
            </p>
            <p className="text-lg mt-2" style={{ color: '#8888aa' }}>by {result.songArtist}</p>
          </div>
        )}

        {/* Winner / nobody */}
        {result && (
          <div
            className="w-full rounded-2xl px-6 py-5 text-center"
            style={{
              background: result.winnerId ? 'rgba(57,255,20,0.05)' : 'rgba(255,23,68,0.05)',
              border: result.winnerId ? '1px solid rgba(57,255,20,0.3)' : '1px solid rgba(255,23,68,0.3)',
            }}
          >
            {result.winnerId ? (
              <>
                <p
                  className="text-lg font-bold"
                  style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: '#39ff14', textShadow: '0 0 15px rgba(57,255,20,0.5)' }}
                >
                  {result.winnerName} got it!
                </p>
                <p className="text-sm mt-1" style={{ color: '#8888aa' }}>
                  +{result.pointsAwarded} point{result.pointsAwarded !== 1 ? 's' : ''}
                </p>
              </>
            ) : (
              <p
                className="text-lg font-bold"
                style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: '#ff1744' }}
              >
                Nobody got it!
              </p>
            )}
          </div>
        )}

        {/* Alive count */}
        <div
          className="rounded-2xl px-10 py-5 text-center"
          style={{ background: '#12121a', border: '1px solid rgba(0,240,255,0.1)' }}
        >
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#8888aa', fontFamily: 'var(--font-orbitron), sans-serif' }}>
            Still Alive
          </p>
          <p
            className="text-4xl font-bold"
            style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#00f0ff', textShadow: '0 0 20px rgba(0,240,255,0.5)' }}
          >
            {alivePlayers}
          </p>
        </div>

        {/* Drinking prompt */}
        {gameState.drinkingPrompt && (
          <div
            className="w-full rounded-2xl px-6 py-5 text-center"
            style={{ background: 'rgba(255,0,229,0.05)', border: '1px solid rgba(255,0,229,0.35)' }}
          >
            <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#ff00e5', opacity: 0.6, fontFamily: 'var(--font-orbitron), sans-serif' }}>Drink up</p>
            <p
              className="text-xl font-bold"
              style={{ color: '#ff00e5', textShadow: '0 0 15px rgba(255,0,229,0.4)' }}
            >
              {gameState.drinkingPrompt}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
