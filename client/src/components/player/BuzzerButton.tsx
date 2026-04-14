'use client';

import { useState } from 'react';
import { Mic, Music, Headphones, Radio, Disc } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useRoom } from '@/context/RoomContext';
import { useSoundEffects } from '@/hooks/useSoundEffects';

const PLAYER_ICONS: LucideIcon[] = [Mic, Music, Headphones, Radio, Disc];

export default function BuzzerButton() {
  const { pressBuzzer, room, socket } = useRoom();
  const { playBuzzer } = useSoundEffects();
  const [pressing, setPressing] = useState(false);

  // Pick a unique icon per player based on their position in the room
  const playerIndex = room?.players.findIndex((p) => p.id === socket?.id) ?? 0;
  const IconComponent = PLAYER_ICONS[Math.max(0, playerIndex) % PLAYER_ICONS.length];

  const handleBuzz = async () => {
    if (pressing) return;
    setPressing(true);
    playBuzzer().catch(() => {});
    await pressBuzzer();
    setTimeout(() => setPressing(false), 500);
  };

  return (
    <div className="flex-1 flex items-center justify-center min-h-[50vh] w-full">
      <div className="relative w-full max-w-[280px] aspect-square">
        {/* Ping ring */}
        {!pressing && (
          <div
            className="absolute inset-0 rounded-full animate-ping"
            style={{
              background: 'radial-gradient(circle, rgba(255, 0, 229, 0.35) 0%, transparent 70%)',
            }}
          />
        )}

        <button
          onClick={handleBuzz}
          disabled={pressing}
          className="relative w-full h-full rounded-full flex flex-col items-center justify-center transition-all duration-150 active:scale-95"
          style={{
            background: pressing
              ? '#ff00e5'
              : 'radial-gradient(circle at 30% 30%, #ff00e5, #b400ff)',
            boxShadow: pressing
              ? '0 0 60px rgba(255, 0, 229, 0.8)'
              : '0 0 50px rgba(255, 0, 229, 0.55), 0 0 90px rgba(255, 0, 229, 0.25), inset 0 -8px 30px rgba(0,0,0,0.25)',
            border: '3px solid rgba(255, 255, 255, 0.25)',
            cursor: pressing ? 'not-allowed' : 'pointer',
          }}
        >
          <IconComponent
            className="w-16 h-16 mb-3"
            style={{
              color: '#ffffff',
              filter: 'drop-shadow(0 0 16px rgba(255, 255, 255, 0.8))',
            }}
          />
          <span
            className="text-3xl font-bold"
            style={{
              fontFamily: 'var(--font-orbitron), sans-serif',
              color: '#ffffff',
              textShadow: '0 0 16px rgba(255, 255, 255, 0.8)',
            }}
          >
            {pressing ? 'BUZZED' : 'BUZZ!'}
          </span>
        </button>
      </div>
    </div>
  );
}
