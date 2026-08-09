import type {
  FundamentalsProvider,
  CompanyFinancials,
} from "../types.js";

export class MockFundamentalsProvider implements FundamentalsProvider {
  name = "mock";

  async getFinancials(companyId: string): Promise<CompanyFinancials | null> {
    const data: Record<string, CompanyFinancials> = {
      "hdfc-bank": {
        companyId: "hdfc-bank",
        statements: [
          {
            period: "Q1 FY27",
            revenue: 62_450,
            netProfit: 16_820,
            operatingMargin: 0.342,
            eps: 22.05,
          },
          {
            period: "Q4 FY26",
            revenue: 59_800,
            netProfit: 15_980,
            operatingMargin: 0.328,
            eps: 20.94,
          },
          {
            period: "Q3 FY26",
            revenue: 57_200,
            netProfit: 14_650,
            operatingMargin: 0.315,
            eps: 19.2,
          },
        ],
        ratios: {
          pe: 22.4,
          pb: 3.1,
          roe: 16.8,
          debtToEquity: 0.0,
          currentRatio: 0.0,
          dividendYield: 1.1,
        },
        lastUpdated: "2026-07-28T06:30:00Z",
      },
    };

    return data[companyId] ?? null;
  }
}
