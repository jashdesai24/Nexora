import { env } from './config/env.js';
import './workers/research.worker.js';

console.log(`[Worker] Started background worker process in ${env.NODE_ENV} mode.`);

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('[Worker] SIGTERM received, shutting down gracefully...');
  const { researchWorker } = await import('./workers/research.worker.js');
  await researchWorker.close();
  process.exit(0);
});
