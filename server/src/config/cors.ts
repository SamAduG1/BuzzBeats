import { env } from './environment';

export const corsConfig = {
  origin: env.CLIENT_URL,
  methods: ['GET', 'POST'],
  credentials: true,
};
