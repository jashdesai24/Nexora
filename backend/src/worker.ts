import { env } from './config/env.js';
import './workers/research.worker.js';
import { startScheduler, schedulerWorker } from './jobs/scheduler.jobs.js';

console.log(`[Worker] Started background worker process in ${env.NODE_ENV} mode.`);

// Initialize scheduler
startScheduler().catch(err => {
  console.error('[Worker] Failed to start scheduler', err);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('[Worker] SIGTERM received, shutting down gracefully...');
  const { researchWorker } = await import('./workers/research.worker.js');
  await researchWorker.close();
  await schedulerWorker.close();
  process.exit(0);
});
