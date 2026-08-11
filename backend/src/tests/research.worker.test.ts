import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import { prisma } from '../config/db.js';
import { enqueueResearchIngestion } from '../jobs/research.jobs.js';
import { researchWorker } from '../workers/research.worker.js';

describe('Research Worker & Queue', () => {
  let companyId: string;

  beforeEach(async () => {
    // Clean up
    const tableNames = ['Company', 'Evidence', 'Source'];
    for (const table of tableNames) {
      try {
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`);
      } catch {
        // Ignore
      }
    }

    // Create company
    const company = await prisma.company.create({
      data: {
        id: 'hdfc-bank',
        name: 'HDFC Bank',
        sector: 'Financials',
        industry: 'Banking',
        identifiers: {
          create: [{ type: 'NSE', value: 'HDFCBANK' }]
        }
      }
    });
    companyId = company.id;
  });

  afterAll(async () => {
    await researchWorker.close();
  });

  it('should process a research ingestion job and save evidence', async () => {
    const jobId = await enqueueResearchIngestion({
      companyId,
      forceRefresh: true
    });

    expect(jobId).toBe(companyId); // Idempotency check

    // Wait for the worker to process the job by polling the database
    let evidence: { category: string }[] = [];
    for (let i = 0; i < 20; i++) {
      evidence = await prisma.evidence.findMany({
        where: { companyId }
      });
      if (evidence.length > 0) break;
      await new Promise(resolve => setTimeout(resolve, 250));
    }

    expect(evidence.length).toBeGreaterThan(0);
    
    // We expect at least fundamentals and mock news to be inserted
    const hasNews = evidence.some(e => e.category === 'news');
    const hasFundamentals = evidence.some(e => e.category === 'fundamentals');
    
    expect(hasNews).toBe(true);
    expect(hasFundamentals).toBe(true);
  }, 15000);
});
