// --- Provider Interfaces ---
// Each provider can be swapped without changing services or routes.

// --- Market Data ---

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: string;
}

export interface OHLCEntry {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface DateRange {
  from: string;
  to: string;
}

export interface MarketDataProvider {
  name: string;
  getQuote(symbol: string): Promise<StockQuote | null>;
  getOHLC(symbol: string, range: DateRange): Promise<OHLCEntry[]>;
}

// --- Fundamentals ---

export interface FinancialStatement {
  period: string;
  revenue: number;
  netProfit: number;
  operatingMargin: number;
  eps: number;
}

export interface KeyRatios {
  pe: number;
  pb: number;
  roe: number;
  debtToEquity: number;
  currentRatio: number;
  dividendYield: number;
}

export interface CompanyFinancials {
  companyId: string;
  statements: FinancialStatement[];
  ratios: KeyRatios;
  lastUpdated: string;
}

export interface FundamentalsProvider {
  name: string;
  getFinancials(companyId: string): Promise<CompanyFinancials | null>;
}

// --- News ---

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  publisher: string;
  publishedAt: string;
  category: string;
}

export interface NewsQueryOptions {
  limit?: number;
  fromDate?: string;
}

export interface NewsProvider {
  name: string;
  getCompanyNews(
    companyId: string,
    options?: NewsQueryOptions
  ): Promise<NewsArticle[]>;
}

// --- LLM ---

export interface LLMRequest {
  systemPrompt: string;
  userPrompt: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  responseSchema?: Record<string, any>;
}

export interface LLMResponse {
  content: string;
  model: string;
  tokensUsed: number;
}

export interface LLMProvider {
  name: string;
  analyze(request: LLMRequest): Promise<LLMResponse>;
}
