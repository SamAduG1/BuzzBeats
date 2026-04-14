'use client';

import { ClientGameState } from '@shared/types/game';
import { AVAILABLE_GAME_MODES } from '@shared/types/gameMode';
import GameModeIcon from '@/components/ui/GameModeIcon';

interface Props {
  gameState: ClientGameState;
}

export default function RulesDisplay({ gameState }: Props) {
  const mode = AVAILABLE_GAME_MODES.find((m) => m.id === gameState.gameMode);
  if (!mode) return null;

  const c = mode.color;
  const cFaint = `${c}18`;
  const cBorder = `${c}30`;
  const cGlow = `${c}99`;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 w-full max-w-3xl mx-auto px-4">

      {/* Icon + mode name + tagline */}
      <div className="flex flex-col items-center gap-3 text-center">
        <div
          className="rounded-2xl p-4"
          style={{ background: cFaint, border: `1px solid ${cBorder}` }}
        >
          <GameModeIcon id={mode.id} size={56} />
        </div>

        <div>
          <p
            className="text-xs uppercase tracking-[0.5em] mb-2"
            style={{ color: '#8888aa', fontFamily: 'var(--font-orbitron), sans-serif' }}
          >
            Now Playing
          </p>
          <p
            className="font-bold leading-none mb-2"
            style={{
              fontFamily: 'var(--font-orbitron), sans-serif',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color: c,
              textShadow: `0 0 30px ${cGlow}, 0 0 60px ${c}44`,
            }}
          >
            {mode.name}
          </p>
          <p
            className="text-lg italic"
            style={{ color: '#8888aa' }}
          >
            {mode.tagline}
          </p>
        </div>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Rules */}
        <div
          className="rounded-2xl px-6 py-5 space-y-3"
          style={{ background: '#12121a', border: `1px solid ${cBorder}` }}
        >
          <p
            className="text-xs uppercase tracking-widest mb-4"
            style={{ color: c, fontFamily: 'var(--font-orbitron), sans-serif', opacity: 0.8 }}
          >
            Rules
          </p>
          {mode.rules.map((rule, i) => (
            <div key={i} className="flex items-start gap-3">
              <span
                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                style={{
                  background: cFaint,
                  border: `1px solid ${cBorder}`,
                  color: c,
                  fontFamily: 'var(--font-orbitron), sans-serif',
                }}
              >
                {i + 1}
              </span>
              <p className="text-base" style={{ color: '#c0c0d8', lineHeight: 1.5 }}>
                {rule}
              </p>
            </div>
          ))}
        </div>

        {/* Scoring */}
        <div
          className="rounded-2xl px-6 py-5 space-y-3"
          style={{ background: '#12121a', border: `1px solid ${cBorder}` }}
        >
          <p
            className="text-xs uppercase tracking-widest mb-4"
            style={{ color: c, fontFamily: 'var(--font-orbitron), sans-serif', opacity: 0.8 }}
          >
            Scoring
          </p>
          {mode.scoring.map((line, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl px-4 py-2"
              style={{ background: i === 0 ? cFaint : 'transparent', border: i === 0 ? `1px solid ${cBorder}` : 'none' }}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: i === 0 ? c : '#444466', boxShadow: i === 0 ? `0 0 8px ${c}` : 'none' }}
              />
              <p
                className="text-base"
                style={{
                  color: i === 0 ? c : '#8888aa',
                  fontWeight: i === 0 ? 600 : 400,
                  fontFamily: i === 0 ? 'var(--font-orbitron), sans-serif' : 'inherit',
                  fontSize: i === 0 ? '0.875rem' : '0.95rem',
                }}
              >
                {line}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Countdown */}
      <p
        className="text-sm uppercase tracking-[0.4em]"
        style={{ color: '#8888aa', fontFamily: 'var(--font-orbitron), sans-serif' }}
      >
        Starting in{' '}
        <span
          style={{
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            color: c,
            textShadow: `0 0 12px ${cGlow}`,
          }}
        >
          {gameState.timeRemaining}s
        </span>
      </p>
    </div>
  );
}
