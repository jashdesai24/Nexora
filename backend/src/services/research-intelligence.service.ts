import type { MarketDataProvider } from "../providers/types.js";
import type { 
  ResearchIntelligence, 
  SourceType, 
  FreshnessStatus,
  ResearchEvidenceCategory,
  EventType,
  ResearchThesisImpact
} from "../domains/research-intelligence/types.js";
import { getCompanyById } from "./company.service.js";
import { thesisRepository } from "../repositories/thesis.repository.js";
import { impactRepository } from "../repositories/impact.repository.js";

export class ResearchIntelligenceService {
  constructor(
    private marketData: MarketDataProvider
  ) {}

  async getResearchIntelligence(
    companyId: string,
    userId?: string
  ): Promise<ResearchIntelligence | null> {
    const company = await getCompanyById(companyId);
    if (!company) return null;

    const nseSymbol = company.identifiers.find(
      (l) => l.type === "NSE"
    )?.value;

    // 1. Fetch live quote synchronously for immediate UI feedback
    const quote = nseSymbol ? await this.marketData.getQuote(nseSymbol) : null;

    // 2. Trigger background ingestion asynchronously (fire and forget)
    // We only trigger this to keep the cache fresh. It doesn't block the API response.
    const { enqueueResearchIngestion } = await import("../jobs/research.jobs.js");
    enqueueResearchIngestion({ companyId, userId, forceRefresh: true }).catch(err => {
      console.error("[ResearchIntelligenceService] Failed to enqueue research ingestion", err);
    });

    // 2. Query the aggregated persistence layer for immediate response
    const { researchRepository } = await import("../repositories/research.repository.js");
    const dbResearch = await researchRepository.getResearchForCompany(companyId);

    // --- Thesis Intelligence (Phase 5) ---
    // 3. Return existing evaluations from the DB. 
    // The background worker will asynchronously evaluate new evidence and send notifications if needed.
    let dbImpacts: Array<{ evidenceId: string; impact: string; rationale: string }> = [];
    
    if (userId) {
      const theses = await thesisRepository.getUserTheses(userId);
      const thesis = theses.find(t => t.companyId === companyId && t.status !== "Invalidated");

      if (thesis) {
        dbImpacts = await impactRepository.getImpactsForThesis(thesis.id);
      }
    }

    // 5. Format for frontend contract
    const now = new Date().toISOString();
    
    // Extract unique sources for the frontend
    const sourceMap = new Map();
    const evidence = dbResearch.evidence.map((ev) => {
      sourceMap.set(ev.source.id, {
        id: ev.source.id,
        title: ev.source.name, // The UI expects a title for the source
        publisher: ev.source.name,
        url: ev.url || "", // Or an aggregator URL if source URL doesn't exist
        publishedAt: ev.publishedAt.toISOString(),
        sourceType: ev.source.type as SourceType,
      });

      return {
        id: ev.id,
        companyId,
        title: ev.title,
        summary: ev.summary || "",
        source: sourceMap.get(ev.source.id)!,
        publishedAt: ev.publishedAt.toISOString(),
        category: ev.category as ResearchEvidenceCategory,
        impact: "mixed" as const,
        freshness: (ev.freshness || "fresh") as FreshnessStatus,
        materiality: (ev.materiality || "unknown") as string,
        provenance: {
          sourceId: ev.source.id,
          sourceUrl: ev.url || "",
          publisher: ev.source.name,
          publishedAt: ev.publishedAt.toISOString(),
          fetchedAt: ev.retrievedAt.toISOString(),
          updatedAt: ev.retrievedAt.toISOString(),
          sourceType: ev.source.type as SourceType,
          freshness: (ev.freshness || "fresh") as FreshnessStatus,
        },
      };
    });

    const sources = Array.from(sourceMap.values());

    return {
      companyId,
      companyName: company.name,
      generatedAt: now,
      evidence,
      events: dbResearch.events.map(e => ({
        id: e.id,
        companyId: e.companyId,
        title: e.title,
        description: e.summary || "",
        eventType: e.type as EventType,
        occurredAt: e.date.toISOString(),
        source: {
          id: "sys-event",
          title: "System",
          publisher: "System",
          url: "",
          publishedAt: e.createdAt.toISOString(),
          sourceType: "news" as SourceType
        }
      })),
      sources,
      keyChanges: quote
        ? [
            {
              id: "kc-price",
              title: `${nseSymbol} at ₹${quote.price.toLocaleString()} (${quote.changePercent >= 0 ? "+" : ""}${quote.changePercent.toFixed(2)}%)`,
              description: `Current market price with volume of ${quote.volume.toLocaleString()} shares traded.`,
              direction:
                quote.changePercent > 0
                  ? ("improving" as const)
                  : quote.changePercent < 0
                    ? ("deteriorating" as const)
                    : ("stable" as const),
            },
          ]
        : [],
      thesisImpacts: dbImpacts.map(imp => ({
        evidenceId: imp.evidenceId,
        impact: imp.impact as ResearchThesisImpact,
        rationale: imp.rationale,
      })),
    };
  }
}
