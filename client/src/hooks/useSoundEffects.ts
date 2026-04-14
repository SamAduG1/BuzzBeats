'use client';

import { useRef, useEffect, useCallback } from 'react';

/**
 * useSoundEffects
 *
 * Centralised Web Audio API sound engine. One AudioContext shared across all
 * sounds — creating multiple contexts can cause browser limits to kick in.
 *
 * All synthesis is done inline (oscillators + gain nodes), zero audio files.
 */
export function useSoundEffects() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback((): AudioContext | null => {
    if (typeof window === 'undefined') return null;
    try {
      if (!ctxRef.current) {
        ctxRef.current = new AudioContext();
      }
      return ctxRef.current;
    } catch {
      return null;
    }
  }, []);

  // Pre-warm on mount so context is running before the first interaction
  useEffect(() => {
    const ctx = getCtx();
    if (ctx) ctx.resume().catch(() => {});

    return () => {
      if (ctxRef.current) {
        ctxRef.current.close();
        ctxRef.current = null;
      }
    };
  }, [getCtx]);

  // -------------------------------------------------------------------------
  // Low-level helpers
  // -------------------------------------------------------------------------

  const ensureRunning = useCallback(async (): Promise<AudioContext | null> => {
    const ctx = getCtx();
    if (!ctx) return null;
    if (ctx.state !== 'running') {
      try { await ctx.resume(); } catch { return null; }
    }
    return ctx;
  }, [getCtx]);

  /** Play a single oscillator note with an ADSR-style envelope */
  const playNote = useCallback(async (
    freq: number,
    duration: number,
    opts: {
      type?: OscillatorType;
      gain?: number;
      attack?: number;
      decay?: number;
      startAt?: number;  // seconds from ctx.currentTime
    } = {}
  ) => {
    const ctx = await ensureRunning();
    if (!ctx) return;

    const {
      type = 'sine',
      gain = 0.3,
      attack = 0.01,
      decay = duration,
      startAt = 0,
    } = opts;

    const t = ctx.currentTime + startAt;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);

    gainNode.gain.setValueAtTime(0, t);
    gainNode.gain.linearRampToValueAtTime(gain, t + attack);
    gainNode.gain.exponentialRampToValueAtTime(0.001, t + decay);

    osc.start(t);
    osc.stop(t + duration + 0.05);
  }, [ensureRunning]);

  // -------------------------------------------------------------------------
  // Buzzer press — classic game show electric buzz
  // Three layered square-wave oscillators at 150Hz, 155Hz, 225Hz detuned
  // slightly apart to create the beating/electric character of a game show
  // buzzer. Held for ~0.45s with a hard cutoff, no gradual fade.
  // -------------------------------------------------------------------------
  const playBuzzer = useCallback(async () => {
    const ctx = await ensureRunning();
    if (!ctx) return;

    const t = ctx.currentTime;
    const duration = 0.45;

    const freqs = [150, 155, 225];
    const gains = [0.28, 0.18, 0.12];

    const master = ctx.createGain();
    master.connect(ctx.destination);
    master.gain.setValueAtTime(1, t);
    // Very short attack then flat hold — game show buzzers cut in hard
    master.gain.setValueAtTime(0, t);
    master.gain.linearRampToValueAtTime(1, t + 0.008);
    master.gain.setValueAtTime(1, t + duration - 0.02);
    master.gain.linearRampToValueAtTime(0, t + duration);

    for (let i = 0; i < freqs.length; i++) {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(master);
      osc.type = 'square';
      osc.frequency.setValueAtTime(freqs[i], t);
      gainNode.gain.setValueAtTime(gains[i], t);
      osc.start(t);
      osc.stop(t + duration + 0.05);
    }
  }, [ensureRunning]);

  // -------------------------------------------------------------------------
  // Correct answer — bright ascending 3-note chime (louder)
  // -------------------------------------------------------------------------
  const playCorrect = useCallback(async () => {
    // C5 → E5 → G5 (major triad arpeggio)
    const notes = [523, 659, 784];
    for (let i = 0; i < notes.length; i++) {
      await playNote(notes[i], 0.4, {
        type: 'sine',
        gain: 0.55,
        attack: 0.01,
        decay: 0.35,
        startAt: i * 0.1,
      });
    }
  }, [playNote]);

  // -------------------------------------------------------------------------
  // Wrong answer — low descending two-tone thud
  // -------------------------------------------------------------------------
  const playWrong = useCallback(async () => {
    await playNote(220, 0.18, { type: 'square', gain: 0.25, attack: 0.005, decay: 0.15 });
    await playNote(180, 0.22, { type: 'square', gain: 0.2, attack: 0.005, decay: 0.2, startAt: 0.12 });
  }, [playNote]);

  // -------------------------------------------------------------------------
  // Tick — sharp grandfather-clock style tick
  // High sharp transient (like a clock escapement), no tock — just the
  // crisp mechanical click on each second.
  // -------------------------------------------------------------------------
  const playTick = useCallback(async () => {
    const ctx = await ensureRunning();
    if (!ctx) return;

    const t = ctx.currentTime;

    // Sharp high click — very fast attack, very fast decay
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    // Biquad filter to shape it into a sharper "click"
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800, t);
    filter.Q.setValueAtTime(4, t);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.type = 'square';
    osc.frequency.setValueAtTime(1800, t);
    gainNode.gain.setValueAtTime(0, t);
    gainNode.gain.linearRampToValueAtTime(0.7, t + 0.002); // instant snap
    gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.025); // very fast decay
    osc.start(t);
    osc.stop(t + 0.03);
  }, [ensureRunning]);

  // -------------------------------------------------------------------------
  // Game over / winner fanfare — short celebratory 5-note motif
  // -------------------------------------------------------------------------
  const playFanfare = useCallback(async () => {
    // G4 → C5 → E5 → G5 → C6
    const notes = [392, 523, 659, 784, 1047];
    const timings = [0, 0.12, 0.24, 0.36, 0.52];
    const gains =   [0.3, 0.3,  0.3,  0.35, 0.4];

    for (let i = 0; i < notes.length; i++) {
      await playNote(notes[i], 0.45, {
        type: 'sine',
        gain: gains[i],
        attack: 0.01,
        decay: 0.4,
        startAt: timings[i],
      });
    }
  }, [playNote]);

  // -------------------------------------------------------------------------
  // Sudden death stinger — distorted power chord riff
  // Sawtooth oscillators through a WaveShaper (overdrive) for electric guitar
  // crunch. Pattern: DUN... DUN... dun-dun-DUUNNNN
  // -------------------------------------------------------------------------
  const playTiebreakerStinger = useCallback(async () => {
    const ctx = await ensureRunning();
    if (!ctx) return;

    const t = ctx.currentTime;

    // Build overdrive curve (soft-clipping distortion)
    const distortion = ctx.createWaveShaper();
    const samples = 512;
    const curve = new Float32Array(samples);
    const amount = 180;
    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1;
      curve[i] = ((Math.PI + amount) * x) / (Math.PI + amount * Math.abs(x));
    }
    distortion.curve = curve;
    distortion.oversample = '4x';

    const master = ctx.createGain();
    master.connect(ctx.destination);
    master.gain.setValueAtTime(0.45, t);
    distortion.connect(master);

    // Power chord: root + fifth + octave through distortion
    const hit = (root: number, startT: number, dur: number, vol: number) => {
      for (const ratio of [1, 1.5, 2]) {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.connect(g);
        g.connect(distortion);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(root * ratio, startT);
        g.gain.setValueAtTime(0, startT);
        g.gain.linearRampToValueAtTime(vol, startT + 0.008);
        g.gain.exponentialRampToValueAtTime(0.001, startT + dur);
        osc.start(startT);
        osc.stop(startT + dur + 0.05);
      }
    };

    // DUN ... DUN ... dun-dun-DUUNNNN  then ascending run + final big chord
    // E2 = 82 Hz root
    hit(82,  t,        0.18, 0.38);  // DUN
    hit(82,  t + 0.32, 0.18, 0.42);  // DUN
    hit(82,  t + 0.64, 0.10, 0.44);  // dun
    hit(82,  t + 0.77, 0.10, 0.44);  // dun
    hit(82,  t + 0.90, 0.65, 0.50);  // DUUNNNN (sustained)
    // Ascending run: A2 → B2 → E3 (softer, just a tail)
    hit(110, t + 1.40, 0.12, 0.22);
    hit(123, t + 1.55, 0.12, 0.18);
    hit(165, t + 1.70, 0.20, 0.06);
    // Second phrase — very quiet, just texture
    hit(164, t + 2.10, 0.12, 0.04);
    hit(164, t + 2.25, 0.12, 0.04);
    // Final sustained note — fades exactly to zero as the 6s timer ends
    hit(164, t + 2.40, 3.60, 0.010);
  }, [ensureRunning]);

  // -------------------------------------------------------------------------
  // Sudden death pulse — low throbbing drone that loops during tiebreaker
  // 60Hz sine with an LFO (4Hz) on gain to create a heartbeat-style throb.
  // Returns a stop function; caller must invoke it on phase change.
  // -------------------------------------------------------------------------
  const pulseNodesRef = useRef<{ master: GainNode; osc: OscillatorNode; lfoOsc: OscillatorNode } | null>(null);

  const startTiebreakerPulse = useCallback(async () => {
    const ctx = await ensureRunning();
    if (!ctx) return;

    // Stop any existing pulse first
    if (pulseNodesRef.current) {
      try {
        pulseNodesRef.current.master.gain.setValueAtTime(0, ctx.currentTime);
        pulseNodesRef.current.osc.stop(ctx.currentTime + 0.05);
        pulseNodesRef.current.lfoOsc.stop(ctx.currentTime + 0.05);
      } catch {}
      pulseNodesRef.current = null;
    }

    const t = ctx.currentTime;

    // Main drone oscillator
    const osc = ctx.createOscillator();
    const master = ctx.createGain();
    osc.connect(master);
    master.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(60, t);

    // LFO oscillator modulates master gain (4Hz throb)
    const lfoOsc = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfoOsc.connect(lfoGain);
    lfoGain.connect(master.gain);
    lfoOsc.type = 'sine';
    lfoOsc.frequency.setValueAtTime(4, t);
    lfoGain.gain.setValueAtTime(0.12, t); // throb depth

    // Fade in gently
    master.gain.setValueAtTime(0, t);
    master.gain.linearRampToValueAtTime(0.15, t + 0.5);

    osc.start(t);
    lfoOsc.start(t);

    pulseNodesRef.current = { master, osc, lfoOsc };
  }, [ensureRunning]);

  const stopTiebreakerPulse = useCallback(async () => {
    const ctx = await ensureRunning();
    if (!ctx || !pulseNodesRef.current) return;

    const { master, osc, lfoOsc } = pulseNodesRef.current;
    const t = ctx.currentTime;
    try {
      master.gain.cancelScheduledValues(t);
      master.gain.setValueAtTime(master.gain.value, t);
      master.gain.linearRampToValueAtTime(0, t + 0.3);
      osc.stop(t + 0.35);
      lfoOsc.stop(t + 0.35);
    } catch {}
    pulseNodesRef.current = null;
  }, [ensureRunning]);

  // -------------------------------------------------------------------------
  // Elimination reveal — descending "wah wah wah wahhhh" trombone phrase
  // Sawtooth for brassy texture, four descending notes with portamento
  // -------------------------------------------------------------------------
  const playEliminationReveal = useCallback(async () => {
    const ctx = await ensureRunning();
    if (!ctx) return;

    const t = ctx.currentTime;

    // Four descending pitches: C4 → A3 → F3 → D3
    const pitches = [261, 220, 174, 146];
    const stepDuration = 0.45;

    const master = ctx.createGain();
    master.connect(ctx.destination);
    master.gain.setValueAtTime(0, t);
    master.gain.linearRampToValueAtTime(0.35, t + 0.02);
    // Fade out the last note
    master.gain.setValueAtTime(0.35, t + pitches.length * stepDuration - 0.15);
    master.gain.linearRampToValueAtTime(0, t + pitches.length * stepDuration + 0.2);

    for (let i = 0; i < pitches.length; i++) {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(master);
      osc.type = 'sawtooth';

      const noteStart = t + i * stepDuration;
      osc.frequency.setValueAtTime(pitches[i], noteStart);
      // Slight downward glide on each note for that trombone droop
      osc.frequency.linearRampToValueAtTime(pitches[i] * 0.93, noteStart + stepDuration - 0.05);

      gainNode.gain.setValueAtTime(0.5, noteStart);
      gainNode.gain.setValueAtTime(0.5, noteStart + stepDuration - 0.08);
      gainNode.gain.linearRampToValueAtTime(0, noteStart + stepDuration);

      osc.start(noteStart);
      osc.stop(noteStart + stepDuration + 0.05);
    }
  }, [ensureRunning]);

  // -------------------------------------------------------------------------
  // Last chance sting — two-note urgent rising phrase (tense but hopeful)
  // -------------------------------------------------------------------------
  const playLastChanceStinger = useCallback(async () => {
    // G4 → C5, short and punchy
    await playNote(392, 0.2, { type: 'square', gain: 0.25, attack: 0.005, decay: 0.18 });
    await playNote(523, 0.35, { type: 'square', gain: 0.28, attack: 0.005, decay: 0.3, startAt: 0.15 });
  }, [playNote]);

  return {
    playBuzzer,
    playCorrect,
    playWrong,
    playTick,
    playFanfare,
    playTiebreakerStinger,
    startTiebreakerPulse,
    stopTiebreakerPulse,
    playEliminationReveal,
    playLastChanceStinger,
  };
}
