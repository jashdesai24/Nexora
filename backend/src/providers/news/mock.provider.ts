import type {
  NewsProvider,
  NewsArticle,
  NewsQueryOptions,
} from "../types.js";

export class MockNewsProvider implements NewsProvider {
  name = "mock";

  async getCompanyNews(
    companyId: string,
    options?: NewsQueryOptions
  ): Promise<NewsArticle[]> {
    const limit = options?.limit ?? 5;

    const articles: Record<string, NewsArticle[]> = {
      "hdfc-bank": [
        {
          id: "news-1",
          title: "HDFC Bank Q1 FY27 net profit rises 21% to ₹16,820 crore",
          summary:
            "HDFC Bank reported a 21% year-over-year increase in net profit for Q1 FY27, driven by improving net interest margins and controlled credit costs.",
          url: "https://economictimes.indiatimes.com/industry/banking",
          publisher: "The Economic Times",
          publishedAt: "2026-07-28T08:00:00Z",
          category: "earnings",
        },
        {
          id: "news-2",
          title:
            "RBI proposes tighter LCR norms for digitally-sourced deposits",
          summary:
            "The Reserve Bank of India has released a draft circular proposing higher liquidity coverage requirements for deposits sourced through digital channels.",
          url: "https://www.livemint.com/industry/banking",
          publisher: "Mint",
          publishedAt: "2026-07-15T10:00:00Z",
          category: "regulatory",
        },
        {
          id: "news-3",
          title: "HDFC Bank adds 200 branches in Q1, targets semi-urban growth",
          summary:
            "HDFC Bank accelerated its branch expansion in Q1 FY27, adding 200 new branches primarily in semi-urban and rural markets.",
          url: "https://www.business-standard.com/companies",
          publisher: "Business Standard",
          publishedAt: "2026-07-30T07:00:00Z",
          category: "corporate",
        },
        {
          id: "news-4",
          title:
            "HDFC Bank merger integration reaches 85% completion on tech platform",
          summary:
            "Management indicated that technology platform migration from legacy HDFC Ltd systems has reached 85% completion, with full consolidation expected by Q3 FY27.",
          url: "https://www.moneycontrol.com/news/business/banks",
          publisher: "Moneycontrol",
          publishedAt: "2026-07-28T14:00:00Z",
          category: "corporate",
        },
        {
          id: "news-5",
          title: "CASA ratio improves to 43.2% post-merger for HDFC Bank",
          summary:
            "HDFC Bank's Current Account Savings Account ratio improved 40 bps sequentially to 43.2%, indicating the deposit franchise is absorbing the merged book.",
          url: "https://www.financialexpress.com/market/stock-market",
          publisher: "Financial Express",
          publishedAt: "2026-07-29T09:00:00Z",
          category: "fundamentals",
        },
      ],
    };

    return (articles[companyId] ?? []).slice(0, limit);
  }
}
