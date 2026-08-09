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

  if (hasIndianApiKey) {
    console.log("[Nexora] Using Indian API providers (live data)");
    const config = { apiKey: env.INDIAN_API_KEY! };

    return {
      marketData: new IndianApiMarketDataProvider(config),
      news: new IndianApiNewsProvider(config),
      fundamentals: new IndianApiFundamentalsProvider(config),
      llm: new MockLLMProvider(),
    };
  }

  console.log("[Nexora] Using mock providers (no API keys configured)");
  return {
    marketData: new MockMarketDataProvider(),
    news: new MockNewsProvider(),
    fundamentals: new MockFundamentalsProvider(),
    llm: new MockLLMProvider(),
  };
}

export const providers = createProviderRegistry();
