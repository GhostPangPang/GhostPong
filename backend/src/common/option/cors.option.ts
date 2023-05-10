export const corsOption = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  allowedHeaders: ['Authorization', 'x-my-id'],
  exposedHeaders: ['Location'],
};
