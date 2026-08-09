import { Router } from "express";
import { ResearchIntelligenceService } from "../services/research-intelligence.service.js";
import { providers } from "../config/providers.js";

const router = Router();

// Wire providers from the central registry
const researchService = new ResearchIntelligenceService(
  providers.marketData,
  providers.news
);

// GET /api/companies/:companyId/research
router.get("/:companyId/research", async (req, res) => {
  try {
    const intelligence = await researchService.getResearchIntelligence(
      req.params["companyId"]!
    );

    if (!intelligence) {
      res.status(404).json({ error: "Research intelligence not found" });
      return;
    }

    res.json(intelligence);
  } catch (error) {
    console.error(
      "[Research] Error fetching research intelligence:",
      error instanceof Error ? error.message : "Unknown error"
    );
    res.status(503).json({
      error: "Research data is temporarily unavailable",
    });
  }
});

// GET /api/companies/:companyId/quote
router.get("/:companyId/quote", async (req, res) => {
  try {
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

    const quote = await providers.marketData.getQuote(nseSymbol);

    if (!quote) {
      res.status(404).json({ error: "Quote not available" });
      return;
    }

    res.json({ quote });
  } catch (error) {
    console.error(
      "[Research] Error fetching quote:",
      error instanceof Error ? error.message : "Unknown error"
    );
    res.status(503).json({
      error: "Market data is temporarily unavailable",
    });
  }
});

// GET /api/companies/:companyId/news
router.get("/:companyId/news", async (req, res) => {
  try {
    const articles = await providers.news.getCompanyNews(
      req.params["companyId"]!,
      { limit: 10 }
    );

    res.json({ articles });
  } catch (error) {
    console.error(
      "[Research] Error fetching news:",
      error instanceof Error ? error.message : "Unknown error"
    );
    res.status(503).json({
      error: "News data is temporarily unavailable",
    });
  }
});

export default router;
