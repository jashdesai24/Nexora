import { describe, it, expect, vi } from 'vitest';
import { JarvisService } from '../jarvis.service.js';
import type { LLMProvider } from '../../providers/types.js';

describe('JarvisService Validation Tests', () => {
  it('should successfully parse valid structured response', async () => {
    const mockProvider: LLMProvider = {
      name: 'mock',
      analyze: vi.fn().mockResolvedValue({ content: JSON.stringify({ impacts: [
        {
          evidenceId: 'e-1',
          impact: 'supports',
          rationale: 'Valid rationale'
        }
      ] }) })
    };

    const jarvis = new JarvisService(mockProvider);
    
    const parsedThesis = {
      statement: 'Thesis',
      supportingReasons: [],
      risks: [],
      invalidationCriteria: [],
    };
    
    const evidence = [{ id: 'e-1', title: 'News', summary: 'Summary' }];

    const result = await jarvis.evaluateEvidenceImpact(parsedThesis, evidence);
    expect(result.length).toBe(1);
    expect(result[0]?.impact).toBe('supports');
  });

  it('should throw Zod error on missing fields', async () => {
    const mockProvider: LLMProvider = {
      name: 'mock',
      analyze: vi.fn().mockResolvedValue({ content: JSON.stringify({ impacts: [
        {
          evidenceId: 'e-1',
          impact: 'supports'
          // missing rationale
        }
      ] }) })
    };

    const jarvis = new JarvisService(mockProvider);
    
    const parsedThesis = {
      statement: 'Thesis',
      supportingReasons: [],
      risks: [],
      invalidationCriteria: [],
    };
    
    const evidence = [{ id: 'e-1', title: 'News', summary: 'Summary' }];

    await expect(jarvis.evaluateEvidenceImpact(parsedThesis, evidence)).rejects.toThrow();
  });

  it('should throw Zod error on unsupported impact values', async () => {
    const mockProvider: LLMProvider = {
      name: 'mock',
      analyze: vi.fn().mockResolvedValue({ content: JSON.stringify({ impacts: [
        {
          evidenceId: 'e-1',
          impact: 'super-supports', // invalid enum
          rationale: 'Valid rationale'
        }
      ] }) })
    };

    const jarvis = new JarvisService(mockProvider);
    
    const parsedThesis = {
      statement: 'Thesis',
      supportingReasons: [],
      risks: [],
      invalidationCriteria: [],
    };
    
    const evidence = [{ id: 'e-1', title: 'News', summary: 'Summary' }];

    await expect(jarvis.evaluateEvidenceImpact(parsedThesis, evidence)).rejects.toThrow();
  });

  it('should handle provider failure/timeout', async () => {
    const mockProvider: LLMProvider = {
      name: 'mock',
      analyze: vi.fn().mockRejectedValue(new Error('Timeout'))
    };

    const jarvis = new JarvisService(mockProvider);
    
    const parsedThesis = {
      statement: 'Thesis',
      supportingReasons: [],
      risks: [],
      invalidationCriteria: [],
    };
    
    const evidence = [{ id: 'e-1', title: 'News', summary: 'Summary' }];

    await expect(jarvis.evaluateEvidenceImpact(parsedThesis, evidence)).rejects.toThrow('Timeout');
  });
});
