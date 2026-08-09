import { prisma } from '../config/db.js';

export interface SaveReviewPayload {
  thesisId: string;
  overallAssessment: string;
  strengths: unknown;
  gaps: unknown;
  questions: unknown;
  thesisQuality: string;
  confidenceAssessment: string;
}

export class JarvisRepository {
  async saveReview(data: SaveReviewPayload) {
    return prisma.jarvisReview.create({
      data: {
        thesisId: data.thesisId,
        overallAssessment: data.overallAssessment,
        strengths: JSON.stringify(data.strengths),
        gaps: JSON.stringify(data.gaps),
        questions: JSON.stringify(data.questions),
        thesisQuality: data.thesisQuality,
        confidenceAssessment: data.confidenceAssessment,
      }
    });
  }

  async getLatestReview(thesisId: string) {
    const review = await prisma.jarvisReview.findFirst({
      where: { thesisId },
      orderBy: { createdAt: 'desc' }
    });

    if (!review) return null;

    return {
      ...review,
      strengths: JSON.parse(review.strengths),
      gaps: JSON.parse(review.gaps),
      questions: JSON.parse(review.questions),
    };
  }
}

export const jarvisRepository = new JarvisRepository();
