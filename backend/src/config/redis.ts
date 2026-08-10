import { Redis } from 'ioredis';
import { env } from './env.js';

const connection = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

connection.on('error', (err: unknown) => {
  console.error('[Redis] Connection Error:', err);
});

connection.on('connect', () => {
  console.log('[Redis] Connected to Redis successfully');
});

export { connection as redisConnection };
