import type { MarketDataProvider, NewsProvider } from "../providers/types.js";
import type { 
  ResearchIntelligence, 
  SourceType, 
  FreshnessStatus,
  ResearchEvidenceCategory,
  EventType,
  ResearchThesisImpact
} from "../domains/research-intelligence/types.js";
import { getCompanyById } from "./company.service.js";
import { classifyFreshness, classifyMateriality } from "./materiality.service.js";
import { thesisRepository } from "../repositories/thesis.repository.js";
import { impactRepository } from "../repositories/impact.repository.js";
import { JarvisService } from "./jarvis.service.js";
import { providers } from "../config/providers.js";

export class ResearchIntelligenceService {
  constructor(
    private marketData: MarketDataProvider,
    private news: NewsProvider
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

    // 1. Fetch live data
    const [quote, articles] = await Promise.all([
      nseSymbol
        ? this.marketData.getQuote(nseSymbol)
        : Promise.resolve(null),
      this.news.getCompanyNews(companyId, { limit: 5 }),
    ]);

    // 2. Sync to Database
    const { researchRepository } = await import("../repositories/research.repository.js");
    
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

    // 3. Query the aggregated persistence layer
    const dbResearch = await researchRepository.getResearchForCompany(companyId);

    // --- Thesis Intelligence (Phase 5) ---
    // 4. If user is authenticated, check for unevaluated evidence against their thesis
    let dbImpacts: Array<{ evidenceId: string; impact: string; rationale: string }> = [];
    
    if (userId) {
      const theses = await thesisRepository.getUserTheses(userId);
      const thesis = theses.find(t => t.companyId === companyId && t.status !== "Invalidated");

      if (thesis) {
        // Find existing impacts
        const existingImpacts = await impactRepository.getImpactsForThesis(thesis.id);
        const evaluatedEvidenceIds = new Set(existingImpacts.map(i => i.evidenceId));

        // Find high/medium evidence not yet evaluated
        const unevaluatedEvidence = dbResearch.evidence
          .filter(e => (e.materiality === "high" || e.materiality === "medium") && !evaluatedEvidenceIds.has(e.id))
          .slice(0, 3); // Cap at 3 to prevent LLM timeouts during synchronous request

        if (unevaluatedEvidence.length > 0) {
          try {
            const jarvis = new JarvisService(providers.llm);
            // We need to parse the JSON strings in the thesis model
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

            // Save to DB
            await impactRepository.saveImpacts(
              newImpacts.map(imp => ({
                thesisId: thesis.id,
                evidenceId: imp.evidenceId,
                impact: imp.impact,
                rationale: imp.rationale,
              }))
            );

            // Combine with existing
            dbImpacts = [...existingImpacts, ...newImpacts];
          } catch (e) {
            console.error("[ResearchIntelligenceService] Failed to evaluate thesis impact", e);
            dbImpacts = existingImpacts;
          }
        } else {
          dbImpacts = existingImpacts;
        }
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
