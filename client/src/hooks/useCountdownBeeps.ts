'use client';

import { useEffect, useRef } from 'react';

/**
 * Plays synthesized countdown beep sounds during the pre-round phase.
 * Uses Web Audio API — no external dependencies, no audio files needed.
 *
 * Beep schedule: at timeRemaining 3, 2, 1 → short tick
 */
export default function useCountdownBeeps(phase: string | undefined, timeRemaining: number | undefined) {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = () => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    return ctxRef.current;
  };

  // Pre-warm the AudioContext on mount so it's ready before the first beep.
  // Browsers start AudioContext in 'suspended' state; resume() is async, so
  // calling it here (after a prior user gesture has already occurred) gives it
  // time to transition to 'running' before the pre-round countdown fires.
  useEffect(() => {
    try {
      const ctx = getCtx();
      ctx.resume().catch(() => {});
    } catch {
      // SSR / unavailable
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const playBeep = async (freq: number, durationSec: number, gain = 0.35) => {
    try {
      const ctx = getCtx();
      // Ensure context is running before scheduling audio
      if (ctx.state !== 'running') {
        await ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Quick attack, sharp decay
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(gain, ctx.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSec);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + durationSec);
    } catch {
      // AudioContext not available (SSR or blocked)
    }
  };

  useEffect(() => {
    if (phase !== 'pre-round' || timeRemaining === undefined) return;

    if (timeRemaining === 3 || timeRemaining === 2) {
      playBeep(440, 0.12).catch(() => {});
    } else if (timeRemaining === 1) {
      playBeep(550, 0.15).catch(() => {});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, timeRemaining]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (ctxRef.current) {
        ctxRef.current.close();
        ctxRef.current = null;
      }
    };
  }, []);
}
