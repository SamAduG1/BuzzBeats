'use client';

import { useEffect, useRef, useState } from 'react';
import { ClientGameState } from '@shared/types/game';
import Card from '@/components/ui/Card';

interface Props {
  gameState: ClientGameState;
}

export default function PlayingDisplay({ gameState }: Props) {
  const barRef = useRef<HTMLDivElement>(null);
  const [equalizerBars, setEqualizerBars] = useState<number[]>(Array(20).fill(0.5));

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const phase = gameState.phase;
    if (phase !== 'playing' && phase !== 'buzzing') return;

    // For Snippet, use fixed clip duration so bar is always accurate.
    // For buzzing, drain from 100% over the buzzing window.
    // For playing, start the bar at the correct proportional position based on
    // how much time remains vs the full round duration, so resuming after a
    // wrong answer doesn't falsely show a full bar.
    if (gameState.gameMode === 'snippet' && phase === 'playing' && gameState.clipDuration) {
      bar.style.transition = 'none';
      bar.style.width = '100%';
      void bar.offsetHeight;
      bar.style.transition = `width ${gameState.clipDuration}s linear`;
      bar.style.width = '0%';
    } else if (phase === 'buzzing') {
      const buzzDuration = gameState.maxBuzzingTime ?? gameState.timeRemaining;
      bar.style.transition = 'none';
      bar.style.width = '100%';
      void bar.offsetHeight;
      bar.style.transition = `width ${buzzDuration}s linear`;
      bar.style.width = '0%';
    } else {
      // playing — start at proportional width so bar matches server timer
      const maxTime = gameState.maxPlayingTime ?? gameState.timeRemaining;
      const startPct = maxTime > 0 ? (gameState.timeRemaining / maxTime) * 100 : 100;
      bar.style.transition = 'none';
      bar.style.width = `${startPct}%`;
      void bar.offsetHeight;
      bar.style.transition = `width ${gameState.timeRemaining}s linear`;
      bar.style.width = '0%';
    }
  }, [gameState.phase, gameState.subRound]);

  // Equalizer animation — only runs during playing phase for audio modes
  useEffect(() => {
    if (gameState.phase !== 'playing' || gameState.gameMode === 'name-that-lyric') return;

    const interval = setInterval(() => {
      setEqualizerBars(Array(20).fill(0).map(() => Math.random()));
    }, 100);

    return () => clearInterval(interval);
  }, [gameState.phase, gameState.gameMode]);

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      {/* Round info */}
      <div className="text-text-secondary text-sm uppercase tracking-widest"
        style={gameState.isTiebreaker ? { color: '#ffe600', fontFamily: 'var(--font-orbitron), sans-serif', fontSize: '0.65rem', letterSpacing: '0.25em' } : {}}
      >
        {gameState.isTiebreaker
          ? 'SUDDEN DEATH'
          : gameState.gameMode === 'snippet'
            ? `Song ${gameState.currentRound} of ${gameState.totalRounds}`
            : `Round ${gameState.currentRound} of ${gameState.totalRounds}`}
      </div>

      {/* Snippet sub-round indicator */}
      {gameState.gameMode === 'snippet' && gameState.subRound && gameState.phase === 'playing' && (
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            {[...Array(gameState.totalSubRounds ?? 4)].map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i < gameState.subRound! ? 'bg-neon-cyan' : 'bg-text-secondary/30'
                }`}
              />
            ))}
          </div>
          <span className="text-neon-cyan text-sm font-bold font-[family-name:var(--font-mono)]">
            Snippet {gameState.subRound}/{gameState.totalSubRounds} — up to {gameState.maxPoints}pts
          </span>
        </div>
      )}

      {/* Timer bar */}
      <div
        className="w-full h-3 relative overflow-hidden"
        style={{ background: '#12121a', boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.4)' }}
      >
        <div
          ref={barRef}
          className="h-full relative"
          style={{
            width: '100%',
            background: 'linear-gradient(90deg, #00f0ff 0%, #00d4ff 50%, #00b8ff 100%)',
            boxShadow: '0 0 20px rgba(0, 240, 255, 0.6), 0 0 40px rgba(0, 240, 255, 0.3)',
          }}
        >
          {/* Shine overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)',
            }}
          />
        </div>
      </div>

      {/* Main display */}
      <Card className="w-full text-center py-12">
        {gameState.phase === 'playing' ? (
          gameState.gameMode === 'name-that-lyric' && gameState.currentLyric != null ? (
            <>
              {/* Lyric display for Name That Lyric */}
              <p className="text-xs uppercase tracking-[0.3em] mb-6" style={{ color: '#8888aa', fontFamily: 'var(--font-orbitron), sans-serif' }}>
                Name That Lyric
              </p>
              <div
                className="mx-auto max-w-xl px-4"
                style={{
                  borderLeft: '3px solid #00f0ff',
                  boxShadow: '-4px 0 20px rgba(0,240,255,0.2)',
                }}
              >
                {gameState.currentLyric.split('\n').map((line, i) => (
                  <p
                    key={i}
                    className="text-left italic leading-relaxed"
                    style={{
                      fontFamily: 'var(--font-jetbrains-mono), monospace',
                      fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
                      color: '#e0e0ff',
                      textShadow: '0 0 12px rgba(224,224,255,0.2)',
                      marginBottom: i < gameState.currentLyric!.split('\n').length - 1 ? '0.4em' : 0,
                    }}
                  >
                    {line}
                  </p>
                ))}
              </div>
              <p className="mt-6 text-sm" style={{ color: '#8888aa' }}>
                Buzz in — name the song and artist!
              </p>
            </>
          ) : (
            <>
              {/* 20-bar JS-animated equalizer */}
              <div className="flex items-end justify-center gap-1.5 h-40 mb-6">
                {equalizerBars.map((height, i) => (
                  <div
                    key={i}
                    className="rounded-t-sm transition-all duration-100 ease-out"
                    style={{
                      width: '18px',
                      height: `${Math.max(height * 100, 4)}%`,
                      background: 'linear-gradient(to top, #00f0ff 0%, #00d4ff 30%, #00b8ff 60%, #ff00e5 100%)',
                      boxShadow: '0 0 12px rgba(0, 240, 255, 0.5)',
                      minHeight: '4px',
                    }}
                  />
                ))}
              </div>
              <p
                className="text-2xl"
                style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: '#00f0ff', textShadow: '0 0 20px rgba(0,240,255,0.5)' }}
              >
                Listening...
              </p>
              <p className="mt-2" style={{ color: '#8888aa' }}>
                Players can buzz in!
              </p>
            </>
          )
        ) : (
          <>
            {/* Buzzing phase */}
            <div className="mb-4">
              <div className="w-4 h-4 bg-neon-magenta rounded-full mx-auto animate-pulse-dot mb-4" />
              <p
                className="text-3xl font-bold"
                style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: '#ff00e5', textShadow: '0 0 25px rgba(255,0,229,0.6)' }}
              >
                {gameState.buzzedPlayerName}
                {gameState.teamMode && gameState.teams && gameState.buzzedPlayerId && (() => {
                  const team = gameState.teams.find((t) => t.playerIds.includes(gameState.buzzedPlayerId!));
                  return team ? (
                    <span className="text-lg font-normal" style={{ color: '#8888aa' }}> (Team {team.name})</span>
                  ) : null;
                })()}
              </p>
              <p className="mt-2" style={{ color: '#8888aa' }}>is answering...</p>
            </div>
            <p
              className="text-5xl font-bold mt-4"
              style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#ffe600', textShadow: '0 0 20px rgba(255,230,0,0.5)' }}
            >
              {gameState.timeRemaining}
            </p>
          </>
        )}
      </Card>

      {/* Timer display */}
      <p className="font-[family-name:var(--font-mono)] text-4xl text-neon-cyan">
        {gameState.timeRemaining}s
      </p>

      {/* Mini scoreboard */}
      {gameState.teamMode && gameState.teamScores ? (
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-2">
          {gameState.teamScores.map((ts) => {
            const colorClass = ts.teamColor === 'cyan' ? 'text-neon-cyan' : ts.teamColor === 'magenta' ? 'text-neon-magenta' : ts.teamColor === 'yellow' ? 'text-neon-yellow' : 'text-neon-green';
            return (
              <Card key={ts.teamId} className="text-center py-2 px-3">
                <p className={`text-sm font-bold ${colorClass}`}>Team {ts.teamName}</p>
                <p className={`font-[family-name:var(--font-mono)] text-lg font-bold ${colorClass}`}>
                  {ts.totalScore}
                </p>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {gameState.scores.map((ps) => (
            <Card key={ps.playerId} className="text-center py-2 px-3">
              <p className="text-text-primary text-sm truncate">{ps.displayName}</p>
              <p className="font-[family-name:var(--font-mono)] text-neon-cyan text-lg font-bold">
                {ps.score}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
