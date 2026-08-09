import type { MarketDataProvider, NewsProvider } from "../providers/types.js";
import type { ResearchIntelligence } from "../domains/research-intelligence/types.js";
import { getCompanyById } from "./company.service.js";

/**
 * Research intelligence service.
 * Aggregates data from market data and news providers into the
 * ResearchIntelligence contract consumed by the frontend.
 *
 * Currently returns mock-structured data.
 * When real providers are wired, this service orchestrates the
 * provider calls, normalizes the responses, and assembles the aggregate.
 */
export class ResearchIntelligenceService {
  constructor(
    private marketData: MarketDataProvider,
    private news: NewsProvider
  ) {}

  async getResearchIntelligence(
    companyId: string
  ): Promise<ResearchIntelligence | null> {
    const company = getCompanyById(companyId);
    if (!company) return null;

    const nseSymbol = company.listings.find(
      (l) => l.exchange === "NSE"
    )?.symbol;

    // Fetch from providers in parallel
    const [quote, articles] = await Promise.all([
      nseSymbol
        ? this.marketData.getQuote(nseSymbol)
        : Promise.resolve(null),
      this.news.getCompanyNews(companyId, { limit: 5 }),
    ]);

    const now = new Date().toISOString();

    // Transform provider data into the research intelligence contract
    const sources = articles.map((article, i) => ({
      id: `src-${i + 1}`,
      title: article.title,
      publisher: article.publisher,
      url: article.url,
      publishedAt: article.publishedAt,
      sourceType: "news" as const,
    }));

    const evidence = articles.map((article, i) => ({
      id: `ev-${i + 1}`,
      companyId,
      title: article.title,
      summary: article.summary,
      source: sources[i]!,
      publishedAt: article.publishedAt,
      category: "fundamentals" as const,
      impact: "mixed" as const,
      provenance: {
        sourceId: sources[i]!.id,
        sourceUrl: article.url,
        publisher: article.publisher,
        publishedAt: article.publishedAt,
        fetchedAt: now,
        updatedAt: now,
        sourceType: "news" as const,
        freshness: "fresh" as const,
      },
    }));

    return {
      companyId,
      companyName: company.name,
      generatedAt: now,
      evidence,
      events: [],
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
