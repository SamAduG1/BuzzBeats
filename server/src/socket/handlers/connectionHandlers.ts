import { Server, Socket } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents } from '@shared/types/socket-events';
import { roomManager } from '../../rooms/RoomManager';
import { gameManager } from '../../game/GameManager';

const HOST_RECONNECT_TIMEOUT_MS = 15_000;
const hostReconnectTimers: Map<string, NodeJS.Timeout> = new Map();

export { hostReconnectTimers };

export function registerConnectionHandlers(
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>
) {
  socket.on('disconnect', () => {
    console.log(`[Socket] Disconnected: ${socket.id}`);

    // Check if this was the host
    if (roomManager.isHost(socket.id)) {
      const room = roomManager.getRoomBySocketId(socket.id);
      if (room) {
        console.log(`[Room] Host disconnected from ${room.code}, waiting for reconnect...`);
        roomManager.markHostDisconnected(room.code);

        // Give the host a grace period to reconnect (e.g. page refresh)
        const timer = setTimeout(() => {
          const currentRoom = roomManager.getRoom(room.code);
          if (currentRoom && currentRoom.hostSocketId === socket.id) {
            console.log(`[Room] Host did not reconnect, closing room: ${room.code}`);
            io.to(room.code).emit('room:closed', {
              reason: 'Host disconnected',
            });
            gameManager.cleanupGame(room.code);
            roomManager.deleteRoom(room.code);
          }
          hostReconnectTimers.delete(room.code);
        }, HOST_RECONNECT_TIMEOUT_MS);

        hostReconnectTimers.set(room.code, timer);
      }
      return;
    }

    // Regular player disconnect
    const result = roomManager.markPlayerDisconnected(socket.id);
    if (result) {
      socket.to(result.room.code).emit('room:player-disconnected', {
        playerId: result.player.id,
        displayName: result.player.displayName,
      });
      console.log(`[Room] ${result.player.displayName} disconnected from ${result.room.code}`);
    }
  });
}
