'use client';

import { useRef, useCallback, useEffect } from 'react';

interface AudioPlayer {
  play: (url: string) => Promise<void>;
  pause: () => void;
  resume: () => Promise<void>;
  fadeOut: (durationMs?: number) => void;
  stop: () => void;
}

export default function useAudioPlayer(): AudioPlayer {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ensureContext = useCallback(async () => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
      gainRef.current = ctxRef.current.createGain();
      gainRef.current.connect(ctxRef.current.destination);
    }
    if (ctxRef.current.state === 'suspended') {
      try { await ctxRef.current.resume(); } catch {}
    }
  }, []);

  // Pre-warm AudioContext on mount so it's unblocked before the first round starts
  useEffect(() => {
    ensureContext().catch(() => {});
  }, [ensureContext]);

  const play = useCallback(async (url: string) => {
    await ensureContext();

    // Clear any pending fade
    if (fadeTimerRef.current) {
      clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }

    // Reset gain to full volume
    if (gainRef.current && ctxRef.current) {
      gainRef.current.gain.cancelScheduledValues(ctxRef.current.currentTime);
      gainRef.current.gain.setValueAtTime(1, ctxRef.current.currentTime);
    }

    // Create or reuse audio element
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.crossOrigin = 'anonymous';
      // Connect to Web Audio graph
      if (ctxRef.current && gainRef.current) {
        sourceRef.current = ctxRef.current.createMediaElementSource(audioRef.current);
        sourceRef.current.connect(gainRef.current);
      }
    }

    audioRef.current.src = url;
    audioRef.current.play().catch((e) => {
      console.warn('[Audio] Autoplay blocked:', e);
    });
  }, [ensureContext]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const resume = useCallback(async () => {
    await ensureContext();
    // Reset gain to full before resuming
    if (gainRef.current && ctxRef.current) {
      gainRef.current.gain.cancelScheduledValues(ctxRef.current.currentTime);
      gainRef.current.gain.setValueAtTime(1, ctxRef.current.currentTime);
    }
    if (audioRef.current) {
      audioRef.current.play().catch((e) => {
        console.warn('[Audio] Resume blocked:', e);
      });
    }
  }, [ensureContext]);

  const fadeOut = useCallback((durationMs = 2000) => {
    if (!gainRef.current || !ctxRef.current) {
      // No Web Audio context — just stop
      if (audioRef.current) audioRef.current.pause();
      return;
    }

    const now = ctxRef.current.currentTime;
    gainRef.current.gain.cancelScheduledValues(now);
    gainRef.current.gain.setValueAtTime(gainRef.current.gain.value, now);
    gainRef.current.gain.linearRampToValueAtTime(0, now + durationMs / 1000);

    // Pause the element after fade completes
    fadeTimerRef.current = setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }, durationMs);
  }, []);

  const stop = useCallback(() => {
    if (fadeTimerRef.current) {
      clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    // Reset gain
    if (gainRef.current && ctxRef.current) {
      gainRef.current.gain.cancelScheduledValues(ctxRef.current.currentTime);
      gainRef.current.gain.setValueAtTime(1, ctxRef.current.currentTime);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (ctxRef.current) {
        ctxRef.current.close();
        ctxRef.current = null;
      }
    };
  }, []);

  return { play, pause, resume, fadeOut, stop };
}
