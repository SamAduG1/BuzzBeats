'use client';

import { ClientGameState } from '@shared/types/game';
import Card from '@/components/ui/Card';

interface Props {
  gameState: ClientGameState;
}

export default function RevealDisplay({ gameState }: Props) {
  const result = gameState.roundResult;
  if (!result) return null;

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-5xl mx-auto">
      <div className="text-sm uppercase tracking-widest"
        style={gameState.isTiebreaker ? { color: '#ffe600', fontFamily: 'var(--font-orbitron), sans-serif', fontSize: '0.65rem', letterSpacing: '0.25em' } : { color: 'var(--color-text-secondary)' }}
      >
        {gameState.isTiebreaker
          ? 'SUDDEN DEATH'
          : `Round ${Math.min(gameState.currentRound, gameState.totalRounds)} of ${gameState.totalRounds}`}
      </div>

      {/* Lyric snippet (Name That Lyric mode only) */}
      {gameState.gameMode === 'name-that-lyric' && gameState.currentLyric && (
        <div
          className="w-full px-6 py-4"
          style={{
            borderLeft: '3px solid #00f0ff',
            boxShadow: '-4px 0 16px rgba(0,240,255,0.15)',
            background: 'rgba(0,240,255,0.03)',
            borderRadius: '0 12px 12px 0',
          }}
        >
          {gameState.currentLyric.split('\n').map((line, i) => (
            <p
              key={i}
              className="italic text-left leading-relaxed"
              style={{
                fontFamily: 'var(--font-jetbrains-mono), monospace',
                fontSize: '1rem',
                color: '#8888aa',
                marginBottom: i < gameState.currentLyric!.split('\n').length - 1 ? '0.25em' : 0,
              }}
            >
              {line}
            </p>
          ))}
        </div>
      )}

      {/* Album art + song info */}
      <Card className="w-full text-center py-8">
        {result.albumArtUrl && (
          <div className="mb-6">
            <img
              src={result.albumArtUrl}
              alt={`${result.songTitle} album art`}
              className="w-48 h-48 md:w-64 md:h-64 mx-auto rounded-xl glow-cyan"
            />
          </div>
        )}

        <p
          className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold"
          style={{ color: '#ffe600', textShadow: '0 0 20px rgba(255, 230, 0, 0.5), 0 0 40px rgba(255, 230, 0, 0.3)' }}
        >
          {result.songTitle}
        </p>
        <p className="text-text-secondary text-xl mt-2">
          by {result.songArtist}
        </p>
      </Card>

      {/* Winner announcement */}
      <Card className="w-full text-center py-6">
        {result.winnerId ? (
          <>
            <p className="text-neon-green text-lg font-bold">
              {result.winnerName}
              {gameState.teamMode && gameState.teams && (() => {
                const team = gameState.teams.find((t) => t.playerIds.includes(result.winnerId!));
                return team ? ` (Team ${team.name})` : '';
              })()}
              {' '}got it!
            </p>
            <p className="text-text-secondary mt-1">
              +{result.pointsAwarded} point{result.pointsAwarded !== 1 ? 's' : ''}{' '}
              <span className="text-text-secondary/60">
                ({result.answerType === 'both'
                  ? 'Artist + Title'
                  : result.answerType === 'title'
                  ? 'Title only'
                  : 'Artist only'})
              </span>
            </p>
          </>
        ) : (
          <p className="text-neon-red text-lg font-bold">
            Nobody got it!
          </p>
        )}
      </Card>

      {/* Drinking prompt (adult mode) */}
      {gameState.drinkingPrompt && (
        <Card className="w-full text-center py-5 border border-neon-magenta/40 bg-neon-magenta/5">
          <p className="text-neon-magenta text-xl font-bold">
            {gameState.drinkingPrompt}
          </p>
        </Card>
      )}
    </div>
  );
}
