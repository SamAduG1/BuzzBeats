import { Room, Player } from '@shared/types/room';
import { Team, TeamAssignments, TEAM_COLORS, TEAM_NAMES } from '@shared/types/team';
import { generateRoomCode } from '../utils/roomCode';

const DEFAULT_MAX_PLAYERS = 10;
const RECONNECT_TIMEOUT_MS = 60_000;

class RoomManager {
  private rooms: Map<string, Room> = new Map();
  private playerToRoom: Map<string, string> = new Map();
  private reconnectTimers: Map<string, NodeJS.Timeout> = new Map();
  private disconnectedHosts: Set<string> = new Set(); // room codes with disconnected hosts
  private teamAssignments: Map<string, Map<string, number>> = new Map(); // roomCode -> (playerId -> teamId)

  constructor() {
    // Clean up stale rooms every 5 minutes
    setInterval(() => this.cleanupStaleRooms(), 5 * 60 * 1000);
  }

  createRoom(hostSocketId: string): Room {
    let code = generateRoomCode();
    while (this.rooms.has(code)) {
      code = generateRoomCode();
    }

    const room: Room = {
      code,
      hostSocketId,
      players: [],
      status: 'lobby',
      settings: { maxPlayers: DEFAULT_MAX_PLAYERS },
      createdAt: Date.now(),
    };

    this.rooms.set(code, room);
    this.playerToRoom.set(hostSocketId, code);
    return room;
  }

  joinRoom(code: string, playerId: string, displayName: string): { room: Room; oldSocketId?: string } {
    const room = this.rooms.get(code);
    if (!room) {
      throw new Error('Room not found');
    }

    const trimmedName = displayName.trim();
    if (!trimmedName || trimmedName.length > 20) {
      throw new Error('Display name must be 1-20 characters');
    }

    // Reconnect check must happen BEFORE the lobby-status gate so that
    // mid-game socket reconnects (new socket.id) are handled correctly.
    const disconnectedPlayer = room.players.find(
      (p) => p.displayName.toLowerCase() === trimmedName.toLowerCase() && !p.isConnected
    );
    if (disconnectedPlayer) {
      return this.reconnectPlayer(code, disconnectedPlayer, playerId);
    }

    // Also allow a still-connected player to rejoin with a new socket ID
    // (e.g. brief reconnect where the server never saw a disconnect event).
    const connectedPlayer = room.players.find(
      (p) => p.displayName.toLowerCase() === trimmedName.toLowerCase() && p.isConnected
    );
    if (connectedPlayer && connectedPlayer.id !== playerId) {
      // Same player, new socket — treat as a reconnect
      return this.reconnectPlayer(code, connectedPlayer, playerId);
    }

    if (room.status !== 'lobby') {
      throw new Error('Game already in progress');
    }

    // Check for duplicate name among connected players
    const nameTaken = room.players.some(
      (p) => p.displayName.toLowerCase() === trimmedName.toLowerCase() && p.isConnected
    );
    if (nameTaken) {
      throw new Error('Display name already taken');
    }

    if (room.players.length >= room.settings.maxPlayers) {
      throw new Error('Room is full');
    }

    const player: Player = {
      id: playerId,
      displayName: trimmedName,
      isConnected: true,
      joinedAt: Date.now(),
    };

    room.players.push(player);
    this.playerToRoom.set(playerId, code);

    // Auto-assign to team if team mode is active
    if (this.isTeamMode(code)) {
      this.assignNewPlayerToTeam(code, playerId);
    }

    return { room };
  }

  private reconnectPlayer(code: string, player: Player, newSocketId: string): { room: Room; oldId: string } {
    const room = this.rooms.get(code)!;
    const oldId = player.id;

    // Clear reconnect timer
    const timer = this.reconnectTimers.get(oldId);
    if (timer) {
      clearTimeout(timer);
      this.reconnectTimers.delete(oldId);
    }

    // Update player identity
    this.playerToRoom.delete(oldId);
    player.id = newSocketId;
    player.isConnected = true;
    this.playerToRoom.set(newSocketId, code);

    // Transfer team assignment to new socket ID
    const assignments = this.teamAssignments.get(code);
    if (assignments && assignments.has(oldId)) {
      const teamId = assignments.get(oldId)!;
      assignments.delete(oldId);
      assignments.set(newSocketId, teamId);
    }

    return { room, oldId };
  }

  markPlayerDisconnected(socketId: string): { room: Room; player: Player } | null {
    const code = this.playerToRoom.get(socketId);
    if (!code) return null;

    const room = this.rooms.get(code);
    if (!room) return null;

    const player = room.players.find((p) => p.id === socketId);
    if (!player) return null;

    player.isConnected = false;

    // Start reconnect timeout
    const timer = setTimeout(() => {
      this.removePlayer(socketId);
    }, RECONNECT_TIMEOUT_MS);
    this.reconnectTimers.set(socketId, timer);

    return { room, player };
  }

  removePlayer(socketId: string): { room: Room; players: Player[] } | null {
    const code = this.playerToRoom.get(socketId);
    if (!code) return null;

    const room = this.rooms.get(code);
    if (!room) return null;

    room.players = room.players.filter((p) => p.id !== socketId);
    this.playerToRoom.delete(socketId);
    this.removePlayerFromTeams(code, socketId);

    // Clear any reconnect timer
    const timer = this.reconnectTimers.get(socketId);
    if (timer) {
      clearTimeout(timer);
      this.reconnectTimers.delete(socketId);
    }

    // Don't auto-delete rooms when players leave — the host may still want the room.
    // Stale rooms are cleaned up by the periodic cleanup timer (every 5 min, 2hr TTL).

    return { room, players: room.players };
  }

