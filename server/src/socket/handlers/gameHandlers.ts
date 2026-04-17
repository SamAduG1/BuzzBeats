import { Server, Socket } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents } from '@shared/types/socket-events';
import { gameManager } from '../../game/GameManager';
import { roomManager } from '../../rooms/RoomManager';

export function registerGameHandlers(
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>
) {
  socket.on('game:start', async (data, callback) => {
    // Verify this is the host
    if (!roomManager.isHost(socket.id)) {
      callback({ success: false, error: 'Only the host can start the game' });
      return;
    }

    const room = roomManager.getRoomBySocketId(socket.id);
    if (!room) {
      callback({ success: false, error: 'Room not found' });
      return;
    }

    const result = await gameManager.startGame(room.code, data.settings, io, socket.id);
    callback(result);
  });

  socket.on('game:buzzer-press', (callback) => {
    const room = roomManager.getRoomBySocketId(socket.id);
    if (!room) {
      callback({ accepted: false, error: 'Not in a room' });
      return;
    }

    const result = gameManager.handleBuzzerPress(room.code, socket.id, io);
    callback(result);
  });

  socket.on('game:answer-submit', (data, callback) => {
    const room = roomManager.getRoomBySocketId(socket.id);
    if (!room) {
      callback({ received: false, error: 'Not in a room' });
      return;
    }

    const result = gameManager.handleAnswerSubmit(room.code, socket.id, data, io);
    callback(result);
  });

  socket.on('game:play-again', (callback) => {
    if (!roomManager.isHost(socket.id)) {
      callback({ success: false, error: 'Only the host can restart' });
      return;
    }

    const room = roomManager.getRoomBySocketId(socket.id);
    if (!room) {
      callback({ success: false, error: 'Room not found' });
      return;
    }

    // Clean up game state and reset room to lobby
    gameManager.cleanupGame(room.code);
    roomManager.setRoomStatus(room.code, 'lobby');

    // Broadcast lobby state to all clients (include team data if active)
    const isTeam = roomManager.isTeamMode(room.code);
    io.to(room.code).emit('room:state-sync', {
      code: room.code,
      players: room.players,
      status: 'lobby',
      ...(isTeam && {
        teamMode: true,
        teams: roomManager.getTeams(room.code),
        teamAssignments: roomManager.getTeamAssignments(room.code),
      }),
    });

    callback({ success: true });
  });

  socket.on('game:skip-song', (callback) => {
    if (!roomManager.isHost(socket.id)) {
      callback({ success: false, error: 'Only the host can skip' });
      return;
    }
    const room = roomManager.getRoomBySocketId(socket.id);
    if (!room) {
      callback({ success: false, error: 'Room not found' });
      return;
    }
    const result = gameManager.handleSkipSong(room.code, socket.id, io);
    callback(result);
  });

  socket.on('game:tie-vote', (data, callback) => {
    const room = roomManager.getRoomBySocketId(socket.id);
    if (!room) { callback({ accepted: false, error: 'Room not found' }); return; }
    const result = gameManager.handleTieVote(room.code, socket.id, data.choice, io);
    callback(result);
  });

  socket.on('game:tiebreaker-vote', (data, callback) => {
    const room = roomManager.getRoomBySocketId(socket.id);
    if (!room) {
      callback({ accepted: false, error: 'Room not found' });
      return;
    }
    const result = gameManager.handleTiebreakerVote(room.code, socket.id, data.votedForId, io);
    callback(result);
  });
}
