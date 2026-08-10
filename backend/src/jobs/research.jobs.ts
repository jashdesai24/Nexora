import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis.js';

export const RESEARCH_QUEUE_NAME = 'research-ingestion';

export interface ResearchIngestionJob {
  companyId: string;
  userId?: string;
  forceRefresh?: boolean;
}

export const researchQueue = new Queue<ResearchIngestionJob>(RESEARCH_QUEUE_NAME, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: true,
    removeOnFail: 100, // Keep last 100 failed jobs for debugging
  },
});

export const enqueueResearchIngestion = async (
  data: ResearchIngestionJob
) => {
  // Use companyId as jobId to prevent duplicate concurrent jobs for the same company
  const jobId = `${data.companyId}-${Date.now()}`;
  
  await researchQueue.add('ingest', data, {
    jobId,
    // If the same job is already running, avoid enqueuing another immediately (idempotency could be handled by omitting Date.now() if we want strict deduplication, but for now we just want to track it)
  });
  
  return jobId;
};
