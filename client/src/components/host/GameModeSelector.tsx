'use client';

import { GameModeId, AVAILABLE_GAME_MODES } from '@shared/types/gameMode';

interface GameModeSelectorProps {
  selectedMode: GameModeId;
  onSelect: (mode: GameModeId) => void;
}

const MODE_COLORS: Record<string, string> = {
  'classic': '#00f0ff',
  'speed': '#ffe600',
  'snippet': '#39ff14',
  'elimination': '#ff1744',
  'lyric-word-match': '#b400ff',
};

export default function GameModeSelector({ selectedMode, onSelect }: GameModeSelectorProps) {
  return (
    <div>
      <p className="text-text-secondary text-xs uppercase tracking-widest mb-4">
        Game Mode
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {AVAILABLE_GAME_MODES.map((mode) => {
          const isSelected = selectedMode === mode.id;
          const isAvailable = mode.available;
          const accentColor = MODE_COLORS[mode.id] ?? '#00f0ff';

          return (
            <button
              key={mode.id}
              onClick={() => isAvailable && onSelect(mode.id as GameModeId)}
              disabled={!isAvailable}
              className={`
                relative p-4 rounded-xl text-left transition-all
                ${isAvailable ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed opacity-40'}
              `}
              style={{
                background: isSelected ? '#16213e' : '#1a1a2e',
                border: isSelected
                  ? `2px solid ${accentColor}`
                  : isAvailable
                  ? '1px solid rgba(0, 240, 255, 0.15)'
                  : '1px solid rgba(0, 240, 255, 0.1)',
                boxShadow: isSelected ? `0 0 20px ${accentColor}33` : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {!isAvailable && (
                <span className="absolute top-2 right-2 text-[10px] uppercase tracking-wider text-text-secondary/70 bg-bg-secondary px-1.5 py-0.5 rounded">
                  Soon
                </span>
              )}
              <span
                className="text-2xl block mb-1"
                style={{
                  filter: isSelected ? `drop-shadow(0 0 8px ${accentColor})` : 'none',
                }}
              >
                {mode.icon}
              </span>
              <span
                className="text-sm font-bold block"
                style={{ color: isSelected ? accentColor : '#e0e0ff' }}
              >
                {mode.name}
              </span>
              <span className="text-xs text-text-secondary block mt-1 leading-snug">
                {mode.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
