'use client';

import { useState } from 'react';
import type { Player } from '@shared/types/room';
import type { Team } from '@shared/types/team';
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';

interface TeamPlayerListProps {
  players: Player[];
  teams: Team[];
  teamCount: number;
  onKick?: (playerId: string) => void;
  onMovePlayer?: (playerId: string, targetTeamId: number) => void;
}

const TEAM_COLOR_MAP: Record<string, { border: string; bg: string; text: string; glow: string }> = {
  cyan: { border: 'border-neon-cyan', bg: 'bg-neon-cyan/10', text: 'text-neon-cyan', glow: 'glow-cyan' },
  magenta: { border: 'border-neon-magenta', bg: 'bg-neon-magenta/10', text: 'text-neon-magenta', glow: 'glow-magenta' },
  yellow: { border: 'border-neon-yellow', bg: 'bg-neon-yellow/10', text: 'text-neon-yellow', glow: 'glow-yellow' },
  green: { border: 'border-neon-green', bg: 'bg-neon-green/10', text: 'text-neon-green', glow: 'glow-green' },
};

function DraggablePlayer({
  player,
  teamId,
  teamCount,
  onKick,
  onMovePlayer,
}: {
  player: Player;
  teamId: number;
  teamCount: number;
  onKick?: (playerId: string) => void;
  onMovePlayer?: (playerId: string, targetTeamId: number) => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: player.id,
    data: { playerId: player.id, currentTeamId: teamId },
    disabled: !onMovePlayer,
  });

  const handleClick = () => {
    if (!onMovePlayer) return;
    const nextTeamId = (teamId + 1) % teamCount;
    onMovePlayer(player.id, nextTeamId);
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={handleClick}
      className={`
        glass-card rounded-lg px-3 py-2
        flex items-center gap-2
        ${onMovePlayer ? 'cursor-grab active:cursor-grabbing hover:border-text-secondary/40' : ''}
        ${isDragging ? 'opacity-30' : ''}
        transition-all touch-none
      `}
    >
      <div
        className={`
          w-2 h-2 rounded-full flex-shrink-0
          ${player.isConnected ? 'bg-neon-green animate-pulse-dot' : 'bg-neon-red'}
        `}
      />
      <span className="text-text-primary text-sm font-medium truncate flex-1">
        {player.displayName}
      </span>
      {onMovePlayer && (
        <span className="text-text-secondary/30 text-xs flex-shrink-0">drag / tap</span>
      )}
      {onKick && (
        <button
          onClick={(e) => { e.stopPropagation(); onKick(player.id); }}
          className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded text-text-secondary/40 hover:text-neon-red hover:bg-neon-red/10 transition-colors cursor-pointer"
          title={`Remove ${player.displayName}`}
        >
          &times;
        </button>
      )}
    </div>
  );
}

function DroppableTeam({
  team,
  teamPlayers,
  teamCount,
  isOver,
  onKick,
  onMovePlayer,
}: {
  team: Team;
  teamPlayers: Player[];
  teamCount: number;
  isOver: boolean;
  onKick?: (playerId: string) => void;
  onMovePlayer?: (playerId: string, targetTeamId: number) => void;
}) {
  const { setNodeRef } = useDroppable({ id: `team-${team.id}`, data: { teamId: team.id } });
  const colors = TEAM_COLOR_MAP[team.color] || TEAM_COLOR_MAP.cyan;

  return (
    <div
      ref={setNodeRef}
      className={`
        rounded-lg border ${colors.border}/30 ${colors.bg} p-3
        transition-all duration-200
        ${isOver ? `${colors.border} ring-2 ring-${team.color === 'cyan' ? 'neon-cyan' : team.color === 'magenta' ? 'neon-magenta' : team.color === 'yellow' ? 'neon-yellow' : 'neon-green'}/30 scale-[1.02]` : ''}
      `}
    >
      <p className={`text-sm font-bold ${colors.text} uppercase tracking-wider mb-2`}>
        Team {team.name} ({teamPlayers.length})
      </p>
      <div className="space-y-1.5 min-h-[40px]">
        {teamPlayers.length === 0 ? (
          <p className={`text-sm italic py-1 ${isOver ? colors.text + '/50' : 'text-text-secondary/50'}`}>
            {isOver ? 'Drop here!' : 'No players'}
          </p>
        ) : (
          teamPlayers.map((player) => (
            <DraggablePlayer
              key={player.id}
              player={player}
              teamId={team.id}
              teamCount={teamCount}
              onKick={onKick}
              onMovePlayer={onMovePlayer}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default function TeamPlayerList({ players, teams, teamCount, onKick, onMovePlayer }: TeamPlayerListProps) {
  const playerMap = new Map(players.map((p) => [p.id, p]));
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overTeamId, setOverTeamId] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  );

  if (players.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-text-secondary text-lg">
          Waiting for players to join...
        </p>
      </div>
    );
  }

  const activePlayer = activeId ? playerMap.get(activeId) : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: { over: { data: { current?: { teamId?: number } } } | null }) => {
    const teamId = event.over?.data?.current?.teamId;
    setOverTeamId(teamId ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setOverTeamId(null);

    if (!over || !onMovePlayer) return;

    const playerId = active.id as string;
    const targetTeamId = over.data?.current?.teamId as number | undefined;
    const currentTeamId = active.data?.current?.currentTeamId as number | undefined;

    if (targetTeamId !== undefined && targetTeamId !== currentTeamId) {
      onMovePlayer(playerId, targetTeamId);
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setOverTeamId(null);
  };

  return (
    <div className="space-y-4">
      <p className="text-text-secondary text-sm uppercase tracking-widest">
        Teams ({players.length} players)
      </p>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teams.map((team) => {
            const teamPlayers = team.playerIds
              .map((id) => playerMap.get(id))
              .filter(Boolean) as Player[];

            return (
              <DroppableTeam
                key={team.id}
                team={team}
                teamPlayers={teamPlayers}
                teamCount={teamCount}
                isOver={overTeamId === team.id}
                onKick={onKick}
                onMovePlayer={onMovePlayer}
              />
            );
          })}
        </div>

        <DragOverlay>
          {activePlayer ? (
            <div className="glass-card rounded-lg px-3 py-2 flex items-center gap-2 opacity-80 shadow-lg shadow-neon-cyan/20 border border-neon-cyan/40">
              <div
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  activePlayer.isConnected ? 'bg-neon-green' : 'bg-neon-red'
                }`}
              />
              <span className="text-text-primary text-sm font-medium">
                {activePlayer.displayName}
              </span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
