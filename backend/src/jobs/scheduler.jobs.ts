import { env } from '../config/env.js';
import { prisma } from '../config/db.js';
import { enqueueResearchIngestion } from './research.jobs.js';
import cron from 'node-cron';

/**
 * Enqueues research ingestion for all active companies.
 * A company is considered active if it is in any user's watchlist or has an investment thesis.
 */
export async function scheduleActiveResearch() {
  console.log('[Scheduler] Fetching active companies for research ingestion...');
  try {
    const activeCompanies = await prisma.company.findMany({
      where: {
        OR: [
          { theses: { some: {} } },
          { watchlists: { some: {} } }
        ]
      },
      select: { id: true, name: true }
    });

    console.log(`[Scheduler] Found ${activeCompanies.length} active companies.`);

    for (const company of activeCompanies) {
      await enqueueResearchIngestion({
        companyId: company.id,
        forceRefresh: true // We want the worker to update its freshness
      });
      console.log(`[Scheduler] Enqueued research job for ${company.name} (${company.id})`);
    }
  } catch (error) {
    console.error('[Scheduler] Failed to schedule active research:', error);
  }
}

// Keep a dummy object for compatibility with graceful shutdown in worker.ts
export const schedulerWorker = {
  close: async () => {
    // node-cron handles shutdown via process exit, or we can explicitly destroy tasks
    console.log('[Scheduler] Stopping node-cron tasks...');
  }
};

/**
 * Initializes the cron schedule.
 */
export async function startScheduler() {
  const cronExpression = env.RESEARCH_CRON_SCHEDULE || '0 */4 * * *'; // Default to every 4 hours
  console.log(`[Scheduler] Starting scheduler with cron: ${cronExpression}`);

  if (cron.validate(cronExpression)) {
    cron.schedule(cronExpression, async () => {
      await scheduleActiveResearch();
    });
  } else {
    console.error(`[Scheduler] Invalid cron expression: ${cronExpression}`);
  }
}
