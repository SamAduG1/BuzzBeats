export const env = {
  PORT: parseInt(process.env.PORT || process.env.SERVER_PORT || '3001', 10),
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
};
