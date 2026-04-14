'use client';

import { Crown, Trophy } from 'lucide-react';
import { ClientGameState } from '@shared/types/game';
import Card from '@/components/ui/Card';

interface Props {
  gameState: ClientGameState;
}

const TEAM_TEXT_COLOR: Record<string, string> = {
  cyan: 'text-neon-cyan',
  magenta: 'text-neon-magenta',
  yellow: 'text-neon-yellow',
  green: 'text-neon-green',
};

const TEAM_BORDER_COLOR: Record<string, string> = {
  cyan: 'border-neon-cyan',
  magenta: 'border-neon-magenta',
  yellow: 'border-neon-yellow',
  green: 'border-neon-green',
};

export default function ScoreboardDisplay({ gameState }: Props) {
  // Team scoreboard
  if (gameState.teamMode && gameState.teamScores) {
    return (
      <div className="flex flex-col items-center gap-8 w-full max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <Trophy
            className="w-8 h-8"
            style={{ color: '#ffe600', filter: 'drop-shadow(0 0 12px rgba(255, 230, 0, 0.8))' }}
          />
          <span className="text-text-secondary text-sm uppercase tracking-widest">Team Scoreboard</span>
        </div>

        <div className="w-full space-y-4">
          {gameState.teamScores.map((ts, index) => {
            const textColor = TEAM_TEXT_COLOR[ts.teamColor] || 'text-neon-cyan';
            const borderColor = TEAM_BORDER_COLOR[ts.teamColor] || 'border-neon-cyan';
            const isFirst = index === 0;

            return (
              <div
                key={ts.teamId}
                style={{ transform: isFirst ? 'scale(1.03)' : 'scale(1)', transition: 'transform 0.3s' }}
              >
            <Card className={`py-4 px-6 border-l-4 ${borderColor}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-bold text-lg ${textColor}`}>
                    #{index + 1} Team {ts.teamName}
                  </span>
                  <span className={`font-[family-name:var(--font-mono)] text-2xl font-bold ${textColor}`}>
                    {ts.totalScore}
                  </span>
                </div>
                <div className="space-y-1">
                  {ts.members.map((m) => (
                    <div key={m.playerId} className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">{m.displayName}</span>
                      <span className="font-[family-name:var(--font-mono)] text-text-secondary">
                        {m.score} ({m.correctAnswers} correct)
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
              </div>
            );
          })}
        </div>

        <p className="text-text-secondary text-sm">
          Next round in {gameState.timeRemaining}s...
        </p>
      </div>
    );
  }

  // Individual scoreboard (free-for-all)
  const sorted = [...gameState.scores].sort((a, b) => b.score - a.score);

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Trophy
          className="w-10 h-10"
          style={{ color: '#ffe600', filter: 'drop-shadow(0 0 16px rgba(255, 230, 0, 0.8))' }}
        />
        <h2
          className="text-3xl"
          style={{
            fontFamily: 'var(--font-orbitron), sans-serif',
            color: '#ffe600',
            textShadow: '0 0 20px rgba(255, 230, 0, 0.5)',
          }}
        >
          LEADERBOARD
        </h2>
      </div>

      <div className="w-full space-y-3">
        {sorted.map((ps, index) => {
          const isFirst = index === 0 && ps.score > 0;
          const isTop3 = index < 3 && ps.score > 0;

          return (
            <div
              key={ps.playerId}
              className="rounded-2xl px-6 py-4 transition-all relative"
              style={{
                background: isFirst
                  ? 'linear-gradient(135deg, rgba(255, 230, 0, 0.12) 0%, rgba(255, 230, 0, 0.04) 100%)'
                  : '#1a1a2e',
                border: isFirst
                  ? '2px solid rgba(255, 230, 0, 0.6)'
                  : index === 1
                  ? '1px solid rgba(0, 240, 255, 0.3)'
                  : '1px solid rgba(0, 240, 255, 0.1)',
                boxShadow: isFirst
                  ? '0 0 30px rgba(255, 230, 0, 0.25), 0 4px 16px rgba(0, 0, 0, 0.3)'
                  : '0 2px 8px rgba(0, 0, 0, 0.3)',
                transform: isFirst ? 'scale(1.03)' : 'scale(1)',
              }}
            >
              {/* Crown above #1 */}
              {isFirst && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                  <Crown
                    className="w-7 h-7"
                    style={{ color: '#ffe600', filter: 'drop-shadow(0 0 10px rgba(255, 230, 0, 0.9))' }}
                  />
                </div>
              )}

              <div className="flex items-center gap-5">
                {/* Rank circle */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                  style={{
                    background: isFirst
                      ? 'radial-gradient(circle, #ffe600, #ffb800)'
                      : isTop3
                      ? 'rgba(0, 240, 255, 0.15)'
                      : '#12121a',
                    color: isFirst ? '#0a0a0f' : isTop3 ? '#00f0ff' : '#8888aa',
                    fontFamily: 'var(--font-orbitron), sans-serif',
                    boxShadow: isFirst ? '0 0 20px rgba(255, 230, 0, 0.5)' : 'none',
                  }}
                >
                  {index + 1}
                </div>

                {/* Name */}
                <span
                  className="flex-1 text-xl font-bold truncate"
                  style={{
                    fontFamily: 'var(--font-orbitron), sans-serif',
                    color: isFirst ? '#ffe600' : '#e0e0ff',
                  }}
                >
                  {ps.displayName}
                </span>

                {/* Score */}
                <div className="text-right">
                  <span
                    className="font-[family-name:var(--font-mono)] text-2xl font-bold"
                    style={{
                      color: isFirst ? '#ffe600' : '#00f0ff',
                      textShadow: isFirst ? '0 0 15px rgba(255, 230, 0, 0.5)' : '0 0 10px rgba(0, 240, 255, 0.4)',
                    }}
                  >
                    {ps.score}
                  </span>
                  <span className="text-text-secondary text-xs ml-2">
                    ({ps.correctAnswers} correct)
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {gameState.quietCallout && (
        <div
          className="w-full rounded-2xl px-6 py-4 text-center"
          style={{ background: 'rgba(255,230,0,0.05)', border: '1px solid rgba(255,230,0,0.3)' }}
        >
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#ffe600', opacity: 0.6, fontFamily: 'var(--font-orbitron), sans-serif' }}>
            Calling out
          </p>
          <p className="font-bold" style={{ color: '#ffe600', textShadow: '0 0 12px rgba(255,230,0,0.4)' }}>
            {gameState.quietCallout}
          </p>
        </div>
      )}

      <p className="text-text-secondary text-sm">
        Next round in {gameState.timeRemaining}s...
      </p>
    </div>
  );
}
