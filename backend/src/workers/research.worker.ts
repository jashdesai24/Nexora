import { Worker, Job } from 'bullmq';
import { redisConnection } from '../config/redis.js';
import { RESEARCH_QUEUE_NAME, ResearchIngestionJob } from '../jobs/research.jobs.js';
import { getCompanyById } from '../services/company.service.js';
import { providers } from '../config/providers.js';
import { classifyFreshness, classifyMateriality } from '../services/materiality.service.js';
import { thesisRepository } from '../repositories/thesis.repository.js';
import { impactRepository } from '../repositories/impact.repository.js';
import { notificationRepository } from '../repositories/notification.repository.js';
import { JarvisService } from '../services/jarvis.service.js';
import { researchRepository } from '../repositories/research.repository.js';

const processResearchIngestion = async (job: Job<ResearchIngestionJob>) => {
  const { companyId, userId, forceRefresh } = job.data;
  const company = await getCompanyById(companyId);
  
  if (!company) {
    throw new Error(`Company ${companyId} not found`);
  }

  const nseSymbol = company.identifiers.find(l => l.type === "NSE")?.value;

  console.log(`[Worker] Starting research ingestion for ${company.name}`);

  // 1. Fetch live data
  const [, articles] = await Promise.all([
    nseSymbol ? providers.marketData.getQuote(nseSymbol) : Promise.resolve(null),
    providers.news.getCompanyNews(companyId, { limit: 5 }),
  ]);

  // 2. Sync to Database
  for (const article of articles) {
    const source = await researchRepository.ensureSourceExists({
      name: article.publisher,
      type: "news",
    });

    const publishedDate = new Date(article.publishedAt);

    await researchRepository.upsertEvidence({
      companyId,
      sourceId: source.id,
      title: article.title,
      summary: article.summary,
      url: article.url,
      category: "fundamentals",
      freshness: classifyFreshness(publishedDate),
      materiality: classifyMateriality(article.title, article.summary),
      publishedAt: publishedDate,
    });
  }

  // 3. Optional: Jarvis Analysis for active theses (cost-controlled)
  // Only evaluate impact if this job was triggered by a user action and forceRefresh is true, 
  // or via a specific thesis-evaluation queue. To keep costs low, we don't automatically call Gemini for every ingestion event.
  if (userId && forceRefresh) {
    const theses = await thesisRepository.getUserTheses(userId);
    const thesis = theses.find(t => t.companyId === companyId && t.status !== "Invalidated");

    if (thesis) {
      const dbResearch = await researchRepository.getResearchForCompany(companyId);
      const existingImpacts = await impactRepository.getImpactsForThesis(thesis.id);
      const evaluatedEvidenceIds = new Set(existingImpacts.map(i => i.evidenceId));

      const unevaluatedEvidence = dbResearch.evidence
        .filter(e => (e.materiality === "high" || e.materiality === "medium") && !evaluatedEvidenceIds.has(e.id))
        .slice(0, 3); // Bounded to 3 items per job

      if (unevaluatedEvidence.length > 0) {
        try {
          const jarvis = new JarvisService(providers.llm);
          const parsedThesis = {
            statement: thesis.statement,
            supportingReasons: JSON.parse(thesis.supportingReasons),
            risks: JSON.parse(thesis.risks),
            invalidationCriteria: JSON.parse(thesis.invalidationCriteria),
          };

          const newImpacts = await jarvis.evaluateEvidenceImpact(
            parsedThesis,
            unevaluatedEvidence.map(e => ({ id: e.id, title: e.title, summary: e.summary }))
          );

          await impactRepository.saveImpacts(
            newImpacts.map(imp => ({
              thesisId: thesis.id,
              evidenceId: imp.evidenceId,
              impact: imp.impact,
              rationale: imp.rationale,
            }))
          );

          const hasWeakened = newImpacts.some(imp => imp.impact === 'weakens');
          if (hasWeakened) {
            await notificationRepository.createNotification({
              userId,
              title: "Thesis assumption challenged",
              message: `New evidence may challenge a core thesis assumption for ${company.name}.`,
              type: "THESIS_WEAKENED",
              link: `/companies/${companyId}/thesis`
            });
          }
        } catch (e) {
          console.error("[Worker] Failed to evaluate thesis impact", e);
          throw e; // Let BullMQ retry this job
        }
      }
    }
  }

  console.log(`[Worker] Completed research ingestion for ${company.name}`);
};

export const researchWorker = new Worker<ResearchIngestionJob>(
  RESEARCH_QUEUE_NAME,
  processResearchIngestion,
  {
    connection: redisConnection,
    concurrency: 5, // Process up to 5 companies concurrently
  }
);

researchWorker.on('completed', (job) => {
  console.log(`[Worker] Job ${job.id} completed successfully`);
});

researchWorker.on('failed', (job, err) => {
  console.error(`[Worker] Job ${job?.id} failed:`, err);
});
