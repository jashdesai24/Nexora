import { Router } from "express";
import { ResearchIntelligenceService } from "../services/research-intelligence.service.js";
import { MockMarketDataProvider } from "../providers/market-data/mock.provider.js";
import { MockNewsProvider } from "../providers/news/mock.provider.js";

const router = Router();

// Wire providers — swappable by changing only these lines
const marketData = new MockMarketDataProvider();
const news = new MockNewsProvider();
const researchService = new ResearchIntelligenceService(marketData, news);

// GET /api/companies/:companyId/research
router.get("/:companyId/research", async (req, res) => {
  const intelligence = await researchService.getResearchIntelligence(
    req.params["companyId"]!
  );

  if (!intelligence) {
    res.status(404).json({ error: "Research intelligence not found" });
    return;
  }

  res.json(intelligence);
});

// GET /api/companies/:companyId/quote
router.get("/:companyId/quote", async (req, res) => {
  const { getCompanyById } = await import(
    "../services/company.service.js"
  );
  const company = getCompanyById(req.params["companyId"]!);

  if (!company) {
    res.status(404).json({ error: "Company not found" });
    return;
  }

  const nseSymbol = company.listings.find(
    (l) => l.exchange === "NSE"
  )?.symbol;

  if (!nseSymbol) {
    res.status(404).json({ error: "No NSE listing found" });
    return;
  }

  const quote = await marketData.getQuote(nseSymbol);

  if (!quote) {
    res.status(404).json({ error: "Quote not available" });
    return;
  }

  res.json({ quote });
});

// GET /api/companies/:companyId/news
router.get("/:companyId/news", async (req, res) => {
  const articles = await news.getCompanyNews(req.params["companyId"]!, {
    limit: 10,
  });

  res.json({ articles });
});

export default router;
