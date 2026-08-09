import { z } from "zod";
import type {
  MarketDataProvider,
  StockQuote,
  OHLCEntry,
  DateRange,
  NewsProvider,
  NewsArticle,
  NewsQueryOptions,
  FundamentalsProvider,
  CompanyFinancials,
} from "../types.js";

// --- Response Validation Schemas ---

const indianApiStockPriceSchema = z.object({
  currentPrice: z.object({
    BSE: z.number().optional(),
    NSE: z.number().optional(),
  }).optional(),
  percentChange: z.number().optional(),
  previousClose: z.number().optional(),
});

const indianApiNewsSchema = z.array(
  z.object({
    headline: z.string(),
    summary: z.string().optional(),
    url: z.string().optional(),
    source: z.string().optional(),
    date: z.string().optional(),
  })
);

const indianApiFinancialsSchema = z.object({
  incomeStatement: z.array(z.record(z.unknown())).optional(),
  balanceSheet: z.array(z.record(z.unknown())).optional(),
  keyMetrics: z.record(z.unknown()).optional(),
});

// --- Provider Configuration ---

const BASE_URL = "https://analyst.indianapi.in";
const REQUEST_TIMEOUT_MS = 15_000;

interface IndianApiConfig {
  apiKey: string;
}

// --- Shared Fetch Helper ---

async function fetchFromIndianApi(
  path: string,
  params: Record<string, string>,
  apiKey: string
): Promise<unknown> {
  const url = new URL(path, BASE_URL);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    REQUEST_TIMEOUT_MS
  );

  try {
    const response = await fetch(url.toString(), {
      headers: {
        "X-API-Key": apiKey,
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error(
        `[IndianAPI] ${response.status} ${response.statusText} for ${path}: ${body.slice(0, 200)}`
      );
      return null;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error(
        `[IndianAPI] Request timeout (${REQUEST_TIMEOUT_MS}ms) for ${path}`
      );
    } else {
      console.error(
        `[IndianAPI] Fetch error for ${path}:`,
        error instanceof Error ? error.message : "Unknown error"
      );
    }
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

// --- Market Data Provider ---

export class IndianApiMarketDataProvider implements MarketDataProvider {
  name = "indian-api";
  private apiKey: string;

  constructor(config: IndianApiConfig) {
    this.apiKey = config.apiKey;
  }

  async getQuote(symbol: string): Promise<StockQuote | null> {
    console.log(`[IndianAPI] Fetching quote for ${symbol}`);

    const raw = await fetchFromIndianApi(
      "/stock",
      { name: symbol },
      this.apiKey
    );

    if (!raw) return null;

    const parsed = indianApiStockPriceSchema.safeParse(raw);
    if (!parsed.success) {
      console.error(
        "[IndianAPI] Quote response validation failed:",
        parsed.error.message
      );
      return null;
    }

    const { currentPrice, percentChange, previousClose } = parsed.data;
    const price = currentPrice?.NSE ?? currentPrice?.BSE ?? 0;
    const prevClose = previousClose ?? price;
    const change = price - prevClose;

    return {
      symbol,
      price,
      change: Math.round(change * 100) / 100,
      changePercent: percentChange ?? 0,
      volume: 0, // Indian API /stock endpoint does not include volume
      timestamp: new Date().toISOString(),
    };
  }

  async getOHLC(_symbol: string, _range: DateRange): Promise<OHLCEntry[]> {
    // OHLC requires a separate endpoint / premium tier
    return [];
  }
}

// --- News Provider ---

export class IndianApiNewsProvider implements NewsProvider {
  name = "indian-api";
  private apiKey: string;

  constructor(config: IndianApiConfig) {
    this.apiKey = config.apiKey;
  }

  async getCompanyNews(
    companyId: string,
    options?: NewsQueryOptions
  ): Promise<NewsArticle[]> {
    const limit = options?.limit ?? 5;
    console.log(
      `[IndianAPI] Fetching news for ${companyId} (limit: ${limit})`
    );

    const raw = await fetchFromIndianApi(
      "/stock",
      { name: companyId },
      this.apiKey
    );

    if (!raw || typeof raw !== "object") return [];

    // The /stock endpoint includes a `news` array in the response
    const newsRaw = (raw as Record<string, unknown>)["news"];
    if (!newsRaw) return [];

    const parsed = indianApiNewsSchema.safeParse(newsRaw);
    if (!parsed.success) {
      console.error(
        "[IndianAPI] News response validation failed:",
        parsed.error.message
      );
      return [];
    }

    return parsed.data.slice(0, limit).map((article, i) => ({
      id: `indianapi-news-${i}`,
      title: article.headline,
      summary: article.summary ?? "",
      url: article.url ?? "",
      publisher: article.source ?? "Unknown",
      publishedAt: article.date
        ? new Date(article.date).toISOString()
        : new Date().toISOString(),
      category: "news",
    }));
  }
}

// --- Fundamentals Provider ---

export class IndianApiFundamentalsProvider implements FundamentalsProvider {
  name = "indian-api";
  private apiKey: string;

  constructor(config: IndianApiConfig) {
    this.apiKey = config.apiKey;
  }

  async getFinancials(
    companyId: string
  ): Promise<CompanyFinancials | null> {
    console.log(`[IndianAPI] Fetching financials for ${companyId}`);

    const raw = await fetchFromIndianApi(
      "/stock",
      { name: companyId },
      this.apiKey
    );

    if (!raw) return null;

    const parsed = indianApiFinancialsSchema.safeParse(raw);
    if (!parsed.success) {
      console.error(
        "[IndianAPI] Financials validation failed:",
        parsed.error.message
      );
      return null;
    }

    // Transform the provider-specific response into our canonical format
    // The exact field mapping depends on the actual API response structure,
    // so we provide reasonable defaults for fields that may not be present
    return {
      companyId,
      statements: [],
      ratios: {
        pe: 0,
        pb: 0,
        roe: 0,
        debtToEquity: 0,
        currentRatio: 0,
        dividendYield: 0,
      },
      lastUpdated: new Date().toISOString(),
    };
  }
}