  isHost(socketId: string): boolean {
    const code = this.playerToRoom.get(socketId);
    if (!code) return false;
    const room = this.rooms.get(code);
    return room?.hostSocketId === socketId;
  }

  getRoom(code: string): Room | undefined {
    return this.rooms.get(code);
  }

  getRoomBySocketId(socketId: string): Room | undefined {
    const code = this.playerToRoom.get(socketId);
    if (!code) return undefined;
    return this.rooms.get(code);
  }

  markHostDisconnected(code: string): void {
    this.disconnectedHosts.add(code);
  }

  isRoomHostDisconnected(code: string): boolean {
    return this.disconnectedHosts.has(code);
  }

  updateHostSocketId(code: string, newSocketId: string): void {
    const room = this.rooms.get(code);
    if (!room) return;

    const oldHostId = room.hostSocketId;
    this.playerToRoom.delete(oldHostId);
    room.hostSocketId = newSocketId;
    this.playerToRoom.set(newSocketId, code);
    this.disconnectedHosts.delete(code);
  }

  setRoomStatus(code: string, status: 'lobby' | 'playing' | 'finished'): void {
    const room = this.rooms.get(code);
    if (room) {
      room.status = status;
    }
  }

  getConnectedPlayers(code: string): import('@shared/types/room').Player[] {
    const room = this.rooms.get(code);
    if (!room) return [];
    return room.players.filter((p) => p.isConnected);
  }

  deleteRoom(code: string): void {
    const room = this.rooms.get(code);
    if (!room) return;

    // Clean up all player mappings and timers
    for (const player of room.players) {
      this.playerToRoom.delete(player.id);
      const timer = this.reconnectTimers.get(player.id);
      if (timer) {
        clearTimeout(timer);
        this.reconnectTimers.delete(player.id);
      }
    }
    this.playerToRoom.delete(room.hostSocketId);
    this.disconnectedHosts.delete(code);
    this.teamAssignments.delete(code);
    this.rooms.delete(code);
  }

  // --- Team Management ---

  isTeamMode(code: string): boolean {
    return this.teamAssignments.has(code);
  }

  enableTeamMode(code: string, teamCount: number): void {
    const room = this.rooms.get(code);
    if (!room) return;

    room.settings.teamMode = true;
    room.settings.teamCount = teamCount;
    room.settings.maxPlayers = 32;

    // Round-robin assign current players
    const assignments = new Map<string, number>();
    room.players.forEach((player, i) => {
      assignments.set(player.id, i % teamCount);
    });
    this.teamAssignments.set(code, assignments);
  }

  disableTeamMode(code: string): void {
    const room = this.rooms.get(code);
    if (!room) return;

    room.settings.teamMode = false;
    room.settings.teamCount = undefined;
    room.settings.maxPlayers = DEFAULT_MAX_PLAYERS;
    this.teamAssignments.delete(code);
  }

  shuffleTeams(code: string): void {
    const room = this.rooms.get(code);
    if (!room || !this.isTeamMode(code)) return;

    const teamCount = room.settings.teamCount || 2;
    const playerIds = room.players.map((p) => p.id);

    // Fisher-Yates shuffle
    for (let i = playerIds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [playerIds[i], playerIds[j]] = [playerIds[j], playerIds[i]];
    }

    // Round-robin assign
    const assignments = new Map<string, number>();
    playerIds.forEach((id, i) => {
      assignments.set(id, i % teamCount);
    });
    this.teamAssignments.set(code, assignments);
  }

  movePlayerToTeam(code: string, playerId: string, targetTeamId: number): void {
    const assignments = this.teamAssignments.get(code);
    if (!assignments) return;
    assignments.set(playerId, targetTeamId);
  }

  assignNewPlayerToTeam(code: string, playerId: string): void {
    const room = this.rooms.get(code);
    const assignments = this.teamAssignments.get(code);
    if (!room || !assignments) return;

    const teamCount = room.settings.teamCount || 2;

    // Find team with fewest members
    const counts = new Array(teamCount).fill(0);
    for (const teamId of assignments.values()) {
      if (teamId < teamCount) counts[teamId]++;
    }
    const smallestTeamId = counts.indexOf(Math.min(...counts));
    assignments.set(playerId, smallestTeamId);
  }

  removePlayerFromTeams(code: string, playerId: string): void {
    const assignments = this.teamAssignments.get(code);
    if (assignments) {
      assignments.delete(playerId);
    }
  }

  getTeams(code: string): Team[] {
    const room = this.rooms.get(code);
    const assignments = this.teamAssignments.get(code);
    if (!room || !assignments) return [];

    const teamCount = room.settings.teamCount || 2;
    const teams: Team[] = [];

    for (let i = 0; i < teamCount; i++) {
      const playerIds: string[] = [];
      for (const [playerId, teamId] of assignments) {
        if (teamId === i) playerIds.push(playerId);
      }
      teams.push({
        id: i,
        name: TEAM_NAMES[i],
        color: TEAM_COLORS[i],
        playerIds,
      });
    }

    return teams;
  }

  getTeamAssignments(code: string): TeamAssignments {
    const assignments = this.teamAssignments.get(code);
    if (!assignments) return {};
    return Object.fromEntries(assignments);
  }

  private cleanupStaleRooms(): void {
    const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
    for (const [code, room] of this.rooms) {
      if (room.createdAt < twoHoursAgo) {
        console.log(`[RoomManager] Cleaning up stale room: ${code}`);
        this.deleteRoom(code);
      }
    }
  }
}

export const roomManager = new RoomManager();
