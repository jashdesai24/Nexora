import { prisma } from '../config/db.js';

export interface CreateThesisPayload {
  userId: string;
  companyId: string;
  statement: string;
  supportingReasons: string[];
  risks: string[];
  invalidationCriteria: string[];
  conviction: number;
  timeHorizon: string;
}

export class ThesisRepository {
  async createThesis(data: CreateThesisPayload) {
    return prisma.$transaction(async (tx) => {
      const thesis = await tx.investmentThesis.create({
        data: {
          userId: data.userId,
          companyId: data.companyId,
          statement: data.statement,
          supportingReasons: JSON.stringify(data.supportingReasons),
          risks: JSON.stringify(data.risks),
          invalidationCriteria: JSON.stringify(data.invalidationCriteria),
          conviction: data.conviction,
          timeHorizon: data.timeHorizon,
          status: "DRAFT",
        },
      });

      await tx.investmentThesisVersion.create({
        data: {
          thesisId: thesis.id,
          statement: thesis.statement,
          supportingReasons: thesis.supportingReasons,
          risks: thesis.risks,
          invalidationCriteria: thesis.invalidationCriteria,
          conviction: thesis.conviction,
          timeHorizon: thesis.timeHorizon,
        },
      });

      return thesis;
    });
  }

  async getThesisById(id: string, userId: string) {
    const thesis = await prisma.investmentThesis.findUnique({
      where: { id },
    });
    
    if (!thesis || thesis.userId !== userId) {
      return null;
    }

    // Parse the JSON stringified arrays back into real arrays
    return {
      ...thesis,
      supportingReasons: JSON.parse(thesis.supportingReasons),
      risks: JSON.parse(thesis.risks),
      invalidationCriteria: JSON.parse(thesis.invalidationCriteria),
    };
  }

  async updateThesis(id: string, userId: string, data: Partial<CreateThesisPayload>) {
    const thesis = await prisma.investmentThesis.findUnique({ where: { id } });
    if (!thesis || thesis.userId !== userId) {
      throw new Error("Unauthorized or not found");
    }

    const updateData: Record<string, string | number> = {};
    if (data.statement !== undefined) updateData.statement = data.statement;
    if (data.conviction !== undefined) updateData.conviction = data.conviction;
    if (data.timeHorizon !== undefined) updateData.timeHorizon = data.timeHorizon;
    
    if (data.supportingReasons !== undefined) updateData.supportingReasons = JSON.stringify(data.supportingReasons);
    if (data.risks !== undefined) updateData.risks = JSON.stringify(data.risks);
    if (data.invalidationCriteria !== undefined) updateData.invalidationCriteria = JSON.stringify(data.invalidationCriteria);

    const updated = await prisma.$transaction(async (tx) => {
      const updatedThesis = await tx.investmentThesis.update({
        where: { id },
        data: updateData
      });

      await tx.investmentThesisVersion.create({
        data: {
          thesisId: updatedThesis.id,
          statement: updatedThesis.statement,
          supportingReasons: updatedThesis.supportingReasons,
          risks: updatedThesis.risks,
          invalidationCriteria: updatedThesis.invalidationCriteria,
          conviction: updatedThesis.conviction,
          timeHorizon: updatedThesis.timeHorizon,
        },
      });

      return updatedThesis;
    });

    return {
      ...updated,
      supportingReasons: JSON.parse(updated.supportingReasons),
      risks: JSON.parse(updated.risks),
      invalidationCriteria: JSON.parse(updated.invalidationCriteria),
    };
  }

  async getUserTheses(userId: string) {
    const theses = await prisma.investmentThesis.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' }
    });

    return theses.map(t => ({
      ...t,
      supportingReasons: JSON.parse(t.supportingReasons),
      risks: JSON.parse(t.risks),
      invalidationCriteria: JSON.parse(t.invalidationCriteria),
    }));
  }

  async getThesisVersions(thesisId: string, userId: string) {
    const thesis = await prisma.investmentThesis.findUnique({ where: { id: thesisId } });
    if (!thesis || thesis.userId !== userId) {
      throw new Error("Unauthorized or not found");
    }

    const versions = await prisma.investmentThesisVersion.findMany({
      where: { thesisId },
      orderBy: { createdAt: 'desc' }
    });

    return versions.map(v => ({
      ...v,
      supportingReasons: JSON.parse(v.supportingReasons),
      risks: JSON.parse(v.risks),
      invalidationCriteria: JSON.parse(v.invalidationCriteria),
    }));
  }
}

export const thesisRepository = new ThesisRepository();
