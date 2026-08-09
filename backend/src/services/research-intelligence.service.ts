import type { MarketDataProvider, NewsProvider } from "../providers/types.js";
import type { 
  ResearchIntelligence, 
  SourceType, 
  ResearchEvidenceCategory,
  EventType
} from "../domains/research-intelligence/types.js";
import { getCompanyById } from "./company.service.js";

export class ResearchIntelligenceService {
  constructor(
    private marketData: MarketDataProvider,
    private news: NewsProvider
  ) {}

  async getResearchIntelligence(
    companyId: string
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

      await researchRepository.upsertEvidence({
        companyId,
        sourceId: source.id,
        title: article.title,
        summary: article.summary,
        url: article.url,
        category: "fundamentals", // generic category for now
        publishedAt: new Date(article.publishedAt),
      });
    }

    // 3. Query the aggregated persistence layer
    const dbResearch = await researchRepository.getResearchForCompany(companyId);
    
    // 4. Format for frontend contract
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
        impact: "mixed" as const, // Currently hardcoded unless analyzed
        provenance: {
          sourceId: ev.source.id,
          sourceUrl: ev.url || "",
          publisher: ev.source.name,
          publishedAt: ev.publishedAt.toISOString(),
          fetchedAt: ev.retrievedAt.toISOString(),
          updatedAt: ev.retrievedAt.toISOString(),
          sourceType: ev.source.type as SourceType,
          freshness: "fresh" as const,
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
      thesisImpacts: [],
    };
  }
}
