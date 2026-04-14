'use client';

import { useState, useEffect, useRef } from 'react';
import type { Player } from '@shared/types/room';

interface PlayerListProps {
  players: Player[];
  showConnectionStatus?: boolean;
  onKick?: (playerId: string) => void;
}

const EXIT_DURATION = 300;

export default function PlayerList({ players, showConnectionStatus = true, onKick }: PlayerListProps) {
  const [exitingPlayers, setExitingPlayers] = useState<Player[]>([]);
  const prevPlayersRef = useRef<Player[]>(players);

  useEffect(() => {
    const currentIds = new Set(players.map((p) => p.id));
    const removed = prevPlayersRef.current.filter((p) => !currentIds.has(p.id));

    if (removed.length > 0) {
      setExitingPlayers((prev) => [...prev, ...removed]);

      setTimeout(() => {
        setExitingPlayers((prev) =>
          prev.filter((p) => !removed.some((r) => r.id === p.id))
        );
      }, EXIT_DURATION);
    }

    prevPlayersRef.current = players;
  }, [players]);

  const displayPlayers = [...players, ...exitingPlayers];
  const exitingIds = new Set(exitingPlayers.map((p) => p.id));

  if (displayPlayers.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-text-secondary text-lg">
          Waiting for players to join...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-text-secondary text-sm uppercase tracking-widest mb-3">
        Players ({players.length})
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {displayPlayers.map((player) => (
          <div
            key={player.id}
            className={`
              glass-card rounded-lg px-4 py-3
              flex items-center gap-3
              transition-all duration-300 ease-out
              ${exitingIds.has(player.id)
                ? 'opacity-0 scale-90'
                : 'opacity-100 scale-100'
              }
            `}
          >
            {showConnectionStatus && (
              <div
                className={`
                  w-2.5 h-2.5 rounded-full flex-shrink-0
                  ${player.isConnected
                    ? 'bg-neon-green animate-pulse-dot'
                    : 'bg-neon-red'
                  }
                `}
              />
            )}
            <span className="text-text-primary font-medium truncate flex-1">
              {player.displayName}
            </span>
            {onKick && !exitingIds.has(player.id) && (
              <button
                onClick={() => onKick(player.id)}
                className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded text-text-secondary/40 hover:text-neon-red hover:bg-neon-red/10 transition-colors cursor-pointer"
                title={`Remove ${player.displayName}`}
              >
                &times;
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
