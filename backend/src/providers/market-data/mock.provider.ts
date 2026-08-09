import type {
  MarketDataProvider,
  StockQuote,
  OHLCEntry,
  DateRange,
} from "../types.js";

export class MockMarketDataProvider implements MarketDataProvider {
  name = "mock";

  async getQuote(symbol: string): Promise<StockQuote | null> {
    const quotes: Record<string, StockQuote> = {
      HDFCBANK: {
        symbol: "HDFCBANK",
        price: 1842.5,
        change: 18.35,
        changePercent: 1.01,
        volume: 8_420_000,
        timestamp: new Date().toISOString(),
      },
      RELIANCE: {
        symbol: "RELIANCE",
        price: 2965.75,
        change: -12.4,
        changePercent: -0.42,
        volume: 5_130_000,
        timestamp: new Date().toISOString(),
      },
      TCS: {
        symbol: "TCS",
        price: 4120.0,
        change: 34.2,
        changePercent: 0.84,
        volume: 3_210_000,
        timestamp: new Date().toISOString(),
      },
    };

    return quotes[symbol] ?? null;
  }

  async getOHLC(_symbol: string, _range: DateRange): Promise<OHLCEntry[]> {
    // Return empty for mock — OHLC is not needed for MVP
    return [];
  }
}
