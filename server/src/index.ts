import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { setupSocketHandlers } from './socket';
import { corsConfig } from './config/cors';
import { env } from './config/environment';
import { ClientToServerEvents, ServerToClientEvents } from '@shared/types/socket-events';

const app = express();
const httpServer = createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: corsConfig,
});

app.use(cors(corsConfig));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

setupSocketHandlers(io);

httpServer.listen(env.PORT, () => {
  console.log(`[BuzzBeats Server] Running on port ${env.PORT}`);
});
