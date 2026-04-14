'use client';

import { useEffect, useRef, useState } from 'react';
import useCountdownBeeps from '@/hooks/useCountdownBeeps';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { Trophy } from 'lucide-react';
import { useRoom } from '@/context/RoomContext';
import { AVAILABLE_GAME_MODES } from '@shared/types/gameMode';
import GameModeIcon from '@/components/ui/GameModeIcon';
import BuzzerButton from './BuzzerButton';
import AnswerForm from './AnswerForm';

export default function PlayerGameScreen() {
  const { gameState, answerResult, socket, leaveRoom, voteTiebreaker, voteTie } = useRoom();
  const { playCorrect, playWrong, playTick } = useSoundEffects();
  const barRef = useRef<HTMLDivElement>(null);
  const prevAnswerResultRef = useRef<typeof answerResult>(null);
  const [myTiebreakerVote, setMyTiebreakerVote] = useState<string | null>(null);
  const [myTieVote, setMyTieVote] = useState<'sudden-death' | 'share' | null>(null);
  useCountdownBeeps(gameState?.phase, gameState?.timeRemaining);

  // Tick during final 5 seconds of playing/buzzing (mirrors host screen)
  const prevTimeRef = useRef<number | null>(null);
  useEffect(() => {
    if (!gameState) return;
    const { phase, timeRemaining } = gameState;
    if (phase !== 'playing' && phase !== 'buzzing') return;
    if (timeRemaining === prevTimeRef.current) return;
    prevTimeRef.current = timeRemaining;
    if (timeRemaining > 0 && timeRemaining <= 5) {
      playTick().catch(() => {});
    }
  }, [gameState?.timeRemaining, gameState?.phase, playTick]);

  // Reset local vote states on phase transitions
  useEffect(() => {
    if (gameState?.phase === 'tiebreaker') setMyTiebreakerVote(null);
    if (gameState?.phase === 'tie-vote') setMyTieVote(null);
  }, [gameState?.phase]);

  // Play sound when our answer result arrives
  useEffect(() => {
    if (!answerResult || answerResult === prevAnswerResultRef.current) return;
    prevAnswerResultRef.current = answerResult;
    if (answerResult.correct) {
      playCorrect().catch(() => {});
    } else {
      playWrong().catch(() => {});
    }
  }, [answerResult, playCorrect, playWrong]);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar || !gameState) return;

    const phase = gameState.phase;
    if (phase !== 'playing' && phase !== 'buzzing') return;

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
      // Start bar at proportional position — stays accurate when resuming after wrong answer
      const maxTime = gameState.maxPlayingTime ?? gameState.timeRemaining;
      const startPct = maxTime > 0 ? (gameState.timeRemaining / maxTime) * 100 : 100;
      bar.style.transition = 'none';
      bar.style.width = `${startPct}%`;
      void bar.offsetHeight;
      bar.style.transition = `width ${gameState.timeRemaining}s linear`;
      bar.style.width = '0%';
    }
  }, [gameState?.phase, gameState?.subRound]);

  if (!gameState) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-3 h-3 bg-neon-cyan rounded-full animate-pulse-dot mx-auto mb-4" />
          <p className="text-text-secondary">Loading game...</p>
        </div>
      </div>
    );
  }

  const myId = socket.id;
  const isBuzzedPlayer = gameState.buzzedPlayerId === myId;
  const isDisqualified = gameState.disqualifiedIds.includes(myId || '');
  const isEliminated = gameState.eliminatedIds?.includes(myId || '') ?? false;
  const isLastChanceRound = gameState.isLastChanceRound ?? false;
  const myScore = gameState.scores.find((s) => s.playerId === myId);
  const myTeam = gameState.teamMode && gameState.teams
    ? gameState.teams.find((t) => t.playerIds.includes(myId || ''))
    : null;
  const teamColorClass: Record<string, string> = {
    cyan: 'text-neon-cyan', magenta: 'text-neon-magenta',
    yellow: 'text-neon-yellow', green: 'text-neon-green',
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto">
      {/* Round + score header — hidden during game-over */}
      {gameState.phase !== 'game-over' && (
        <div className="w-full flex items-center justify-between text-sm pt-6">
          <div className="flex items-center gap-2">
            <span className="text-text-secondary" style={gameState.isTiebreaker ? { color: '#ffe600', fontFamily: 'var(--font-orbitron), sans-serif', fontSize: '0.7rem', letterSpacing: '0.15em' } : {}}>
              {gameState.isTiebreaker
                ? 'SUDDEN DEATH'
                : gameState.gameMode === 'snippet'
                  ? `Song ${Math.min(gameState.currentRound, gameState.totalRounds)}/${gameState.totalRounds}`
                  : `Round ${Math.min(gameState.currentRound, gameState.totalRounds)}/${gameState.totalRounds}`}
            </span>
            {myTeam && (
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${teamColorClass[myTeam.color] || 'text-neon-cyan'} bg-bg-card`}>
                Team {myTeam.name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span
              className="font-[family-name:var(--font-mono)] font-bold"
              style={{ color: '#ffe600', textShadow: '0 0 12px rgba(255, 230, 0, 0.5)' }}
            >
              {myScore?.score ?? 0} pts
            </span>
            <button
              onClick={() => { leaveRoom(); window.location.href = '/'; }}
              className="text-text-secondary/60 hover:text-neon-magenta text-sm transition-colors cursor-pointer"
            >
              Leave
            </button>
          </div>
        </div>
      )}

      {/* Timer bar */}
      {(gameState.phase === 'playing' || gameState.phase === 'buzzing') && (
        <div className="w-full h-1.5 bg-bg-card rounded-full overflow-hidden">
          <div
            ref={barRef}
            className="h-full bg-neon-cyan rounded-full"
            style={{ width: '100%' }}
          />
        </div>
      )}

      {/* Snippet sub-round indicator */}
      {gameState.gameMode === 'snippet' && gameState.subRound && (gameState.phase === 'playing' || gameState.phase === 'buzzing') && (
        <div className="w-full flex items-center justify-center gap-3">
          <div className="flex gap-1">
            {[...Array(gameState.totalSubRounds ?? 4)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i < gameState.subRound! ? 'bg-neon-cyan' : 'bg-text-secondary/30'
                }`}
              />
            ))}
          </div>
          <span className="text-neon-cyan text-xs font-bold font-[family-name:var(--font-mono)]">
            up to {gameState.maxPoints}pts
          </span>
        </div>
      )}

      {/* Phase-specific content */}
      {gameState.phase === 'rules' && (() => {
        const mode = AVAILABLE_GAME_MODES.find((m) => m.id === gameState.gameMode);
        if (!mode) return null;
        const c = mode.color;
        const cFaint = `${c}18`;
        const cBorder = `${c}30`;
        return (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-5 w-full py-4">
            {/* Icon + name + tagline */}
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="rounded-2xl p-3 mb-1" style={{ background: cFaint, border: `1px solid ${cBorder}` }}>
                <GameModeIcon id={mode.id} size={44} />
              </div>
              <p
                className="text-2xl font-bold"
                style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: c, textShadow: `0 0 20px ${c}99` }}
              >
                {mode.name}
              </p>
              <p className="text-sm italic" style={{ color: '#8888aa' }}>{mode.tagline}</p>
            </div>

            {/* Rules */}
            <div className="w-full rounded-2xl px-5 py-4 space-y-3" style={{ background: '#12121a', border: `1px solid ${cBorder}` }}>
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: c, fontFamily: 'var(--font-orbitron), sans-serif', opacity: 0.8 }}>Rules</p>
              {mode.rules.map((rule, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span
                    className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                    style={{ background: cFaint, border: `1px solid ${cBorder}`, color: c, fontFamily: 'var(--font-orbitron), sans-serif' }}
                  >{i + 1}</span>
                  <p className="text-sm" style={{ color: '#c0c0d8', lineHeight: 1.5 }}>{rule}</p>
                </div>
              ))}
            </div>

            {/* Scoring */}
            <div className="w-full rounded-2xl px-5 py-4 space-y-2" style={{ background: '#12121a', border: `1px solid ${cBorder}` }}>
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: c, fontFamily: 'var(--font-orbitron), sans-serif', opacity: 0.8 }}>Scoring</p>
              {mode.scoring.map((line, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: i === 0 ? c : '#444466' }} />
                  <p className="text-sm" style={{ color: i === 0 ? c : '#8888aa', fontWeight: i === 0 ? 600 : 400 }}>{line}</p>
                </div>
              ))}
            </div>

            <p className="text-xs uppercase tracking-[0.3em]" style={{ color: '#8888aa', fontFamily: 'var(--font-orbitron), sans-serif' }}>
              Get ready!
            </p>
          </div>
        );
      })()}

      {gameState.phase === 'pre-round' && (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-5">
          <p className="text-xs uppercase tracking-[0.4em]" style={{ color: '#8888aa', fontFamily: 'var(--font-orbitron), sans-serif' }}>
            Get Ready
          </p>
          <p
            className="text-6xl font-bold"
            style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: '#00f0ff', textShadow: '0 0 30px rgba(0,240,255,0.7), 0 0 60px rgba(0,240,255,0.3)' }}
          >
            {gameState.gameMode === 'snippet' ? 'Song' : 'Round'} {Math.min(gameState.currentRound, gameState.totalRounds)}
          </p>
          <p className="text-lg" style={{ color: '#8888aa' }}>of {gameState.totalRounds}</p>
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center mt-2"
            style={{ background: '#12121a', border: '1px solid rgba(255,230,0,0.2)', boxShadow: '0 0 20px rgba(255,230,0,0.1)' }}
          >
            <span
              className="text-3xl font-bold"
              style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#ffe600', textShadow: '0 0 15px rgba(255,230,0,0.6)' }}
            >
              {gameState.timeRemaining}
            </span>
          </div>
        </div>
      )}

      {gameState.phase === 'tie-vote' && (
        <div className="relative flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-5 overflow-hidden">
          <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 25%, rgba(255,230,0,0.15) 100%)' }} />
          <div className="relative z-10 flex flex-col items-center gap-5 w-full text-center">
            <p className="text-xs uppercase tracking-[0.5em]" style={{ color: '#8888aa', fontFamily: 'var(--font-orbitron), sans-serif' }}>It&apos;s a tie!</p>
            <p className="font-bold text-2xl" style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: '#ffe600', textShadow: '0 0 16px rgba(255,230,0,0.7)' }}>
              {(gameState.tiebreakerIds ?? [])
                .map((id) => gameState.scores.find((s) => s.playerId === id)?.displayName)
                .filter(Boolean)
                .join(' & ')} are level
            </p>

            {myTieVote ? (
              <div
                className="w-full rounded-2xl px-5 py-5 text-center"
                style={{
                  background: myTieVote === 'sudden-death' ? 'rgba(255,230,0,0.07)' : 'rgba(0,240,255,0.06)',
                  border: myTieVote === 'sudden-death' ? '1px solid rgba(255,230,0,0.4)' : '1px solid rgba(0,240,255,0.3)',
                }}
              >
                <p className="text-sm mb-1" style={{ color: '#8888aa' }}>You voted for</p>
                <p className="font-bold text-lg" style={{
                  fontFamily: 'var(--font-orbitron), sans-serif',
                  color: myTieVote === 'sudden-death' ? '#ffe600' : '#00f0ff',
                }}>
                  {myTieVote === 'sudden-death' ? '⚡ Sudden Death' : '🏆 Share the Win'}
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm" style={{ color: '#c0c0d8' }}>What should happen?</p>
                <div className="flex flex-col gap-3 w-full mt-1">
                  <button
                    onClick={async () => { const ok = await voteTie('sudden-death'); if (ok) setMyTieVote('sudden-death'); }}
                    className="w-full rounded-2xl px-5 py-5 font-bold transition-all cursor-pointer"
                    style={{ fontFamily: 'var(--font-orbitron), sans-serif', background: 'rgba(255,230,0,0.08)', border: '1px solid rgba(255,230,0,0.45)', color: '#ffe600', fontSize: '1rem', letterSpacing: '0.08em' }}
                  >
                    ⚡ Sudden Death
                  </button>
                  <button
                    onClick={async () => { const ok = await voteTie('share'); if (ok) setMyTieVote('share'); }}
                    className="w-full rounded-2xl px-5 py-5 font-bold transition-all cursor-pointer"
                    style={{ fontFamily: 'var(--font-orbitron), sans-serif', background: 'rgba(0,240,255,0.06)', border: '1px solid rgba(0,240,255,0.3)', color: '#00f0ff', fontSize: '1rem', letterSpacing: '0.08em' }}
                  >
                    🏆 Share the Win
                  </button>
                </div>
              </>
            )}
            <p className="text-xs" style={{ color: '#8888aa' }}>{gameState.timeRemaining}s to vote</p>
          </div>
        </div>
      )}

      {gameState.phase === 'tiebreaker' && (() => {
        const isInTiebreaker = gameState.tiebreakerIds?.includes(myId || '') ?? false;
        const tiebreakerNames = (gameState.tiebreakerIds ?? []).map((id) => ({
          id,
          name: gameState.scores.find((s) => s.playerId === id)?.displayName ?? id,
        }));
        const votingOpen = !gameState.buzzedPlayerId;

        return (
          <div className="relative flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-5 overflow-hidden">
            <div
              className="pointer-events-none absolute inset-0 animate-elim-vignette"
              style={{ background: 'radial-gradient(ellipse at center, transparent 20%, rgba(255,230,0,0.2) 100%)' }}
            />
            <div className="relative z-10 flex flex-col items-center gap-4 text-center w-full">
              <p className="text-xs uppercase tracking-[0.5em]" style={{ color: '#8888aa', fontFamily: 'var(--font-orbitron), sans-serif' }}>It&apos;s a tie</p>
              <p
                className="glitch-text font-bold"
                data-text="SUDDEN DEATH"
                style={{ fontFamily: 'var(--font-orbitron), sans-serif', fontSize: 'clamp(1.8rem, 7vw, 2.5rem)', color: '#ffe600', textShadow: '0 0 24px rgba(255,230,0,0.9)', letterSpacing: '0.08em' }}
              >
                SUDDEN DEATH
              </p>

              {isInTiebreaker ? (
                <p className="text-lg font-bold" style={{ color: '#00f0ff', fontFamily: 'var(--font-orbitron), sans-serif' }}>YOU&apos;RE IN THE TIEBREAKER!</p>
              ) : (
                /* Voting UI for spectators */
                <div className="w-full flex flex-col items-center gap-3 mt-1">
                  {!myTiebreakerVote && votingOpen ? (
                    <>
                      <p className="text-sm font-bold" style={{ color: '#ffe600', fontFamily: 'var(--font-orbitron), sans-serif' }}>Who&apos;s winning this?</p>
                      <div className="flex flex-col gap-2 w-full">
                        {tiebreakerNames.map(({ id, name }) => (
                          <button
                            key={id}
                            onClick={async () => {
                              const ok = await voteTiebreaker(id);
                              if (ok) setMyTiebreakerVote(id);
                            }}
                            className="w-full rounded-2xl px-5 py-4 font-bold transition-all cursor-pointer"
                            style={{
                              fontFamily: 'var(--font-orbitron), sans-serif',
                              background: 'rgba(255,230,0,0.07)',
                              border: '1px solid rgba(255,230,0,0.4)',
                              color: '#ffe600',
                              fontSize: '1rem',
                            }}
                          >
                            {name}
                          </button>
                        ))}
                      </div>
                    </>
                  ) : myTiebreakerVote ? (
                    <div
                      className="w-full rounded-2xl px-5 py-4 text-center"
                      style={{ background: 'rgba(255,230,0,0.06)', border: '1px solid rgba(255,230,0,0.3)' }}
                    >
                      <p className="text-sm" style={{ color: '#8888aa' }}>You backed</p>
                      <p className="font-bold mt-1" style={{ color: '#ffe600', fontFamily: 'var(--font-orbitron), sans-serif' }}>
                        {tiebreakerNames.find((t) => t.id === myTiebreakerVote)?.name}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm" style={{ color: '#8888aa' }}>Voting closed — someone buzzed!</p>
                  )}
                </div>
              )}

              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mt-1"
                style={{ background: '#12121a', border: '1px solid rgba(255,230,0,0.3)' }}
              >
                <span className="text-3xl font-bold" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#ffe600', textShadow: '0 0 15px rgba(255,230,0,0.6)' }}>
                  {gameState.timeRemaining}
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      {gameState.phase === 'sub-round-transition' && (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <p className="text-xs uppercase tracking-[0.4em]" style={{ color: '#8888aa', fontFamily: 'var(--font-orbitron), sans-serif' }}>
            Snippet {gameState.subRound ?? 1} of {gameState.totalSubRounds ?? 4}
          </p>
          <p
            className="text-3xl font-bold"
            style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: '#39ff14', textShadow: '0 0 20px rgba(57,255,20,0.6)' }}
          >
            Longer clip coming...
          </p>
        </div>
      )}

      {gameState.phase === 'playing' && !isDisqualified && !isEliminated &&
       (!gameState.tiebreakerIds || gameState.tiebreakerIds.includes(myId || '')) && (
        <>
          {gameState.gameMode === 'name-that-lyric' && gameState.currentLyric && (
            <div
              className="w-full rounded-2xl px-5 py-4 mb-2"
              style={{ background: '#12121a', border: '1px solid rgba(0,240,255,0.15)', borderLeft: '3px solid #00f0ff' }}
            >
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#8888aa', fontFamily: 'var(--font-orbitron), sans-serif' }}>
                Name That Lyric
              </p>
              {gameState.currentLyric.split('\n').map((line, i) => (
                <p
                  key={i}
                  className="italic leading-relaxed text-sm"
                  style={{
                    fontFamily: 'var(--font-jetbrains-mono), monospace',
                    color: '#e0e0ff',
                    marginBottom: i < gameState.currentLyric!.split('\n').length - 1 ? '0.25em' : 0,
                  }}
                >
                  {line}
                </p>
              ))}
            </div>
          )}
          <BuzzerButton />
        </>
      )}

      {gameState.phase === 'playing' && gameState.tiebreakerIds && !gameState.tiebreakerIds.includes(myId || '') && !isEliminated && (() => {
        const tiebreakerNames = (gameState.tiebreakerIds ?? []).map((id) => ({
          id,
          name: gameState.scores.find((s) => s.playerId === id)?.displayName ?? id,
        }));
        const votingOpen = !gameState.buzzedPlayerId && !myTiebreakerVote;
        return (
          <div className="flex-1 flex items-center justify-center min-h-[60vh]">
            <div className="w-full flex flex-col items-center gap-3">
              <p className="text-lg font-bold" style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: '#ffe600' }}>SUDDEN DEATH</p>
              {votingOpen ? (
                <>
                  <p className="text-sm" style={{ color: '#8888aa' }}>Still time to vote!</p>
                  <div className="flex flex-col gap-2 w-full">
                    {tiebreakerNames.map(({ id, name }) => (
                      <button
                        key={id}
                        onClick={async () => {
                          const ok = await voteTiebreaker(id);
                          if (ok) setMyTiebreakerVote(id);
                        }}
                        className="w-full rounded-2xl px-5 py-3 font-bold transition-all cursor-pointer"
                        style={{ fontFamily: 'var(--font-orbitron), sans-serif', background: 'rgba(255,230,0,0.07)', border: '1px solid rgba(255,230,0,0.4)', color: '#ffe600' }}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </>
              ) : myTiebreakerVote ? (
                <div className="w-full rounded-2xl px-5 py-4 text-center" style={{ background: 'rgba(255,230,0,0.06)', border: '1px solid rgba(255,230,0,0.3)' }}>
                  <p className="text-sm" style={{ color: '#8888aa' }}>You backed</p>
                  <p className="font-bold mt-1" style={{ color: '#ffe600', fontFamily: 'var(--font-orbitron), sans-serif' }}>
                    {tiebreakerNames.find((t) => t.id === myTiebreakerVote)?.name}
                  </p>
                </div>
              ) : (
                <p className="text-sm" style={{ color: '#8888aa' }}>Voting closed — someone buzzed in!</p>
              )}
            </div>
          </div>
        );
      })()}

      {gameState.phase === 'playing' && isEliminated && !isLastChanceRound && (
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div className="w-full rounded-2xl px-6 py-8 text-center" style={{ background: 'rgba(255,23,68,0.05)', border: '1px solid rgba(255,23,68,0.3)' }}>
            <p className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: '#ff1744' }}>ELIMINATED</p>
            <p style={{ color: '#8888aa' }}>You're out! Watch the action unfold.</p>
          </div>
        </div>
      )}

      {gameState.phase === 'playing' && isEliminated && isLastChanceRound && !isDisqualified && (
        <div className="flex flex-col items-center gap-4">
          <div className="w-full rounded-2xl px-6 py-4 text-center" style={{ background: 'rgba(255,0,229,0.05)', border: '1px solid rgba(255,0,229,0.4)' }}>
            <p className="text-lg font-bold" style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: '#ff00e5' }}>THIS IS YOUR CHANCE!</p>
            <p className="text-sm mt-1" style={{ color: '#8888aa' }}>Get it right to rejoin the game</p>
          </div>
          <BuzzerButton />
        </div>
      )}

      {gameState.phase === 'playing' && isDisqualified && !isEliminated && (
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div className="w-full rounded-2xl px-6 py-8 text-center" style={{ background: '#12121a', border: '1px solid rgba(0,240,255,0.1)' }}>
            <p className="text-lg font-bold mb-2" style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: '#ff1744' }}>Wrong answer!</p>
            <p style={{ color: '#8888aa' }}>Waiting for others...</p>
          </div>
        </div>
      )}

      {gameState.phase === 'playing' && isDisqualified && isEliminated && (
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div className="w-full rounded-2xl px-6 py-8 text-center" style={{ background: 'rgba(255,23,68,0.05)', border: '1px solid rgba(255,23,68,0.3)' }}>
            <p className="text-lg font-bold mb-2" style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: '#ff1744' }}>Wrong answer!</p>
            <p style={{ color: '#8888aa' }}>Still eliminated...</p>
          </div>
        </div>
      )}

      {gameState.phase === 'buzzing' && isBuzzedPlayer && (
        <AnswerForm timeRemaining={gameState.timeRemaining} />
      )}

      {gameState.phase === 'buzzing' && !isBuzzedPlayer && (
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div className="w-full rounded-2xl px-6 py-8 text-center" style={{ background: '#12121a', border: '1px solid rgba(255,0,229,0.15)' }}>
            <p
              className="text-lg font-bold mb-2"
              style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: '#ff00e5', textShadow: '0 0 15px rgba(255,0,229,0.5)' }}
            >
              {gameState.buzzedPlayerName} buzzed in!
            </p>
            <p style={{ color: '#8888aa' }}>Waiting for their answer...</p>
          </div>
        </div>
      )}

      {gameState.phase === 'last-chance' && (
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div
            className="w-full rounded-2xl px-6 py-8 text-center"
            style={{
              background: isEliminated ? 'rgba(255,0,229,0.05)' : 'rgba(0,240,255,0.04)',
              border: isEliminated ? '1px solid rgba(255,0,229,0.4)' : '1px solid rgba(0,240,255,0.2)',
            }}
          >
            {isEliminated ? (
              <>
                <p
                  className="text-3xl font-bold mb-3"
                  style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: '#ff00e5', textShadow: '0 0 20px rgba(255,0,229,0.6)' }}
                >
                  LAST CHANCE!
                </p>
                <p style={{ color: '#8888aa' }}>Get ready to fight your way back!</p>
              </>
            ) : (
              <>
                <p
                  className="text-2xl font-bold mb-3"
                  style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: '#00f0ff', textShadow: '0 0 20px rgba(0,240,255,0.5)' }}
                >
                  Last Chance Round
                </p>
                <p style={{ color: '#8888aa' }}>Eliminated players can earn their way back in</p>
              </>
            )}
          </div>
        </div>
      )}

      {gameState.phase === 'elimination-reveal' && gameState.roundResult && (() => {
        const newlyEliminated = isDisqualified && isEliminated;
        const watchingEliminated = !isDisqualified && isEliminated;
        return (
          <div className="relative flex-1 flex flex-col items-center justify-center gap-4 min-h-[60vh] w-full overflow-hidden">
            {/* Pulsing red vignette for the newly eliminated player */}
            {newlyEliminated && (
              <div
                className="pointer-events-none absolute inset-0 animate-elim-vignette"
                style={{ background: 'radial-gradient(ellipse at center, transparent 10%, rgba(255,23,68,0.35) 100%)' }}
              />
            )}

            <div className="relative z-10 flex flex-col items-center gap-4 w-full">
              {/* YOU'RE OUT banner */}
              {newlyEliminated && (
                <div className="w-full text-center pt-2 pb-1">
                  <p
                    className="glitch-text font-bold"
                    data-text="YOU'RE OUT"
                    style={{
                      fontFamily: 'var(--font-orbitron), sans-serif',
                      fontSize: 'clamp(2rem, 8vw, 3rem)',
                      color: '#ff1744',
                      textShadow: '0 0 24px rgba(255,23,68,0.9), 0 0 48px rgba(255,23,68,0.5)',
                      letterSpacing: '0.1em',
                    }}
                  >
                    YOU&apos;RE OUT
                  </p>
                </div>
              )}

              {/* Song reveal */}
              <div
                className="w-full rounded-2xl px-5 py-5 text-center"
                style={{
                  background: '#12121a',
                  border: newlyEliminated ? '1px solid rgba(255,23,68,0.25)' : '1px solid rgba(0,240,255,0.12)',
                }}
              >
                {gameState.roundResult.albumArtUrl && (
                  <img
                    src={gameState.roundResult.albumArtUrl}
                    alt="Album art"
                    className="w-24 h-24 mx-auto rounded-xl mb-3"
                    style={{ boxShadow: '0 0 20px rgba(0,240,255,0.2)' }}
                  />
                )}
                <p
                  className="text-lg font-bold"
                  style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: '#ffe600', textShadow: '0 0 15px rgba(255,230,0,0.5)' }}
                >
                  {gameState.roundResult.songTitle}
                </p>
                <p className="text-sm mt-1" style={{ color: '#8888aa' }}>by {gameState.roundResult.songArtist}</p>
              </div>

              {/* Watching eliminated */}
              {watchingEliminated && (
                <div
                  className="w-full rounded-2xl px-5 py-4 text-center"
                  style={{ background: 'rgba(255,23,68,0.04)', border: '1px solid rgba(255,23,68,0.2)' }}
                >
                  <p className="text-sm" style={{ color: '#8888aa' }}>Still eliminated — watching the round.</p>
                </div>
              )}

              {/* Safe player's answer result */}
              {answerResult && !isEliminated && (
                <div
                  className="w-full rounded-2xl px-5 py-4 text-center"
                  style={{
                    background: answerResult.correct ? 'rgba(57,255,20,0.06)' : 'rgba(255,23,68,0.06)',
                    border: answerResult.correct ? '1px solid rgba(57,255,20,0.3)' : '1px solid rgba(255,23,68,0.3)',
                  }}
                >
                  {answerResult.correct ? (
                    <p className="text-lg font-bold" style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: '#39ff14', textShadow: '0 0 15px rgba(57,255,20,0.5)' }}>
                      +{answerResult.pointsAwarded} point{answerResult.pointsAwarded !== 1 ? 's' : ''}!
                    </p>
                  ) : (
                    <p className="text-lg font-bold" style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: '#ff1744' }}>
                      Better luck next time
                    </p>
                  )}
                </div>
              )}

              {/* Drinking prompt */}
              {gameState.drinkingPrompt && (
                <div
                  className="w-full rounded-2xl px-5 py-4 text-center"
                  style={{ background: 'rgba(255,0,229,0.06)', border: '1px solid rgba(255,0,229,0.35)' }}
                >
                  <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#ff00e5', opacity: 0.7, fontFamily: 'var(--font-orbitron), sans-serif' }}>Drink up</p>
                  <p className="font-bold" style={{ color: '#ff00e5', textShadow: '0 0 12px rgba(255,0,229,0.4)' }}>
                    {gameState.drinkingPrompt}
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {gameState.phase === 'reveal' && gameState.roundResult && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 min-h-[60vh] w-full">
          {/* Lyric snippet reminder (Name That Lyric mode) */}
          {gameState.gameMode === 'name-that-lyric' && gameState.currentLyric && (
            <div
              className="w-full rounded-r-2xl px-5 py-3"
              style={{ background: 'rgba(0,240,255,0.03)', borderLeft: '3px solid #00f0ff' }}
            >
              {gameState.currentLyric.split('\n').map((line, i) => (
                <p key={i} className="italic text-sm leading-relaxed" style={{ color: '#8888aa', fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
                  {line}
                </p>
              ))}
            </div>
          )}
          <div
            className="w-full rounded-2xl px-6 py-6 text-center"
            style={{ background: '#12121a', border: '1px solid rgba(0,240,255,0.12)' }}
          >
            {gameState.roundResult.albumArtUrl && (
              <img
                src={gameState.roundResult.albumArtUrl}
                alt="Album art"
                className="w-28 h-28 mx-auto rounded-xl mb-4"
                style={{ boxShadow: '0 0 20px rgba(0,240,255,0.2)' }}
              />
            )}
            <p
              className="text-xl font-bold"
              style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: '#ffe600', textShadow: '0 0 15px rgba(255,230,0,0.5)' }}
            >
              {gameState.roundResult.songTitle}
            </p>
            <p className="text-sm mt-1" style={{ color: '#8888aa' }}>by {gameState.roundResult.songArtist}</p>
          </div>
          {answerResult && (
            <div
              className="w-full rounded-2xl px-6 py-4 text-center"
              style={{
                background: answerResult.correct ? 'rgba(57,255,20,0.06)' : 'rgba(255,23,68,0.06)',
                border: answerResult.correct ? '1px solid rgba(57,255,20,0.3)' : '1px solid rgba(255,23,68,0.3)',
              }}
            >
              {answerResult.correct ? (
                <p
                  className="text-lg font-bold"
                  style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: '#39ff14', textShadow: '0 0 15px rgba(57,255,20,0.5)' }}
                >
                  +{answerResult.pointsAwarded} point{answerResult.pointsAwarded !== 1 ? 's' : ''}!
                </p>
              ) : (
                <p
                  className="text-lg font-bold"
                  style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: '#ff1744' }}
                >
                  Better luck next time
                </p>
              )}
            </div>
          )}
          {gameState.drinkingPrompt && (
            <div
              className="w-full rounded-2xl px-5 py-4 text-center"
              style={{ background: 'rgba(255,0,229,0.06)', border: '1px solid rgba(255,0,229,0.35)' }}
            >
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#ff00e5', opacity: 0.7, fontFamily: 'var(--font-orbitron), sans-serif' }}>Drink up</p>
              <p className="font-bold" style={{ color: '#ff00e5', textShadow: '0 0 12px rgba(255,0,229,0.4)' }}>
                {gameState.drinkingPrompt}
              </p>
            </div>
          )}
        </div>
      )}

      {gameState.phase === 'scoreboard' && (
        <div className="flex-1 w-full flex flex-col gap-4 py-4">
          {/* Title */}
          <div className="flex items-center justify-center gap-2">
            <Trophy className="w-5 h-5" style={{ color: '#ffe600', filter: 'drop-shadow(0 0 8px rgba(255,230,0,0.8))' }} />
            <span style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: '#ffe600', fontSize: '0.875rem', letterSpacing: '0.2em' }}>
              LEADERBOARD
            </span>
          </div>

          {gameState.teamMode && gameState.teamScores ? (
            <div className="space-y-2">
              {gameState.teamScores.map((ts, index) => {
                const teamHex = ({ cyan: '#00f0ff', magenta: '#ff00e5', yellow: '#ffe600', green: '#39ff14' } as Record<string, string>)[ts.teamColor] ?? '#00f0ff';
                const isMyTeam = myTeam?.id === ts.teamId;
                return (
                  <div
                    key={ts.teamId}
                    className="rounded-xl px-4 py-3"
                    style={{
                      background: '#12121a',
                      border: isMyTeam ? `1px solid ${teamHex}55` : '1px solid rgba(0,240,255,0.08)',
                      boxShadow: isMyTeam ? `0 0 12px ${teamHex}22` : 'none',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: index === 0 ? '#ffe600' : '#8888aa', fontSize: '0.7rem' }}>
                          #{index + 1}
                        </span>
                        <span style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: teamHex, fontSize: '0.875rem', fontWeight: 700 }}>
                          {isMyTeam ? '★ ' : ''}Team {ts.teamName}
                        </span>
                      </div>
                      <span style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: teamHex, fontWeight: 700, fontSize: '1.1rem' }}>
                        {ts.totalScore}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {[...gameState.scores].sort((a, b) => b.score - a.score).map((ps, index) => {
                const isMe = ps.playerId === myId;
                const isFirst = index === 0 && ps.score > 0;
                return (
                  <div
                    key={ps.playerId}
                    className="rounded-xl px-4 py-3"
                    style={{
                      background: isFirst ? 'linear-gradient(135deg, rgba(255,230,0,0.08) 0%, rgba(255,230,0,0.03) 100%)' : '#12121a',
                      border: isMe
                        ? '1px solid rgba(0,240,255,0.4)'
                        : isFirst
                        ? '1px solid rgba(255,230,0,0.4)'
                        : '1px solid rgba(0,240,255,0.08)',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: isFirst ? '#ffe600' : '#8888aa', fontSize: '0.7rem', minWidth: '1.25rem' }}>
                        #{index + 1}
                      </span>
                      <span
                        style={{
                          flex: 1,
                          color: isMe ? '#00f0ff' : isFirst ? '#ffe600' : '#e0e0ff',
                          fontWeight: isMe || isFirst ? 700 : 400,
                          fontSize: '0.9rem',
                        }}
                      >
                        {ps.displayName}{isMe ? ' (you)' : ''}
                      </span>
                      <span style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: isFirst ? '#ffe600' : '#00f0ff', fontWeight: 700 }}>
                        {ps.score}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {gameState.quietCallout && (
            <div
              className="w-full rounded-2xl px-5 py-4 text-center"
              style={{ background: 'rgba(255,230,0,0.05)', border: '1px solid rgba(255,230,0,0.3)' }}
            >
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#ffe600', opacity: 0.6, fontFamily: 'var(--font-orbitron), sans-serif' }}>Calling out</p>
              <p className="font-bold text-sm" style={{ color: '#ffe600', textShadow: '0 0 10px rgba(255,230,0,0.4)' }}>
                {gameState.quietCallout}
              </p>
            </div>
          )}

          <p className="text-center text-xs" style={{ color: '#8888aa' }}>
            Next round in {gameState.timeRemaining}s...
          </p>
        </div>
      )}

      {gameState.phase === 'game-over' && (
        <div
          className="w-full flex flex-col items-center justify-center gap-6"
          style={{ minHeight: '100svh', paddingTop: '2rem', paddingBottom: '2rem' }}
        >
          {/* Game over header */}
          <div className="text-center">
            <p
              className="text-xs uppercase tracking-[0.4em] mb-4"
              style={{ color: '#8888aa', fontFamily: 'var(--font-orbitron), sans-serif' }}
            >
              Game Over
            </p>
            {gameState.teamMode && gameState.teamScores && gameState.teamScores.length > 0 ? (
              (() => {
                const winningTeam = gameState.teamScores[0];
                const isMyTeam = myTeam?.id === winningTeam.teamId;
                const teamColor = ({ cyan: '#00f0ff', magenta: '#ff00e5', yellow: '#ffe600', green: '#39ff14' } as Record<string, string>)[winningTeam.teamColor] ?? '#ffe600';
                return (
                  <div className="flex flex-col items-center gap-3">
                    {isMyTeam && (
                      <Trophy
                        className="w-12 h-12 animate-bounce"
                        style={{ color: teamColor, filter: `drop-shadow(0 0 12px ${teamColor})` }}
                      />
                    )}
                    <p
                      className="text-2xl font-bold"
                      style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: teamColor, textShadow: `0 0 20px ${teamColor}88` }}
                    >
                      {isMyTeam ? 'YOUR TEAM WINS!' : `Team ${winningTeam.teamName} wins!`}
                    </p>
                  </div>
                );
              })()
            ) : (
              (() => {
                const sorted = [...gameState.scores].sort((a, b) => b.score - a.score);
                const topScore = sorted[0];
                if (!topScore) return null;
                const winners = sorted.filter((s) => s.score === topScore.score && topScore.score > 0);
                const isTied = winners.length > 1;
                const isMe = winners.some((w) => w.playerId === myId);
                return (
                  <div className="flex flex-col items-center gap-3">
                    {isMe && (
                      <Trophy className="w-12 h-12 animate-bounce" style={{ color: '#ffe600', filter: 'drop-shadow(0 0 16px rgba(255,230,0,0.9))' }} />
                    )}
                    <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: '#ffe600', textShadow: '0 0 20px rgba(255,230,0,0.6)' }}>
                      {isTied
                        ? isMe ? 'IT\'S A TIE — YOU WIN!' : `${winners.map((w) => w.displayName).join(' & ')} tie!`
                        : isMe ? 'YOU WIN!' : `${topScore.displayName} wins!`}
                    </p>
                  </div>
                );
              })()
            )}
          </div>

          {/* Your score */}
          {myScore && (
            <div
              className="w-full rounded-2xl px-6 py-5 text-center"
              style={{
                background: '#12121a',
                border: '1px solid rgba(0,240,255,0.15)',
                boxShadow: '0 0 20px rgba(0,240,255,0.08)',
              }}
            >
              <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#8888aa', fontFamily: 'var(--font-orbitron), sans-serif' }}>
                Your Score
              </p>
              <p
                className="text-5xl font-bold"
                style={{
                  fontFamily: 'var(--font-jetbrains-mono), monospace',
                  color: '#00f0ff',
                  textShadow: '0 0 20px rgba(0,240,255,0.6)',
                }}
              >
                {myScore.score}
              </p>
              <p className="text-sm mt-2" style={{ color: '#8888aa' }}>
                {myScore.correctAnswers}/{gameState.totalRounds} correct
              </p>
              {myTeam && (
                <div
                  className="inline-block mt-3 px-4 py-1 rounded-full text-xs font-bold"
                  style={{
                    color: { cyan: '#00f0ff', magenta: '#ff00e5', yellow: '#ffe600', green: '#39ff14' }[myTeam.color] ?? '#00f0ff',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    fontFamily: 'var(--font-orbitron), sans-serif',
                  }}
                >
                  Team {myTeam.name}
                </div>
              )}
            </div>
          )}

          {/* Tiebreaker vote outcome */}
          {gameState.tiebreakerVotes && myTiebreakerVote && (() => {
            const winnerId = gameState.scores[0]?.playerId; // scores sorted by score desc
            const votedCorrectly = myTiebreakerVote === winnerId;
            const votedName = gameState.scores.find((s) => s.playerId === myTiebreakerVote)?.displayName;
            return (
              <div
                className="w-full rounded-2xl px-5 py-4 text-center"
                style={{
                  background: votedCorrectly ? 'rgba(57,255,20,0.06)' : 'rgba(255,23,68,0.06)',
                  border: votedCorrectly ? '1px solid rgba(57,255,20,0.3)' : '1px solid rgba(255,23,68,0.3)',
                }}
              >
                <p className="text-xs uppercase tracking-widest mb-1" style={{ color: votedCorrectly ? '#39ff14' : '#ff1744', opacity: 0.7, fontFamily: 'var(--font-orbitron), sans-serif' }}>
                  Your vote
                </p>
                <p className="font-bold" style={{ color: votedCorrectly ? '#39ff14' : '#ff1744', fontFamily: 'var(--font-orbitron), sans-serif' }}>
                  {votedCorrectly ? `You backed ${votedName} — correct!` : `You backed ${votedName} — wrong call!`}
                </p>
                {gameState.scores[0] && (
                  <p className="text-sm mt-1" style={{ color: '#8888aa' }}>
                    {votedCorrectly
                      ? '🍹 Give out 2 drinks!'
                      : `${gameState.scores[0].displayName} won. Drink 2.`}
                  </p>
                )}
              </div>
            );
          })()}

          <p className="text-sm" style={{ color: '#8888aa' }}>
            Waiting for host to continue...
          </p>

          <button
            onClick={() => { window.location.href = '/'; }}
            className="w-full py-4 rounded-2xl font-bold text-sm transition-all cursor-pointer hover:opacity-80"
            style={{
              fontFamily: 'var(--font-orbitron), sans-serif',
              background: 'transparent',
              border: '1px solid rgba(255,0,229,0.4)',
              color: '#ff00e5',
            }}
          >
            LEAVE GAME
          </button>
        </div>
      )}
    </div>
  );
}
