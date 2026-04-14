'use client';

import { Crown } from 'lucide-react';
import { ClientGameState } from '@shared/types/game';
import type { TeamScore } from '@shared/types/team';
import { useRoom } from '@/context/RoomContext';

const TEAM_COLORS: Record<string, string> = {
  cyan: '#00f0ff',
  magenta: '#ff00e5',
  yellow: '#ffe600',
  green: '#39ff14',
};

const PLACE_COLORS = ['#ffe600', '#00f0ff', '#ff00e5', '#e0e0ff'];

function medal(index: number) {
  return index === 0 ? '1st' : index === 1 ? '2nd' : index === 2 ? '3rd' : `#${index + 1}`;
}

// All-cyan speaker logo for host context
function SpeakerLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="4" width="24" height="40" rx="2" stroke="#00f0ff" strokeWidth="2" fill="#0a0a0f"
        style={{ filter: 'drop-shadow(0 0 6px rgba(0,240,255,0.5))' }}/>
      <circle cx="24" cy="16" r="6" stroke="#00f0ff" strokeWidth="2" fill="none"/>
      <circle cx="24" cy="16" r="3" fill="#00f0ff"/>
      <circle cx="24" cy="32" r="6" stroke="#00f0ff" strokeWidth="2" fill="none"/>
      <circle cx="24" cy="32" r="3" fill="#00f0ff"/>
    </svg>
  );
}

interface Props {
  gameState: ClientGameState;
}

