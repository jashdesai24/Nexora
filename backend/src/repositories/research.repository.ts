import { prisma } from '../config/db.js';

export interface UpsertSourcePayload {
  name: string;
  type: string;
}

export interface UpsertEvidencePayload {
  companyId: string;
  sourceId: string;
  title: string;
  summary?: string;
  url: string;
  category: string;
  publishedAt: Date;
}

export class ResearchRepository {
  async ensureSourceExists(data: UpsertSourcePayload) {
    let source = await prisma.source.findFirst({
      where: { name: data.name, type: data.type }
    });

    if (!source) {
      source = await prisma.source.create({
        data: {
          name: data.name,
          type: data.type,
        }
      });
    }

    return source;
  }

  async upsertEvidence(data: UpsertEvidencePayload) {
    // Upsert based on URL as a unique identifier for an article
    const existing = await prisma.evidence.findFirst({
      where: { url: data.url, companyId: data.companyId }
    });

    if (existing) {
      return prisma.evidence.update({
        where: { id: existing.id },
        data: {
          title: data.title,
          summary: data.summary,
          publishedAt: data.publishedAt,
          retrievedAt: new Date(),
        },
        include: { source: true }
      });
    }

    return prisma.evidence.create({
      data: {
        companyId: data.companyId,
        sourceId: data.sourceId,
        title: data.title,
        summary: data.summary,
        url: data.url,
        category: data.category,
        publishedAt: data.publishedAt,
        retrievedAt: new Date(),
      },
      include: { source: true }
    });
  }

  async getResearchForCompany(companyId: string) {
    const evidence = await prisma.evidence.findMany({
      where: { companyId },
      include: { source: true },
      orderBy: { publishedAt: 'desc' },
      take: 20
    });

    const events = await prisma.researchEvent.findMany({
      where: { companyId },
      orderBy: { date: 'desc' },
      take: 10
    });

    return { evidence, events };
  }
}

export const researchRepository = new ResearchRepository();
