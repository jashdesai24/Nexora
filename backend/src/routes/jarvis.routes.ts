import { Router } from "express";
import { z } from "zod";
import { JarvisService } from "../services/jarvis.service.js";
import { MockLLMProvider } from "../providers/llm/mock.provider.js";

const router = Router();

const llm = new MockLLMProvider();
const jarvisService = new JarvisService(llm);

// Input validation schema
const reviewInputSchema = z.object({
  thesisId: z.string().min(1),
  thesis: z.string().min(1),
  supportingReasons: z.array(z.string()),
  risks: z.array(z.string()),
  invalidationCriteria: z.array(z.string()),
  conviction: z.number().min(0).max(100),
  timeHorizon: z.string().min(1),
  evidenceContext: z.array(z.string()).optional(),
});

// POST /api/jarvis/review
router.post("/review", async (req, res) => {
  const parsed = reviewInputSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      error: "Invalid review input",
      details: parsed.error.format(),
    });
    return;
  }

  const review = await jarvisService.reviewThesis(parsed.data);
  res.json(review);
});

export default router;
