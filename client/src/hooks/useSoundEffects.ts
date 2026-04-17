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
  // Sudden death stinger — cinematic cyberpunk announcement (one-shot, ~6s)
  //
  // No chiptune melody. Three discrete impact moments with detuned sawtooth
  // sirens in between — feels like a warning alarm / boss encounter cutscene.
  //
  //   t=0.00  Impact 1: kick + crash + detuned sawtooth chord stab
  //   t=0.05  Descending siren: detuned sawtooth glides E5→E4, resonant filter
  //   t=0.85  Impact 2: kick
  //   t=0.95  Ascending sweep: E3→E5 glide, filter opens (tension build)
  //   t=1.55  Impact 3: kick + crash + chord stab
  //   t=1.90  Final detuned chord: 300ms attack, long fade into the pulse
  // -------------------------------------------------------------------------
  const playTiebreakerStinger = useCallback(async () => {
    const ctx = await ensureRunning();
    if (!ctx) return;

    const t = ctx.currentTime;

    // Distortion
    const distortion = ctx.createWaveShaper();
    const samples = 512;
    const distCurve = new Float32Array(samples);
    const amount = 200;
    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1;
      distCurve[i] = ((Math.PI + amount) * x) / (Math.PI + amount * Math.abs(x));
    }
    distortion.curve = distCurve;
    distortion.oversample = '4x';

    const master = ctx.createGain();
    master.connect(ctx.destination);
    master.gain.setValueAtTime(0.52, t);
    distortion.connect(master);

    // Crash noise buffer
    const crashSize = Math.floor(ctx.sampleRate * 0.50);
    const crashBuf  = ctx.createBuffer(1, crashSize, ctx.sampleRate);
    const cd = crashBuf.getChannelData(0);
    for (let i = 0; i < crashSize; i++) cd[i] = Math.random() * 2 - 1;

    // Detuning: ±7 cents — the unison width that defines the cyberpunk synth sound
    const DR = Math.pow(2, 7 / 1200); // detune ratio

    const kick = (startT: number, vol = 0.92) => {
      const osc = ctx.createOscillator();
      const g   = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, startT);
      osc.frequency.exponentialRampToValueAtTime(40, startT + 0.15);
      g.gain.setValueAtTime(vol, startT);
      g.gain.exponentialRampToValueAtTime(0.001, startT + 0.30);
      osc.connect(g); g.connect(master);
      osc.start(startT); osc.stop(startT + 0.32);
    };

    const crash = (startT: number, vol = 0.32) => {
      const src    = ctx.createBufferSource();
      src.buffer   = crashBuf;
      const filter = ctx.createBiquadFilter();
      filter.type  = 'highpass';
      filter.frequency.setValueAtTime(5500, startT);
      const g = ctx.createGain();
      g.gain.setValueAtTime(vol, startT);
      g.gain.exponentialRampToValueAtTime(0.001, startT + 0.45);
      src.connect(filter); filter.connect(g); g.connect(master);
      src.start(startT); src.stop(startT + 0.50);
    };

    // Detuned sawtooth chord stab — sharp attack, two oscs per voice for width
    const stab = (startT: number, root: number, dur: number, vol: number) => {
      for (const ratio of [1, 1.5, 2]) {
        for (const det of [1 / DR, DR]) {
          const osc = ctx.createOscillator();
          const g   = ctx.createGain();
          osc.type  = 'sawtooth';
          osc.frequency.setValueAtTime(root * ratio * det, startT);
          g.gain.setValueAtTime(0, startT);
          g.gain.linearRampToValueAtTime(vol, startT + 0.010);
          g.gain.exponentialRampToValueAtTime(0.001, startT + dur);
          osc.connect(g); g.connect(distortion);
          osc.start(startT); osc.stop(startT + dur + 0.05);
        }
      }
    };

    // Detuned gliding siren — the cyberpunk warning horn
    // Two detuned sawtooth oscs glide from fromFreq to toFreq over dur seconds
    // through a resonant lowpass filter that opens/closes for movement
    const siren = (
      startT: number, fromFreq: number, toFreq: number,
      dur: number, vol: number, filterOpen: number, filterClose: number
    ) => {
      const filter = ctx.createBiquadFilter();
      filter.type  = 'lowpass';
      filter.Q.setValueAtTime(5, startT);
      filter.frequency.setValueAtTime(filterOpen, startT);
      filter.frequency.exponentialRampToValueAtTime(filterClose, startT + dur * 0.75);
      filter.connect(master);
      for (const det of [1 / DR, DR]) {
        const osc = ctx.createOscillator();
        const g   = ctx.createGain();
        osc.type  = 'sawtooth';
        osc.frequency.setValueAtTime(fromFreq * det, startT);
        osc.frequency.exponentialRampToValueAtTime(toFreq * det, startT + dur);
        g.gain.setValueAtTime(0, startT);
        g.gain.linearRampToValueAtTime(vol, startT + 0.06);
        g.gain.setValueAtTime(vol, startT + dur - 0.12);
        g.gain.linearRampToValueAtTime(0, startT + dur);
        osc.connect(g); g.connect(filter);
        osc.start(startT); osc.stop(startT + dur + 0.05);
      }
    };

    // ── Impact 1 ──────────────────────────────────────────────────────────
    kick(t);
    crash(t);
    stab(t, 82.41, 0.42, 0.28);          // E2 power chord

    // ── Descending siren: E5 → E4 ─────────────────────────────────────────
    // Resonant filter closes as it descends — dark, menacing
    siren(t + 0.05, 659.25, 329.63, 0.80, 0.22, 2400, 700);

    // ── Impact 2 ──────────────────────────────────────────────────────────
    kick(t + 0.85, 0.85);

    // ── Ascending sweep: E3 → E5 ──────────────────────────────────────────
    // Filter opens up as it climbs — feels like tension releasing into danger
    siren(t + 0.95, 164.81, 659.25, 0.58, 0.18, 500, 2200);

    // ── Impact 3 ──────────────────────────────────────────────────────────
    kick(t + 1.55, 0.92);
    crash(t + 1.55, 0.26);
    stab(t + 1.55, 82.41, 0.30, 0.24);

    // ── Final detuned chord: 300ms attack, 4s fade ────────────────────────
    // Blends into the pulse underneath; no bite from slow attack
    for (const ratio of [1, 1.5, 2]) {
      for (const det of [1 / DR, DR]) {
        const osc = ctx.createOscillator();
        const g   = ctx.createGain();
        osc.type  = 'sawtooth';
        osc.frequency.setValueAtTime(82.41 * ratio * det, t + 1.90);
        g.gain.setValueAtTime(0, t + 1.90);
        g.gain.linearRampToValueAtTime(0.010, t + 2.20); // 300ms — no bite
        g.gain.exponentialRampToValueAtTime(0.001, t + 6.00);
        osc.connect(g); g.connect(distortion);
        osc.start(t + 1.90);
        osc.stop(t + 6.05);
      }
    }
  }, [ensureRunning]);

  // -------------------------------------------------------------------------
  // Sudden death pulse — boss-battle music loop for the tiebreaker phase.
  //
  // Style: 50/50 cyberpunk / chiptune — 140 BPM (Perturbator pace), E minor.
  //
  // Cyberpunk elements:
  //   - Detuned sawtooth pad (±7 cents unison) through LFO-swept lowpass —
  //     the Perturbator/Carpenter Brut signature width
  //   - Acid bass: sawtooth + Q=10 resonant lowpass, filter sweeps 1800→120Hz
  //     per note (TB-303 "wah" character)
  //   - Industrial kick pattern: syncopated 16ths before beats 2 & 4
  //
  // Chiptune elements:
  //   - Square wave arp through bandpass filter (Q=1.5 @ 1200Hz) — tames the
  //     raw 8-bit edge while keeping the punchy rhythmic character
  //   - 8-note looping bass pattern
  //   - Snare on 2 & 4 with ghost hits
  //
  // Uses the same lookahead scheduler pattern as lobby ambience (25ms interval,
  // 120ms lookahead). Sustained pad oscillators stored in the ref; all drum/
  // bass/arp nodes are fire-and-forget.
  // -------------------------------------------------------------------------
  const pulseNodesRef = useRef<{
    intervalId: ReturnType<typeof setInterval>;
    master: GainNode;
    padOscs: OscillatorNode[];
  } | null>(null);

  const startTiebreakerPulse = useCallback(async () => {
    const ctx = await ensureRunning();
    if (!ctx) return;

    // Stop any existing instance first
    if (pulseNodesRef.current) {
      clearInterval(pulseNodesRef.current.intervalId);
      try {
        pulseNodesRef.current.master.gain.setValueAtTime(0, ctx.currentTime);
        pulseNodesRef.current.padOscs.forEach(o => { try { o.stop(ctx.currentTime + 0.05); } catch {} });
      } catch {}
      pulseNodesRef.current = null;
    }

    const BPM       = 140;
    const BEAT      = 60 / BPM;   // 0.4286s
    const SIXTEENTH = BEAT / 4;   // 0.1071s — scheduling resolution
    const EIGHTH    = BEAT / 2;   // 0.2143s

    // Detuning: ±7 cents — the unison width that defines cyberpunk synths
    const DR = Math.pow(2, 7 / 1200);

    // Master output — fade in over 1.5s so the stinger has room to breathe
    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 1.5);
    master.connect(ctx.destination);

    const t0 = ctx.currentTime;
    const padOscs: OscillatorNode[] = [];

    // ── Detuned sawtooth pad ─────────────────────────────────────────────────
    // Three frequency layers, two oscs each at ±7 cents, through an LFO-
    // modulated lowpass filter. This is the wide, warm cyberpunk texture.
    const padFreqs = [82.41, 123.47, 164.81]; // E2, B2, E3
    const padLfo   = ctx.createOscillator();
    const padLfoGain = ctx.createGain();
    padLfo.type = 'sine';
    padLfo.frequency.setValueAtTime(0.35, t0);  // slow 0.35Hz sweep
    padLfoGain.gain.setValueAtTime(600, t0);     // ±600Hz filter swing
    padLfo.connect(padLfoGain);

    const padFilter = ctx.createBiquadFilter();
    padFilter.type = 'lowpass';
    padFilter.frequency.setValueAtTime(900, t0);
    padFilter.Q.setValueAtTime(1.8, t0);
    padLfoGain.connect(padFilter.frequency);
    padFilter.connect(master);
    padLfo.start(t0);

    padFreqs.forEach((freq, i) => {
      for (const det of [1 / DR, DR]) {
        const osc = ctx.createOscillator();
        const g   = ctx.createGain();
        osc.type  = 'sawtooth';
        osc.frequency.setValueAtTime(freq * det, t0);
        // Fade in progressively — highest layer comes in last
        const vol = i === 0 ? 0.18 : i === 1 ? 0.12 : 0.07;
        g.gain.setValueAtTime(0, t0);
        g.gain.linearRampToValueAtTime(vol, t0 + 1.5 + i * 0.5);
        osc.connect(g); g.connect(padFilter);
        osc.start(t0);
        padOscs.push(osc);
      }
    });
    // Also store lfo osc so it gets stopped with the pad
    padOscs.push(padLfo);

    // Pre-bake noise buffers (reused every hit — no allocation in the loop)
    const snareSize = Math.floor(ctx.sampleRate * 0.09);
    const snareBuf  = ctx.createBuffer(1, snareSize, ctx.sampleRate);
    const sd = snareBuf.getChannelData(0);
    for (let i = 0; i < snareSize; i++) sd[i] = Math.random() * 2 - 1;

    const hatSize = Math.floor(ctx.sampleRate * 0.022);
    const hatBuf  = ctx.createBuffer(1, hatSize, ctx.sampleRate);
    const hd = hatBuf.getChannelData(0);
    for (let i = 0; i < hatSize; i++) hd[i] = Math.random() * 2 - 1;

    // ── Square-wave arp ──────────────────────────────────────────────────────
    // Filtered through bandpass at 1200Hz (Q=1.5) — takes the raw 8-bit edge
    // off while keeping the punchy rhythmic character. 32-note phrase.
    const arpSeq: number[] = [
      329.63, 329.63, 293.66, 293.66,  // E4 E4 D4 D4  — opening descent
      246.94, 246.94, 220.00, 220.00,  // B3 B3 A3 A3
      196.00, 220.00, 246.94, 293.66,  // G3 A3 B3 D4  — climb back
      329.63, 293.66, 246.94, 196.00,  // E4 D4 B3 G3  — resolve down
      220.00, 246.94, 329.63, 392.00,  // A3 B3 E4 G4  — second phrase, surge
      349.23, 329.63, 293.66, 246.94,  // F4 E4 D4 B3  — flat-6 noir tension
      220.00, 196.00, 246.94, 329.63,  // A3 G3 B3 E4
      293.66, 246.94, 196.00, 164.81,  // D4 B3 G3 E3  — full descent to rest
    ];
    let arpIdx = 0;

    const arp = (t: number) => {
      const freq = arpSeq[arpIdx % arpSeq.length];
      arpIdx++;
      const osc    = ctx.createOscillator();
      const bp     = ctx.createBiquadFilter();
      const g      = ctx.createGain();
      osc.type     = 'square';
      osc.frequency.setValueAtTime(freq, t);
      bp.type      = 'bandpass';
      bp.frequency.setValueAtTime(1200, t);
      bp.Q.setValueAtTime(1.5, t);
      g.gain.setValueAtTime(0.15, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + SIXTEENTH * 0.85);
      osc.connect(bp); bp.connect(g); g.connect(master);
      osc.start(t); osc.stop(t + SIXTEENTH);
    };

    // ── Acid bass (TB-303 style) ─────────────────────────────────────────────
    // Sawtooth + resonant lowpass (Q=10), filter sweeps from 1800Hz → 120Hz
    // per note — the "wah" per-note sound that defines acid house / cyberpunk.
    const bassSeq: number[] = [
      82.41,  82.41,  98.00,  110.00,   // E2 E2 G2 A2
      123.47, 110.00, 98.00,  82.41,    // B2 A2 G2 E2
    ];
    let bassIdx = 0;

    const bass = (t: number) => {
      const freq   = bassSeq[bassIdx % bassSeq.length];
      bassIdx++;
      const osc    = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const g      = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);
      filter.type = 'lowpass';
      filter.Q.setValueAtTime(10, t);
      filter.frequency.setValueAtTime(1800, t);
      filter.frequency.exponentialRampToValueAtTime(120, t + EIGHTH * 0.9);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.50, t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.001, t + EIGHTH * 1.80);
      osc.connect(filter); filter.connect(g); g.connect(master);
      osc.start(t); osc.stop(t + EIGHTH * 2);
    };

    const kick = (t: number, vol = 0.88) => {
      const osc = ctx.createOscillator();
      const g   = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(175, t);
      osc.frequency.exponentialRampToValueAtTime(38, t + 0.15);
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
      osc.connect(g); g.connect(master);
      osc.start(t); osc.stop(t + 0.30);
    };

    const snare = (t: number, vol = 0.44) => {
      const src    = ctx.createBufferSource();
      src.buffer   = snareBuf;
      const filter = ctx.createBiquadFilter();
      filter.type  = 'bandpass';
      filter.frequency.setValueAtTime(1600, t);
      filter.Q.setValueAtTime(0.7, t);
      const g = ctx.createGain();
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
      src.connect(filter); filter.connect(g); g.connect(master);
      src.start(t); src.stop(t + 0.10);
    };

    // Hi-hats on 8th notes only (not 16ths) — more breathing room, less 8-bit
    const hihat = (t: number, vol: number) => {
      const src    = ctx.createBufferSource();
      src.buffer   = hatBuf;
      const filter = ctx.createBiquadFilter();
      filter.type  = 'highpass';
      filter.frequency.setValueAtTime(10000, t);
      const g = ctx.createGain();
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.022);
      src.connect(filter); filter.connect(g); g.connect(master);
      src.start(t); src.stop(t + 0.025);
    };

    // Lookahead scheduler — 16th note resolution
    let step     = 0;
    let nextTime = ctx.currentTime + 0.05;
    const LOOKAHEAD = 0.12;

    const schedule = () => {
      while (nextTime < ctx.currentTime + LOOKAHEAD) {
        const s = step % 16;

        // Industrial kick: hard on 1 & 3, syncopated 16ths before 2 & 4
        if (s === 0 || s === 8)  kick(nextTime);           // beats 1 & 3
        if (s === 3 || s === 11) kick(nextTime, 0.38);     // 16th before 2 & 4
        if (s === 6)             kick(nextTime, 0.28);     // mid-bar accent

        // Snare on 2 & 4 with ghost hits
        if (s === 4 || s === 12) snare(nextTime);
        if (s === 6 || s === 14) snare(nextTime, 0.12);   // ghost snares

        // Hi-hats: 8th notes only (s % 2 === 0), accented on downbeats
        if (s % 2 === 0) hihat(nextTime, s % 4 === 0 ? 0.14 : 0.07);

        // Acid bass: every 8th note
        if (s % 2 === 0) bass(nextTime);

        // Filtered arp: every 16th
        arp(nextTime);

        step++;
        nextTime += SIXTEENTH;
      }
    };

    schedule();
    const intervalId = setInterval(schedule, 25);
    pulseNodesRef.current = { intervalId, master, padOscs };
  }, [ensureRunning]);

  const stopTiebreakerPulse = useCallback(async () => {
    if (!pulseNodesRef.current) return;

    const { intervalId, master, padOscs } = pulseNodesRef.current;
    clearInterval(intervalId);
    pulseNodesRef.current = null;

    const ctx = await ensureRunning();
    if (!ctx) return;

    const t = ctx.currentTime;
    try {
      master.gain.cancelScheduledValues(t);
      master.gain.setValueAtTime(master.gain.value, t);
      master.gain.linearRampToValueAtTime(0, t + 0.4);
      padOscs.forEach(osc => { try { osc.stop(t + 0.45); } catch {} });
    } catch {}
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

  // -------------------------------------------------------------------------
  // Lobby ambience — slow evolving cyberpunk pad (Am7 chord)
  // Multiple detuned sine/triangle oscillators at A2/E3/G3/A3/C4/E4 with
  // individual slow LFOs for a living, breathing quality. Feedback delay
  // adds depth. Fades in over 3s, fades out over 2.5s.
  // -------------------------------------------------------------------------
  const lobbyAmbienceRef = useRef<{
    intervalId: ReturnType<typeof setInterval>;
    master: GainNode;
    padOscs: OscillatorNode[];
  } | null>(null);

  const startLobbyAmbience = useCallback(async () => {
    if (lobbyAmbienceRef.current) return;

    const ctx = await ensureRunning();
    if (!ctx) return;

    const BPM = 128;
    const BEAT     = 60 / BPM;          // ~0.469s
    const STEP     = BEAT / 2;          // 8th note ~0.234s
    const SIXTEENTH = BEAT / 4;         // 16th note ~0.117s

    // Master gain — fade in over 2s
    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.45, ctx.currentTime + 2.0);
    master.connect(ctx.destination);

    // Pre-bake noise buffers once
    const snareSize = Math.floor(ctx.sampleRate * 0.12);
    const snareBuf  = ctx.createBuffer(1, snareSize, ctx.sampleRate);
    const sd = snareBuf.getChannelData(0);
    for (let i = 0; i < snareSize; i++) sd[i] = Math.random() * 2 - 1;

    const hatSize = Math.floor(ctx.sampleRate * 0.04);
    const hatBuf  = ctx.createBuffer(1, hatSize, ctx.sampleRate);
    const hd = hatBuf.getChannelData(0);
    for (let i = 0; i < hatSize; i++) hd[i] = Math.random() * 2 - 1;

    const t0 = ctx.currentTime;
    const padOscs: OscillatorNode[] = [];

    // ----------------------------------------------------------------
    // ATMOSPHERE PAD — Am7 chord sines underneath, very slow fade-in
    // Gives the dark, moody underbelly that defines cyberpunk atmosphere
    // ----------------------------------------------------------------
    const padLayers = [
      { freq: 110.0,  vol: 0.22 }, // A2 — root
      { freq: 165.0,  vol: 0.13 }, // E3 — fifth
      { freq: 196.0,  vol: 0.09 }, // G3 — minor seventh
      { freq: 261.63, vol: 0.06 }, // C4 — minor third
    ];
    padLayers.forEach(({ freq, vol }) => {
      const osc = ctx.createOscillator();
      const g   = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t0);
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(vol, t0 + 5.0); // very slow swell
      osc.connect(g); g.connect(master);
      osc.start(t0);
      padOscs.push(osc);
    });

    // ----------------------------------------------------------------
    // ARP — shared resonant filter with slow LFO sweep
    // The opening/closing filter is the signature cyberpunk synth texture
    // ----------------------------------------------------------------
    const arpFilter = ctx.createBiquadFilter();
    arpFilter.type = 'lowpass';
    arpFilter.frequency.setValueAtTime(500, t0);
    arpFilter.Q.setValueAtTime(5, t0);  // resonant peak for that synth character
    arpFilter.connect(master);

    // LFO sweeps the filter cutoff (500–2400Hz) over a ~20s period
    // Safe to use on frequency AudioParam (no gain ramp conflict)
    const filterLFO     = ctx.createOscillator();
    const filterLFOGain = ctx.createGain();
    filterLFO.type = 'sine';
    filterLFO.frequency.setValueAtTime(0.05, t0); // ~20s period
    filterLFOGain.gain.setValueAtTime(950, t0);   // sweeps ±950Hz around 1450Hz center
    arpFilter.frequency.setValueAtTime(1450, t0);
    filterLFO.connect(filterLFOGain);
    filterLFOGain.connect(arpFilter.frequency);
    filterLFO.start(t0);
    padOscs.push(filterLFO);

    // Am natural minor arpeggio — 16 notes, 16th note resolution (1 bar)
    // Includes flat-6 (F4 = 349Hz) and major-2nd (B3 = 247Hz) for dark tension
    const arpSeq = [
      220,    // A3  — root
      329.63, // E4  — fifth
      261.63, // C4  — minor third
      196.0,  // G3  — minor seventh
      220,    // A3
      349.23, // F4  — flat-6, very dark/noir
      329.63, // E4
      261.63, // C4
      246.94, // B3  — major 2nd, creates tension
      329.63, // E4
      293.66, // D4  — natural fourth
      196.0,  // G3
      220,    // A3
      440,    // A4  — octave climb
      392,    // G4
      349.23, // F4  — resolve back to flat-6
    ];
    let arpIdx = 0;

    const arp = (t: number) => {
      const freq = arpSeq[arpIdx % arpSeq.length];
      arpIdx++;
      const osc = ctx.createOscillator();
      const g   = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.20, t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.001, t + SIXTEENTH * 0.80);
      osc.connect(g); g.connect(arpFilter);
      osc.start(t); osc.stop(t + SIXTEENTH);
    };

    // ----------------------------------------------------------------
    // DRUMS — kick with syncopation, snare, layered hats
    // ----------------------------------------------------------------
    const kick = (t: number, vol = 0.9) => {
      const osc = ctx.createOscillator();
      const g   = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, t);
      osc.frequency.exponentialRampToValueAtTime(40, t + 0.18);
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      osc.connect(g); g.connect(master);
      osc.start(t); osc.stop(t + 0.38);
    };

    const snare = (t: number) => {
      const src    = ctx.createBufferSource();
      src.buffer   = snareBuf;
      const filter = ctx.createBiquadFilter();
      filter.type  = 'bandpass';
      filter.frequency.setValueAtTime(1400, t);
      filter.Q.setValueAtTime(0.7, t);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.40, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      src.connect(filter); filter.connect(g); g.connect(master);
      src.start(t); src.stop(t + 0.13);
    };

    const hihat = (t: number, vol: number) => {
      const src    = ctx.createBufferSource();
      src.buffer   = hatBuf;
      const filter = ctx.createBiquadFilter();
      filter.type  = 'highpass';
      filter.frequency.setValueAtTime(9000, t);
      const g = ctx.createGain();
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
      src.connect(filter); filter.connect(g); g.connect(master);
      src.start(t); src.stop(t + 0.05);
    };

    // ----------------------------------------------------------------
    // BASS — walking Am line: A2 A2 E2 A2 | A2 G2 F2 E2
    // Moves with the harmony, not just root-root-root
    // ----------------------------------------------------------------
    const bassSeq = [110, 110, 82.41, 110, 110, 98.0, 87.31, 82.41];
    let bassIdx = 0;

    const bass = (t: number) => {
      const freq   = bassSeq[bassIdx % bassSeq.length];
      bassIdx++;
      const osc    = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const g      = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(190, t);
      g.gain.setValueAtTime(0.55, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + STEP * 1.85);
      osc.connect(filter); filter.connect(g); g.connect(master);
      osc.start(t); osc.stop(t + STEP * 2);
    };

    // ----------------------------------------------------------------
    // LOOKAHEAD SCHEDULER — 16th note resolution (16 steps = 1 bar)
    // ----------------------------------------------------------------
    let step     = 0;
    let nextTime = ctx.currentTime + 0.05;
    const LOOKAHEAD = 0.12;

    const schedule = () => {
      while (nextTime < ctx.currentTime + LOOKAHEAD) {
        const s = step % 16;

        // Kick: beat 1 (s=0), beat 3 (s=8), ghost on s=10 (syncopation)
        if (s === 0 || s === 8) kick(nextTime);
        if (s === 10)           kick(nextTime, 0.38); // ghost kick — propulsion

        // Snare: beats 2 (s=4) and 4 (s=12)
        if (s === 4 || s === 12) snare(nextTime);

        // Hi-hats: on-beats louder, 16th offbeats very quiet
        hihat(nextTime, s % 4 === 0 ? 0.14 : s % 2 === 0 ? 0.08 : 0.04);

        // Bass: every 8th note (every 2 sixteenth steps)
        if (s % 2 === 0) bass(nextTime);

        // Arp: every 16th note
        arp(nextTime);

        step++;
        nextTime += SIXTEENTH;
      }
    };

    schedule();
    const intervalId = setInterval(schedule, 25);
    lobbyAmbienceRef.current = { intervalId, master, padOscs };
  }, [ensureRunning]);

  const setLobbyAmbienceVolume = useCallback(async (vol: number) => {
    const amb = lobbyAmbienceRef.current;
    if (!amb) return;
    const ctx = await ensureRunning();
    if (!ctx) return;
    const t = ctx.currentTime;
    amb.master.gain.cancelScheduledValues(t);
    amb.master.gain.setValueAtTime(amb.master.gain.value, t);
    amb.master.gain.linearRampToValueAtTime(vol, t + 0.3);
  }, [ensureRunning]);

  const stopLobbyAmbience = useCallback(async () => {
    const amb = lobbyAmbienceRef.current;
    if (!amb) return;

    clearInterval(amb.intervalId);

    const ctx = await ensureRunning();
    if (!ctx) return;

    const t = ctx.currentTime;
    amb.master.gain.cancelScheduledValues(t);
    amb.master.gain.setValueAtTime(amb.master.gain.value, t);
    amb.master.gain.linearRampToValueAtTime(0, t + 2.0);

    const stopAt = t + 2.1;
    amb.padOscs.forEach(osc => { try { osc.stop(stopAt); } catch {} });

    // Null the ref only after the fade completes so start() can't race it
    setTimeout(() => { lobbyAmbienceRef.current = null; }, 2200);
  }, [ensureRunning]);

  // -------------------------------------------------------------------------
  // NTL Ambient — "Cyberpunk Waiting Room"
  // 120 BPM, Am pentatonic pizzicato synth + hip-hop drums.
  // Plucked sawtooth/triangle → bandpass = marimba/pizzicato-string hybrid.
  // Syncopated 2-bar melody loop, snare on 2&4, tight hi-hats.
  // Subtle urgency without being distracting — game show waiting room energy.
  // -------------------------------------------------------------------------
  const ntlAmbienceRef = useRef<{
    intervalId: ReturnType<typeof setInterval>;
    master: GainNode;
  } | null>(null);

  const startNTLAmbience = useCallback(async () => {
    if (ntlAmbienceRef.current) return;
    const ctx = await ensureRunning();
    if (!ctx) return;

    const BPM      = 120;
    const SIXTEENTH = (60 / BPM) / 4; // 0.125s

    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 0.8);
    master.connect(ctx.destination);

    // Light compressor to glue everything
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.setValueAtTime(-18, ctx.currentTime);
    comp.ratio.setValueAtTime(4, ctx.currentTime);
    comp.connect(master);

    // ── Noise buffers ─────────────────────────────────────────────────────
    const hatSize   = Math.floor(ctx.sampleRate * 0.04);
    const hatBuf    = ctx.createBuffer(1, hatSize, ctx.sampleRate);
    const hd        = hatBuf.getChannelData(0);
    for (let i = 0; i < hatSize; i++) hd[i] = Math.random() * 2 - 1;

    const snareSize = Math.floor(ctx.sampleRate * 0.10);
    const snareBuf  = ctx.createBuffer(1, snareSize, ctx.sampleRate);
    const sd        = snareBuf.getChannelData(0);
    for (let i = 0; i < snareSize; i++) sd[i] = Math.random() * 2 - 1;

    // ── Pizzicato/marimba pluck ────────────────────────────────────────────
    // Sawtooth + detuned triangle → bandpass centred at 3× freq (bright pluck)
    // Attack 3ms, decay 110ms — tight, staccato game-show pluck feel
    const pizzo = (t: number, freq: number, vol = 0.38) => {
      const o1 = ctx.createOscillator();
      const o2 = ctx.createOscillator();
      const bp = ctx.createBiquadFilter();
      const g  = ctx.createGain();
      o1.type = 'sawtooth'; o1.frequency.setValueAtTime(freq, t);
      o2.type = 'triangle'; o2.frequency.setValueAtTime(freq * 1.004, t);
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(Math.min(freq * 3, 4000), t);
      bp.Q.setValueAtTime(2.5, t);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.003);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.11);
      o1.connect(bp); o2.connect(bp); bp.connect(g); g.connect(comp);
      o1.start(t); o2.start(t);
      o1.stop(t + 0.13); o2.stop(t + 0.13);
    };

    // ── Kick drum ─────────────────────────────────────────────────────────
    const kick = (t: number, vol = 0.65) => {
      const osc = ctx.createOscillator();
      const g   = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, t);
      osc.frequency.exponentialRampToValueAtTime(40, t + 0.12);
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
      osc.connect(g); g.connect(comp);
      osc.start(t); osc.stop(t + 0.25);
    };

    // ── Snare ─────────────────────────────────────────────────────────────
    const snare = (t: number, vol = 0.30) => {
      const src = ctx.createBufferSource();
      src.buffer = snareBuf;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass'; bp.frequency.setValueAtTime(1500, t); bp.Q.setValueAtTime(0.8, t);
      const g = ctx.createGain();
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
      src.connect(bp); bp.connect(g); g.connect(comp);
      src.start(t); src.stop(t + 0.10);
    };

    // ── Hi-hat ────────────────────────────────────────────────────────────
    const hihat = (t: number, vol: number) => {
      const src = ctx.createBufferSource();
      src.buffer = hatBuf;
      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass'; hp.frequency.setValueAtTime(9000, t);
      const g = ctx.createGain();
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.025);
      src.connect(hp); hp.connect(g); g.connect(comp);
      src.start(t); src.stop(t + 0.03);
    };

    // ── 2-bar Am-pentatonic melody (32 sixteenth steps) ───────────────────
    // null = rest. Frequencies: A3=220, C4=261, D4=293, E4=329, G4=392, A4=440, C5=523
    const mel: (number | null)[] = [
      440,  null, 329,  null,  392,  329,  null,  261,   // bar 1 beats 1-2
      null, 329,  220,  null,  293,  null,  329,  null,   // bar 1 beats 3-4
      523,  null, 440,  329,   null, 392,  null,  293,   // bar 2 beats 1-2
      261,  null, 329,  null,  220,  293,  null,  null,  // bar 2 beats 3-4
    ];

    // Hip-hop kick (syncopated — kick on 1, and a syncopated 16th before beat 3)
    const kPat = [1,0,0,0, 0,0,1,0, 0,1,0,0, 0,0,0,0,  1,0,0,0, 0,0,1,0, 0,0,0,1, 0,0,0,0];
    // Snare: beats 2 & 4 = steps 4,12,20,28
    const sPat = [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0, 0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0];
    // Hi-hats: 8th notes (every 2 steps), accented on downbeats
    const hPat = [2,0,1,0,2,0,1,0,2,0,1,0,2,0,1,0, 2,0,1,0,2,0,1,0,2,0,1,0,2,0,1,0];

    let step = 0;
    let nextTime = ctx.currentTime + 0.05;
    const LOOKAHEAD = 0.15;

    const schedule = () => {
      while (nextTime < ctx.currentTime + LOOKAHEAD) {
        const s = step % 32;
        const note = mel[s];
        if (note !== null) pizzo(nextTime, note);
        if (kPat[s]) kick(nextTime, s === 0 || s === 16 ? 0.65 : 0.42);
        if (sPat[s]) snare(nextTime);
        if (hPat[s]) hihat(nextTime, hPat[s] === 2 ? 0.11 : 0.055);
        step++;
        nextTime += SIXTEENTH;
      }
    };

    schedule();
    const intervalId = setInterval(schedule, 25);
    ntlAmbienceRef.current = { intervalId, master };
  }, [ensureRunning]);

  const stopNTLAmbience = useCallback(async () => {
    const amb = ntlAmbienceRef.current;
    if (!amb) return;
    clearInterval(amb.intervalId);
    ntlAmbienceRef.current = null;
    const ctx = await ensureRunning();
    if (!ctx) return;
    const t = ctx.currentTime;
    amb.master.gain.cancelScheduledValues(t);
    amb.master.gain.setValueAtTime(amb.master.gain.value, t);
    amb.master.gain.linearRampToValueAtTime(0, t + 2.0);
  }, [ensureRunning]);

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
    startLobbyAmbience,
    stopLobbyAmbience,
    setLobbyAmbienceVolume,
    startNTLAmbience,
    stopNTLAmbience,
  };
}
