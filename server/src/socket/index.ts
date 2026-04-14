import { Server } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents } from '@shared/types/socket-events';
import { registerRoomHandlers } from './handlers/roomHandlers';
import { registerConnectionHandlers } from './handlers/connectionHandlers';
import { registerGameHandlers } from './handlers/gameHandlers';

export function setupSocketHandlers(
  io: Server<ClientToServerEvents, ServerToClientEvents>
) {
  io.on('connection', (socket) => {
    console.log(`[Socket] Connected: ${socket.id}`);
    registerRoomHandlers(io, socket);
    registerConnectionHandlers(io, socket);
    registerGameHandlers(io, socket);
  });
}
