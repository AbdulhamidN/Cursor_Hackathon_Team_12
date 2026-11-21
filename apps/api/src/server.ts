import { API_PREFIX, HEALTH_PATH } from '@ecb/contracts';
import { createApp } from './app';
import { connectDatabase, disconnectDatabase } from './config/database';
import { env } from './config/env';

const server = createApp().listen(env.API_PORT, () => {
  console.info(`API ready: http://localhost:${env.API_PORT}${API_PREFIX}${HEALTH_PATH}`);
});

server.on('error', (error) => {
  console.error(`API could not start on port ${env.API_PORT}: ${error.message}`);
  process.exit(1);
});

try {
  await connectDatabase();
  console.info('MongoDB connected');
} catch (error) {
  const reason = error instanceof Error ? error.message : String(error);
  console.error(`MongoDB connection failed: ${reason}`);
  // In development the API keeps running so the health check can report the
  // problem. In production a missing database is fatal.
  if (env.NODE_ENV === 'production') process.exit(1);
  console.warn('Running without a database. Start MongoDB, then restart the API.');
}

async function shutdown(signal: string): Promise<void> {
  console.info(`${signal} received, shutting down`);
  server.close();
  await disconnectDatabase();
  process.exit(0);
}

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));
