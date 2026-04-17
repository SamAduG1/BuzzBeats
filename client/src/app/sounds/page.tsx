'use client';

import { useState } from 'react';
import { useSoundEffects } from '@/hooks/useSoundEffects';

const sounds = [
  { key: 'playBuzzer',            label: 'Buzzer Press',         desc: 'Player hits the buzz button' },
  { key: 'playCorrect',           label: 'Correct Answer',       desc: 'Someone got it right' },
  { key: 'playWrong',             label: 'Wrong Answer',         desc: 'No winner this round' },
  { key: 'playTick',              label: 'Tick',                 desc: 'Final 5-second countdown' },
  { key: 'playFanfare',           label: 'Fanfare',              desc: 'Game over / winner' },
  { key: 'playTiebreakerStinger', label: 'Sudden Death Stinger', desc: 'Entering sudden death' },
  { key: 'startTiebreakerPulse', label: 'Sudden Death Pulse',   desc: 'Low drone during sudden death (runs until stopped)' },
  { key: 'stopTiebreakerPulse',  label: 'Stop Pulse',           desc: 'Stop the sudden death drone' },
  { key: 'playEliminationReveal', label: 'Elimination Reveal',   desc: 'Someone got eliminated' },
  { key: 'playLastChanceStinger', label: 'Last Chance',          desc: 'Last Chance phase begins' },
] as const;

type SoundKey = typeof sounds[number]['key'];

export default function SoundsPage() {
  const sfx = useSoundEffects();
  const [ambiencePlaying, setAmbiencePlaying] = useState(false);
  const [ntlAmbiencePlaying, setNtlAmbiencePlaying] = useState(false);

  const play = (key: SoundKey) => {
    (sfx[key] as () => Promise<void>)().catch(() => {});
  };

  const toggleAmbience = () => {
    if (ambiencePlaying) {
      sfx.stopLobbyAmbience().catch(() => {});
      setAmbiencePlaying(false);
    } else {
      sfx.startLobbyAmbience().catch(() => {});
      setAmbiencePlaying(true);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] p-8">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="mb-8">
          <h1
            className="text-3xl font-bold mb-1"
            style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: '#00f0ff', textShadow: '0 0 20px rgba(0,240,255,0.5)' }}
          >
            Sound Lab
          </h1>
          <p style={{ color: '#8888aa' }}>Click each button to preview the sound effect.</p>
        </div>

        {/* Ambient toggles */}
        <div>
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#444466', fontFamily: 'var(--font-orbitron), sans-serif' }}>Ambient</p>
          <div className="flex flex-col gap-3">
          <button
            onClick={toggleAmbience}
            className="w-full text-left px-5 py-4 rounded-xl transition-all duration-150 active:scale-[0.98] cursor-pointer"
            style={{
              background: ambiencePlaying ? 'rgba(255,0,229,0.08)' : '#12121a',
              border: ambiencePlaying ? '1px solid rgba(255,0,229,0.5)' : '1px solid rgba(255,0,229,0.2)',
              boxShadow: ambiencePlaying ? '0 0 20px rgba(255,0,229,0.15)' : 'none',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-base" style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: '#ff00e5' }}>
                  Lobby Ambience
                </p>
                <p className="text-sm mt-0.5" style={{ color: '#8888aa' }}>
                  {ambiencePlaying ? 'Playing — click to stop (2.5s fade out)' : 'Cyberpunk pad that loops during the lobby'}
                </p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full ml-4 shrink-0" style={{
                background: ambiencePlaying ? 'rgba(255,0,229,0.2)' : 'rgba(255,255,255,0.05)',
                color: ambiencePlaying ? '#ff00e5' : '#555577',
                fontFamily: 'var(--font-orbitron), sans-serif',
              }}>
                {ambiencePlaying ? 'ON' : 'OFF'}
              </span>
            </div>
          </button>

          {/* NTL Ambient toggle */}
          <button
            onClick={() => {
              if (ntlAmbiencePlaying) {
                sfx.stopNTLAmbience().catch(() => {});
                setNtlAmbiencePlaying(false);
              } else {
                sfx.startNTLAmbience().catch(() => {});
                setNtlAmbiencePlaying(true);
              }
            }}
            className="w-full text-left px-5 py-4 rounded-xl transition-all duration-150 active:scale-[0.98] cursor-pointer"
            style={{
              background: ntlAmbiencePlaying ? 'rgba(0,240,255,0.08)' : '#12121a',
              border: ntlAmbiencePlaying ? '1px solid rgba(0,240,255,0.5)' : '1px solid rgba(0,240,255,0.2)',
              boxShadow: ntlAmbiencePlaying ? '0 0 20px rgba(0,240,255,0.15)' : 'none',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-base" style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: '#00f0ff' }}>
                  NTL Ambient (Option 2)
                </p>
                <p className="text-sm mt-0.5" style={{ color: '#8888aa' }}>
                  {ntlAmbiencePlaying ? 'Playing — click to stop' : 'Music-box pentatonic — for Name That Lyric'}
                </p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full ml-4 shrink-0" style={{
                background: ntlAmbiencePlaying ? 'rgba(0,240,255,0.2)' : 'rgba(255,255,255,0.05)',
                color: ntlAmbiencePlaying ? '#00f0ff' : '#555577',
                fontFamily: 'var(--font-orbitron), sans-serif',
              }}>
                {ntlAmbiencePlaying ? 'ON' : 'OFF'}
              </span>
            </div>
          </button>
          </div>
        </div>

        {/* One-shot sound effects */}
        <div>
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#444466', fontFamily: 'var(--font-orbitron), sans-serif' }}>Effects</p>
          <div className="flex flex-col gap-3">
            {sounds.map(({ key, label, desc }) => (
              <button
                key={key}
                onClick={() => play(key)}
                className="w-full text-left px-5 py-4 rounded-xl transition-all duration-150 active:scale-[0.98] cursor-pointer"
                style={{
                  background: '#12121a',
                  border: '1px solid rgba(0,240,255,0.15)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.border = '1px solid rgba(0,240,255,0.4)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 16px rgba(0,240,255,0.1)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.border = '1px solid rgba(0,240,255,0.15)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                }}
              >
                <p className="font-bold text-base" style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: '#00f0ff' }}>
                  {label}
                </p>
                <p className="text-sm mt-0.5" style={{ color: '#8888aa' }}>{desc}</p>
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-center pt-4" style={{ color: '#444466' }}>
          Sounds are synthesized via Web Audio API — no audio files involved.
        </p>
      </div>
    </main>
  );
}
