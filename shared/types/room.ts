export interface Player {
  id: string;
  displayName: string;
  isConnected: boolean;
  joinedAt: number;
}

export interface RoomSettings {
  maxPlayers: number;
  teamMode?: boolean;
  teamCount?: number;  // 2-4
}

export type RoomStatus = 'lobby' | 'playing' | 'finished';

export interface Room {
  code: string;
  hostSocketId: string;
  players: Player[];
  status: RoomStatus;
  settings: RoomSettings;
  createdAt: number;
}
