import { Router } from "express";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { watchlistRepository } from "../repositories/watchlist.repository.js";
import { ResearchIntelligenceService } from "../services/research-intelligence.service.js";
import { JarvisService } from "../services/jarvis.service.js";
import { providers } from "../config/providers.js";

export const briefingRoutes = Router();

briefingRoutes.use(requireAuth);

briefingRoutes.post("/generate", async (req: AuthenticatedRequest, res, next) => {
  try {
    const watchlist = await watchlistRepository.getUserWatchlist(req.userId!);
    
    if (watchlist.length === 0) {
      return res.json({ briefings: [] });
    }

    const researchService = new ResearchIntelligenceService(
      providers.marketData
    );
    const jarvisService = new JarvisService(providers.llm);

    // Fetch recent evidence for all watchlisted companies
    const companiesData = await Promise.all(
      watchlist.map(async (company) => {
        const intelligence = await researchService.getResearchIntelligence(company.id);
        
        if (!intelligence) {
          return {
            companyId: company.id,
            companyName: company.name,
            evidence: [],
          };
        }

        // Only use fresh/recent evidence to avoid long prompts with stale data
        const recentEvidence = intelligence.evidence
          .filter((e) => e.provenance.freshness === "fresh" || e.provenance.freshness === "recent")
          .map((e) => ({
            id: e.id,
            title: e.title,
            summary: e.summary,
          }));

        return {
          companyId: company.id,
          companyName: company.name,
          evidence: recentEvidence,
        };
      })
    );

    const briefings = await jarvisService.generateDailyBriefing(companiesData);

    res.json(briefings);
  } catch (error) {
    next(error);
  }
});
