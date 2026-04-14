'use client';

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

  const play = (key: SoundKey) => {
    (sfx[key] as () => Promise<void>)().catch(() => {});
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

        <div className="flex flex-col gap-3">
          {sounds.map(({ key, label, desc }) => (
            <button
              key={key}
              onClick={() => play(key)}
              className="w-full text-left px-5 py-4 rounded-xl transition-all duration-150 active:scale-[0.98] cursor-pointer"
              style={{
                background: '#12121a',
                border: '1px solid rgba(0,240,255,0.15)',
                boxShadow: '0 0 0 rgba(0,240,255,0)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.border = '1px solid rgba(0,240,255,0.4)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 16px rgba(0,240,255,0.1)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.border = '1px solid rgba(0,240,255,0.15)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 0 rgba(0,240,255,0)';
              }}
            >
              <p
                className="font-bold text-base"
                style={{ fontFamily: 'var(--font-orbitron), sans-serif', color: '#00f0ff' }}
              >
                {label}
              </p>
              <p className="text-sm mt-0.5" style={{ color: '#8888aa' }}>{desc}</p>
            </button>
          ))}
        </div>

        <p className="text-xs text-center pt-4" style={{ color: '#444466' }}>
          Sounds are synthesized via Web Audio API — no audio files involved.
        </p>
      </div>
    </main>
  );
}
