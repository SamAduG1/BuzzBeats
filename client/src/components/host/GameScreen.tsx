'use client';

import { useEffect, useRef } from 'react';
import { useRoom } from '@/context/RoomContext';
import useAudioPlayer from '@/hooks/useAudioPlayer';
import useCountdownBeeps from '@/hooks/useCountdownBeeps';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import RulesDisplay from './RulesDisplay';
import PreRoundDisplay from './PreRoundDisplay';
import PlayingDisplay from './PlayingDisplay';
import RevealDisplay from './RevealDisplay';
import ScoreboardDisplay from './ScoreboardDisplay';
import GameOverDisplay from './GameOverDisplay';
import EliminationOverlay from './EliminationOverlay';
import TiebreakerDisplay from './TiebreakerDisplay';
import TieVoteDisplay from './TieVoteDisplay';

export default function HostGameScreen() {
  const { gameState, songUrl } = useRoom();
  const audio = useAudioPlayer();
  useCountdownBeeps(gameState?.phase, gameState?.timeRemaining);
  const {
    playCorrect,
    playWrong,
    playTick,
    playFanfare,
    playEliminationReveal,
    playLastChanceStinger,
    startNTLAmbience,
    stopNTLAmbience,
  } = useSoundEffects();
  const prevPhaseRef = useRef<string | null>(null);
  const prevSongUrlRef = useRef<string | null>(null);
  const prevTimeRef = useRef<number | null>(null);
  const clipFadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Audio management across phase transitions
  useEffect(() => {
    if (!gameState) return;
    const phase = gameState.phase;
    const prevPhase = prevPhaseRef.current;
    prevPhaseRef.current = phase;

    // Clear any pending clip fade timer on phase change
    if (clipFadeTimerRef.current) {
      clearTimeout(clipFadeTimerRef.current);
      clipFadeTimerRef.current = null;
    }

    if (phase === 'playing' && prevPhase === 'buzzing') {
      // Wrong answer — resume from where it was paused
      audio.resume();
    } else if (phase === 'playing' && prevPhase !== 'playing') {
      // New round starting — play from beginning
      if (songUrl) audio.play(songUrl);

      // NTL has no audio preview — use NTL ambience as background
      if (gameState.gameMode === 'name-that-lyric') {
        startNTLAmbience().catch(() => {});
      }

      // Snippet mode: fade audio during last 2 seconds of the clip
      if (gameState.gameMode === 'snippet' && gameState.clipDuration) {
        const fadeStart = Math.max(0, gameState.clipDuration - 2) * 1000;
        clipFadeTimerRef.current = setTimeout(() => {
          audio.fadeOut(2000);
        }, fadeStart);
      }
    } else if (phase === 'playing' && prevPhase === 'playing' && songUrl && songUrl !== prevSongUrlRef.current) {
      // Song skipped — phase didn't change but URL did, restart audio
      audio.stop();
      audio.play(songUrl);
    } else if (phase === 'buzzing' && prevPhase === 'playing') {
      // Someone buzzed — pause (preserve position for resume)
      audio.pause();
    } else if (phase === 'reveal' || phase === 'scoreboard' || phase === 'pre-round') {
      // Stop NTL ambience when leaving the playing phase
      stopNTLAmbience().catch(() => {});
    }

    prevSongUrlRef.current = songUrl;

    if (phase === 'reveal') {
      if (gameState.roundResult?.winnerId) {
        // Correct answer — resume first, then fade (resume resets gain, must complete before scheduling ramp)
        audio.resume().then(() => audio.fadeOut(4000)).catch(() => {});
        playCorrect().catch(() => {});
      } else {
        // No winner — stop cleanly
        audio.stop();
        playWrong().catch(() => {});
      }
    } else if (phase === 'game-over') {
      playFanfare().catch(() => {});
    } else if (phase === 'sub-round-transition') {
      // Snippet: stop audio between sub-rounds
      audio.stop();
    } else if (phase === 'elimination-reveal') {
      audio.stop();
      // Only play the trombone when someone is actually being eliminated this round
      if (gameState.disqualifiedIds && gameState.disqualifiedIds.length > 0) {
        playEliminationReveal().catch(() => {});
      }
    } else if (phase === 'last-chance') {
      audio.stop();
      playLastChanceStinger().catch(() => {});
    } else if (phase === 'rules' || phase === 'pre-round' || phase === 'scoreboard') {
      // Ensure audio is stopped for non-playing phases
      audio.stop();
    }
  }, [gameState?.phase, songUrl]);

  // Ticking during final 5 seconds of playing and buzzing phases
  useEffect(() => {
    if (!gameState) return;
    const { phase, timeRemaining } = gameState;
    if (phase !== 'playing' && phase !== 'buzzing') return;
    // Only fire once per second change (avoid double-firing on re-renders)
    if (timeRemaining === prevTimeRef.current) return;
    prevTimeRef.current = timeRemaining;
    if (timeRemaining > 0 && timeRemaining <= 5) {
      playTick().catch(() => {});
    }
  }, [gameState?.timeRemaining, gameState?.phase, playTick]);

  if (!gameState) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-3 h-3 bg-neon-cyan rounded-full animate-pulse-dot mx-auto mb-4" />
          <p className="text-text-secondary text-lg">Loading game...</p>
        </div>
      </div>
    );
  }

  switch (gameState.phase) {
    case 'rules':
      return <RulesDisplay gameState={gameState} />;
    case 'pre-round':
      return <PreRoundDisplay gameState={gameState} />;
    case 'playing':
    case 'buzzing':
      return <PlayingDisplay gameState={gameState} songUrl={songUrl} />;
    case 'sub-round-transition':
      return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 w-full">
          <p
            className="text-xs uppercase tracking-[0.4em]"
            style={{ color: '#8888aa', fontFamily: 'var(--font-orbitron), sans-serif' }}
          >
            Snippet {gameState.subRound ?? 1} of {gameState.totalSubRounds ?? 4}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-orbitron), sans-serif',
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              color: '#39ff14',
              textShadow: '0 0 30px rgba(57,255,20,0.7), 0 0 60px rgba(57,255,20,0.3)',
            }}
          >
            Longer clip coming...
          </p>
        </div>
      );
    case 'tie-vote':
      return <TieVoteDisplay gameState={gameState} />;
    case 'tiebreaker':
      return <TiebreakerDisplay gameState={gameState} />;
    case 'elimination-reveal':
    case 'last-chance':
      return <EliminationOverlay gameState={gameState} />;
    case 'reveal':
      return <RevealDisplay gameState={gameState} />;
    case 'scoreboard':
      return <ScoreboardDisplay gameState={gameState} />;
    case 'game-over':
      return <GameOverDisplay gameState={gameState} />;
    default:
      return null;
  }
}
