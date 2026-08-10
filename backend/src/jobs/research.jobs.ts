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
  // Use companyId as jobId for strict deduplication. 
  // BullMQ will ignore the add() request if a job with this ID is already waiting or active.
  const jobId = data.companyId;
  
  await researchQueue.add('ingest', data, {
    jobId,
  });
  
  return jobId;
};
