import { env } from "../config/env.js";
import type {
  MarketDataProvider,
  NewsProvider,
  FundamentalsProvider,
  LLMProvider,
} from "../providers/types.js";
import { MockMarketDataProvider } from "../providers/market-data/mock.provider.js";
import { MockNewsProvider } from "../providers/news/mock.provider.js";
import { MockFundamentalsProvider } from "../providers/fundamentals/mock.provider.js";
import { MockLLMProvider } from "../providers/llm/mock.provider.js";
import {
  IndianApiMarketDataProvider,
  IndianApiNewsProvider,
  IndianApiFundamentalsProvider,
} from "../providers/indian-api/indian-api.provider.js";
import { GeminiProvider } from "../providers/gemini/gemini.provider.js";

/**
 * Provider registry — single source of truth for which providers are active.
 *
 * When an API key is available, the real provider is used.
 * When no key is available, the mock provider is used automatically.
 * This allows the full pipeline to work in development without credentials.
 */

export interface ProviderRegistry {
  marketData: MarketDataProvider;
  news: NewsProvider;
  fundamentals: FundamentalsProvider;
  llm: LLMProvider;
}

function createProviderRegistry(): ProviderRegistry {
  const hasIndianApiKey = !!env.INDIAN_API_KEY;
  const hasGeminiKey = !!env.GEMINI_API_KEY;

  let marketData: MarketDataProvider = new MockMarketDataProvider();
  let news: NewsProvider = new MockNewsProvider();
  let fundamentals: FundamentalsProvider = new MockFundamentalsProvider();
  let llm: LLMProvider = new MockLLMProvider();

  if (hasIndianApiKey) {
    console.log("[Nexora] Using Indian API providers (live data)");
    const config = { apiKey: env.INDIAN_API_KEY! };
    marketData = new IndianApiMarketDataProvider(config);
    news = new IndianApiNewsProvider(config);
    fundamentals = new IndianApiFundamentalsProvider(config);
  }

  if (hasGeminiKey) {
    console.log("[Nexora] Using Gemini LLM provider (live AI)");
    llm = new GeminiProvider({ apiKey: env.GEMINI_API_KEY! });
  } else {
    console.log("[Nexora] Using mock LLM provider (no Gemini key)");
  }

  if (!hasIndianApiKey) {
      console.log("[Nexora] Using mock market/news providers (no Indian API key)");
  }

  return { marketData, news, fundamentals, llm };
}

export const providers = createProviderRegistry();
