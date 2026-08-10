import { describe, it, expect, vi } from 'vitest';
import { ResearchIntelligenceService } from '../research-intelligence.service.js';
import type { MarketDataProvider, NewsProvider } from '../../providers/types.js';
import * as researchJobs from '../../jobs/research.jobs.js';

vi.mock('../../jobs/research.jobs.js', () => ({
  enqueueResearchIngestion: vi.fn().mockResolvedValue('job-123')
}));

vi.mock('../company.service.js', () => ({
  getCompanyById: vi.fn().mockResolvedValue({
    id: 'c-1',
    name: 'Test Corp',
    identifiers: [{ type: 'NSE', value: 'TEST' }]
  })
}));

vi.mock('../../repositories/research.repository.js', () => ({
  researchRepository: {
    getResearchForCompany: vi.fn().mockResolvedValue({
      evidence: [],
      events: []
    })
  }
}));

describe('ResearchIntelligenceService Tests', () => {
  it('should format database evidence and enqueue background job', async () => {
    const mockMarketProvider: MarketDataProvider = {
      name: 'mock',
      getQuote: vi.fn().mockResolvedValue({ price: 100, changePercent: 5, volume: 1000 }),
      getOHLC: vi.fn()
    };

    const mockNewsProvider: NewsProvider = {
      name: 'mock',
      getCompanyNews: vi.fn().mockResolvedValue([])
    };

    const service = new ResearchIntelligenceService(mockMarketProvider, mockNewsProvider);
    
    const result = await service.getResearchIntelligence('c-1');
    
    expect(result).not.toBeNull();
    expect(result?.companyName).toBe('Test Corp');
    expect(researchJobs.enqueueResearchIngestion).toHaveBeenCalledWith({
      companyId: 'c-1',
      userId: undefined,
      forceRefresh: true
    });
  });
});
