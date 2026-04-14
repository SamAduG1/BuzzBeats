import { Server, Socket } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents } from '@shared/types/socket-events';
import { roomManager } from '../../rooms/RoomManager';
import { gameManager } from '../../game/GameManager';
import { hostReconnectTimers } from './connectionHandlers';

export function registerRoomHandlers(
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>
) {
  // Helper: clean up any existing room this socket is associated with
  function cleanupExistingRoom() {
    const existingRoom = roomManager.getRoomBySocketId(socket.id);
    if (!existingRoom) return;

    const wasHost = roomManager.isHost(socket.id);
    if (wasHost) {
      // Host is leaving — end the game and close the room for everyone
      console.log(`[Room] Host leaving room ${existingRoom.code}, cleaning up`);
      gameManager.cleanupGame(existingRoom.code);
      gameManager.cleanupRoomRulesData(existingRoom.code);
      io.to(existingRoom.code).emit('room:closed', { reason: 'Host left the room' });
      socket.leave(existingRoom.code);
      roomManager.deleteRoom(existingRoom.code);
    } else {
      // Player leaving — just remove them
      const result = roomManager.removePlayer(socket.id);
      if (result) {
        socket.leave(result.room.code);
        socket.to(result.room.code).emit('room:player-left', {
          playerId: socket.id,
          players: result.players,
        });
      }
    }
  }

  socket.on('room:create', (callback) => {
    // Clean up any existing room this socket is in before creating a new one
    cleanupExistingRoom();

    const room = roomManager.createRoom(socket.id);
    socket.join(room.code);
    console.log(`[Room] Created: ${room.code} by ${socket.id}`);
    callback({ success: true, roomCode: room.code });
  });

  socket.on('room:join', ({ roomCode, displayName }, callback) => {
    const code = roomCode.toUpperCase();

    // Clean up any existing room this socket is in before joining a new one
    const existingRoom = roomManager.getRoomBySocketId(socket.id);
    if (existingRoom && existingRoom.code !== code) {
      cleanupExistingRoom();
    }

    try {
      const { room, oldSocketId } = roomManager.joinRoom(code, socket.id, displayName);
      const wasDisconnected = !!oldSocketId;

      socket.join(room.code);

      // If reconnecting, migrate all game state to the new socket ID
      // and push the current game state directly to the reconnecting socket
      if (oldSocketId) {
        gameManager.updatePlayerSocketId(code, oldSocketId, socket.id);
        gameManager.pushStateTo(code, socket.id, io);
      }

      const player = room.players.find((p) => p.id === socket.id)!;

      const isTeam = roomManager.isTeamMode(code);
      callback({
        success: true,
        room: {
          code: room.code,
          players: room.players,
          status: room.status,
          ...(isTeam && {
            teamMode: true,
            teams: roomManager.getTeams(code),
            teamAssignments: roomManager.getTeamAssignments(code),
          }),
        },
      });

      if (wasDisconnected) {
        socket.to(room.code).emit('room:player-reconnected', {
          playerId: player.id,
          displayName: player.displayName,
        });
      } else {
        socket.to(room.code).emit('room:player-joined', {
          player,
          players: room.players,
        });
      }

      // Broadcast updated teams if team mode active
      if (isTeam) {
        io.to(room.code).emit('room:teams-updated', {
          teams: roomManager.getTeams(code),
          teamAssignments: roomManager.getTeamAssignments(code),
        });
      }

      console.log(`[Room] ${player.displayName} joined ${room.code} (${room.players.length} players)`);
    } catch (error: any) {
      callback({ success: false, error: error.message });
    }
  });

  socket.on('room:get-state', ({ roomCode }, callback) => {
    const code = roomCode.toUpperCase();
    const room = roomManager.getRoom(code);

    if (!room) {
      callback({ success: false, error: 'Room not found' });
      return;
    }

    // Re-join the socket.io room channel (needed after page navigation)
    socket.join(room.code);

    // Check if this is a host reconnecting with a new socket ID
    let isHost = room.hostSocketId === socket.id;

    if (!isHost && roomManager.isRoomHostDisconnected(code)) {
      // Host is reconnecting after a page refresh - update their socket ID
      roomManager.updateHostSocketId(code, socket.id);
      isHost = true;

      // Cancel the host disconnect timeout
      const timer = hostReconnectTimers.get(code);
      if (timer) {
        clearTimeout(timer);
        hostReconnectTimers.delete(code);
      }

      console.log(`[Room] Host reconnected to ${room.code} with new socket ${socket.id}`);
    }

    const isTeam = roomManager.isTeamMode(code);
    callback({
      success: true,
      room: {
        code: room.code,
        players: room.players,
        status: room.status,
        ...(isTeam && {
          teamMode: true,
          teams: roomManager.getTeams(code),
          teamAssignments: roomManager.getTeamAssignments(code),
        }),
      },
      isHost,
    });

    console.log(`[Room] State synced for ${room.code} (host: ${isHost})`);
  });

  socket.on('room:leave', () => {
    cleanupExistingRoom();
  });

  socket.on('room:kick-player', ({ playerId }, callback) => {
    if (!roomManager.isHost(socket.id)) {
      callback({ success: false, error: 'Only the host can kick players' });
      return;
    }

    const room = roomManager.getRoomBySocketId(socket.id);
    if (!room) {
      callback({ success: false, error: 'Room not found' });
      return;
    }

    const target = room.players.find((p) => p.id === playerId);
    if (!target) {
      callback({ success: false, error: 'Player not found' });
      return;
    }

    // Notify the kicked player
    const targetSocket = io.sockets.sockets.get(playerId);
    if (targetSocket) {
      targetSocket.emit('room:kicked', { reason: 'You were removed by the host' });
      targetSocket.leave(room.code);
    }

    // Remove from server state
    roomManager.removePlayer(playerId);

    // Broadcast updated player list (use io.to so host also receives)
    const updatedRoom = roomManager.getRoom(room.code);
    if (updatedRoom) {
      io.to(room.code).emit('room:player-left', {
        playerId,
        players: updatedRoom.players,
      });
    }

    // Broadcast updated teams if team mode active
    if (roomManager.isTeamMode(room.code)) {
      io.to(room.code).emit('room:teams-updated', {
        teams: roomManager.getTeams(room.code),
        teamAssignments: roomManager.getTeamAssignments(room.code),
      });
    }

    console.log(`[Room] Host kicked ${target.displayName} from ${room.code}`);
    callback({ success: true });
  });

  // --- Team Mode Handlers ---

  socket.on('room:set-team-mode', ({ enabled, teamCount }, callback) => {
    if (!roomManager.isHost(socket.id)) {
      callback({ success: false, error: 'Only the host can change team settings' });
      return;
    }

    const room = roomManager.getRoomBySocketId(socket.id);
    if (!room) {
      callback({ success: false, error: 'Room not found' });
      return;
    }

    if (enabled) {
      const count = teamCount || 2;
      if (count < 2 || count > 4) {
        callback({ success: false, error: 'Team count must be 2-4' });
        return;
      }
      roomManager.enableTeamMode(room.code, count);
    } else {
      roomManager.disableTeamMode(room.code);
    }

    io.to(room.code).emit('room:teams-updated', {
      teams: roomManager.getTeams(room.code),
      teamAssignments: roomManager.getTeamAssignments(room.code),
    });

    // Sync room state so all clients get updated maxPlayers/settings
    io.to(room.code).emit('room:state-sync', {
      code: room.code,
      players: room.players,
      status: room.status,
      teamMode: enabled,
      teams: roomManager.getTeams(room.code),
      teamAssignments: roomManager.getTeamAssignments(room.code),
    });

    console.log(`[Room] Team mode ${enabled ? `enabled (${teamCount} teams)` : 'disabled'} in ${room.code}`);
    callback({ success: true });
  });

  socket.on('room:shuffle-teams', (callback) => {
    if (!roomManager.isHost(socket.id)) {
      callback({ success: false, error: 'Only the host can shuffle teams' });
      return;
    }

    const room = roomManager.getRoomBySocketId(socket.id);
    if (!room) {
      callback({ success: false, error: 'Room not found' });
      return;
    }

    if (!roomManager.isTeamMode(room.code)) {
      callback({ success: false, error: 'Team mode is not active' });
      return;
    }

    roomManager.shuffleTeams(room.code);

    io.to(room.code).emit('room:teams-updated', {
      teams: roomManager.getTeams(room.code),
      teamAssignments: roomManager.getTeamAssignments(room.code),
    });

    console.log(`[Room] Teams shuffled in ${room.code}`);
    callback({ success: true });
  });

  socket.on('room:move-player-team', ({ playerId, targetTeamId }, callback) => {
    if (!roomManager.isHost(socket.id)) {
      callback({ success: false, error: 'Only the host can move players' });
      return;
    }

    const room = roomManager.getRoomBySocketId(socket.id);
    if (!room) {
      callback({ success: false, error: 'Room not found' });
      return;
    }

    if (!roomManager.isTeamMode(room.code)) {
      callback({ success: false, error: 'Team mode is not active' });
      return;
    }

    roomManager.movePlayerToTeam(room.code, playerId, targetTeamId);

    io.to(room.code).emit('room:teams-updated', {
      teams: roomManager.getTeams(room.code),
      teamAssignments: roomManager.getTeamAssignments(room.code),
    });

    console.log(`[Room] Player ${playerId} moved to team ${targetTeamId} in ${room.code}`);
    callback({ success: true });
  });
}
