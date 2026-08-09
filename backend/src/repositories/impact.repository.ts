import { prisma } from "../config/db.js";

export interface SaveImpactPayload {
  thesisId: string;
  evidenceId: string;
  impact: string; // "supports" | "weakens" | "neutral" | "uncertain"
  rationale: string;
}

export class ImpactRepository {
  /**
   * Saves or updates thesis impact evaluations.
   */
  async saveImpacts(impacts: SaveImpactPayload[]) {
    if (impacts.length === 0) return [];

    // SQLite doesn't natively support createMany with skipDuplicates in a way Prisma likes for all drivers.
    // So we'll upsert them individually within a transaction.
    return prisma.$transaction(
      impacts.map((impact) =>
        prisma.thesisImpact.upsert({
          where: {
            thesisId_evidenceId: {
              thesisId: impact.thesisId,
              evidenceId: impact.evidenceId,
            },
          },
          update: {
            impact: impact.impact,
            rationale: impact.rationale,
          },
          create: {
            thesisId: impact.thesisId,
            evidenceId: impact.evidenceId,
            impact: impact.impact,
            rationale: impact.rationale,
          },
        })
      )
    );
  }

  /**
   * Gets all impacts for a specific thesis.
   */
  async getImpactsForThesis(thesisId: string) {
    return prisma.thesisImpact.findMany({
      where: { thesisId },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Gets all impacts for a specific company's active thesis for a user.
   * This bridges the gap between Company/User and Evidence Impacts.
   */
  async getImpactsForCompanyAndUser(companyId: string, userId: string) {
    // 1. Find the user's thesis for this company
    const thesis = await prisma.investmentThesis.findFirst({
      where: { companyId, userId },
    });

    if (!thesis) return [];

    // 2. Fetch impacts for this thesis
    return this.getImpactsForThesis(thesis.id);
  }
}

export const impactRepository = new ImpactRepository();