export default function GameOverDisplay({ gameState }: Props) {
  const { resetToLobby } = useRoom();
  const sorted = [...gameState.scores].sort((a, b) => b.score - a.score);
  const topScore = sorted[0]?.score ?? 0;
  const coWinners = topScore > 0 ? sorted.filter((s) => s.score === topScore) : [];
  const isTiedWin = coWinners.length > 1;

  const winningTeam = gameState.teamMode && gameState.teamScores && gameState.teamScores.length > 0
    ? gameState.teamScores[0]
    : null;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-10"
      style={{ background: '#0a0a0f' }}
    >
      <div className="w-full max-w-2xl space-y-8">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2">
          <SpeakerLogo />
          <span
            className="text-xl font-bold tracking-tight"
            style={{
              fontFamily: 'var(--font-orbitron), sans-serif',
              color: '#00f0ff',
              textShadow: '0 0 16px rgba(0,240,255,0.5)',
            }}
          >
            BuzzBeats
          </span>
        </div>

        {/* Winner announcement */}
        <div className="text-center space-y-2">
          <p
            className="text-xs uppercase tracking-[0.4em]"
            style={{ color: '#8888aa', fontFamily: 'var(--font-orbitron), sans-serif' }}
          >
            Game Over
          </p>

          {gameState.teamMode && winningTeam && winningTeam.totalScore > 0 ? (
            <>
              <p
                className="font-bold"
                style={{
                  fontFamily: 'var(--font-orbitron), sans-serif',
                  fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                  color: TEAM_COLORS[winningTeam.teamColor] ?? '#ffe600',
                  textShadow: `0 0 30px ${TEAM_COLORS[winningTeam.teamColor] ?? '#ffe600'}80`,
                }}
              >
                Team {winningTeam.teamName}
              </p>
              <p className="text-lg" style={{ color: '#8888aa' }}>
                wins with {winningTeam.totalScore} point{winningTeam.totalScore !== 1 ? 's' : ''}!
              </p>
            </>
          ) : coWinners.length > 0 ? (
            <>
              <p
                className="font-bold"
                style={{
                  fontFamily: 'var(--font-orbitron), sans-serif',
                  fontSize: isTiedWin ? 'clamp(1.8rem, 5vw, 3rem)' : 'clamp(2.5rem, 8vw, 4.5rem)',
                  color: '#ffe600',
                  textShadow: '0 0 30px rgba(255,230,0,0.7), 0 0 60px rgba(255,230,0,0.4)',
                }}
              >
                {isTiedWin
                  ? coWinners.map((w) => w.displayName).join(' & ')
                  : coWinners[0].displayName}
              </p>
              <p className="text-lg" style={{ color: '#8888aa' }}>
                {isTiedWin
                  ? `tied with ${topScore} point${topScore !== 1 ? 's' : ''} each!`
                  : `wins with ${topScore} point${topScore !== 1 ? 's' : ''}!`}
              </p>
            </>
          ) : null}
        </div>

        {/* Final standings */}
        {gameState.teamMode && gameState.teamScores ? (
          <div className="space-y-3">
            {gameState.teamScores.map((ts: TeamScore, index: number) => {
              const color = TEAM_COLORS[ts.teamColor] ?? '#00f0ff';
              const isFirst = index === 0;
              return (
                <div
                  key={ts.teamId}
                  className="rounded-2xl px-6 py-4"
                  style={{
                    background: isFirst ? `${color}0d` : '#12121a',
                    border: `${isFirst ? '2px' : '1px'} solid ${isFirst ? color : 'rgba(255,255,255,0.07)'}`,
                    boxShadow: isFirst ? `0 0 24px ${color}25` : 'none',
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="text-lg font-bold w-10"
                        style={{ fontFamily: 'var(--font-orbitron), sans-serif', color }}
                      >
                        {medal(index)}
                      </span>
                      <span className="text-lg font-bold" style={{ color }}>{ts.teamName}</span>
                    </div>
                    <div className="text-right">
                      <span
                        className="text-2xl font-bold"
                        style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color }}
                      >
                        {ts.totalScore}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1 border-t pt-2" style={{ borderColor: `${color}20` }}>
                    {ts.members.map((m) => (
                      <div key={m.playerId} className="flex items-center justify-between text-sm">
                        <span style={{ color: '#8888aa' }}>{m.displayName}</span>
                        <span style={{ color: '#8888aa', fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
                          {m.score}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((ps, index) => {
              const isWinner = coWinners.some((w) => w.playerId === ps.playerId);
              const color = isWinner ? '#ffe600' : (PLACE_COLORS[index] ?? '#e0e0ff');
              return (
                <div
                  key={ps.playerId}
                  className="rounded-2xl px-6 py-4"
                  style={{
                    background: isWinner ? 'rgba(255,230,0,0.06)' : '#12121a',
                    border: isWinner ? '2px solid rgba(255,230,0,0.5)' : '1px solid rgba(255,255,255,0.07)',
                    boxShadow: isWinner ? '0 0 24px rgba(255,230,0,0.2)' : 'none',
                  }}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className="text-lg font-bold w-10 flex-shrink-0"
                      style={{ fontFamily: 'var(--font-orbitron), sans-serif', color }}
                    >
                      {medal(index)}
                    </span>
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {isWinner && (
                        <Crown
                          className="w-4 h-4 flex-shrink-0"
                          style={{ color: '#ffe600', filter: 'drop-shadow(0 0 6px rgba(255,230,0,0.9))' }}
                        />
                      )}
                      <span className="text-lg font-bold truncate" style={{ color: isWinner ? '#ffe600' : '#e0e0ff' }}>
                        {ps.displayName}
                      </span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span
                        className="text-2xl font-bold"
                        style={{
                          fontFamily: 'var(--font-jetbrains-mono), monospace',
                          color,
                          textShadow: isWinner ? '0 0 12px rgba(255,230,0,0.5)' : 'none',
                        }}
                      >
                        {ps.score}
                      </span>
                      <p className="text-xs mt-0.5" style={{ color: '#8888aa' }}>
                        {ps.correctAnswers}/{gameState.totalRounds} correct
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Feedback */}
        <div className="text-center">
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSeH5TffvCKjgswAm17vQ35N1s7ZixpFbnkpwEY8cVX8FNiTZw/viewform?usp=publish-editor"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm transition-all duration-200 hover:opacity-80"
            style={{ color: '#8888aa', textDecoration: 'underline', textUnderlineOffset: '3px' }}
          >
            💬 Enjoyed it? Leave us some feedback!
          </a>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => resetToLobby()}
            className="flex-1 py-4 rounded-2xl font-bold text-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer"
            style={{
              fontFamily: 'var(--font-orbitron), sans-serif',
              background: 'transparent',
              border: '2px solid #00f0ff',
              color: '#00f0ff',
              boxShadow: '0 0 20px rgba(0,240,255,0.2)',
            }}
          >
            NEW GAME
          </button>
          <button
            onClick={() => { window.location.href = '/'; }}
            className="flex-1 py-4 rounded-2xl font-bold text-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer"
            style={{
              fontFamily: 'var(--font-orbitron), sans-serif',
              background: 'transparent',
              border: '2px solid #ff00e5',
              color: '#ff00e5',
              boxShadow: '0 0 20px rgba(255,0,229,0.2)',
            }}
          >
            EXIT
          </button>
        </div>

      </div>
    </div>
  );
}
