import type { JarvisReview } from "./types";
import { mockHdfcReview } from "./mock";
import { getInvestmentThesis } from "../investment-thesis/service"; // Need this to pass the thesis payload to the backend

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

/**
 * Retrieves the Jarvis review for a specific investment thesis.
 *
 * Strategy:
 * 1. Fetch the thesis locally.
 * 2. Try the backend API first (live Gemini or mock LLM provider)
 * 3. Fall back to frontend mock data if the backend is unavailable
 */
export async function getJarvisReview(
  thesisId: string
): Promise<JarvisReview | null> {
  const thesis = await getInvestmentThesis(thesisId);

  if (!thesis) return null;

  try {
    const payload = {
      thesisId: thesis.id,
      thesis: thesis.thesis, // Note: it's thesis.thesis not thesis.statement
      supportingReasons: thesis.supportingReasons, // These are already strings
      risks: thesis.risks, // These are already strings
      invalidationCriteria: thesis.invalidationCriteria, // These are already strings
      conviction: thesis.conviction, // Note: conviction not convictionScore
      timeHorizon: thesis.timeHorizon,
    };

    const response = await fetch(`${API_BASE}/api/jarvis/review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(30_000), // Give LLM more time
    });

    if (response.ok) {
      const data: JarvisReview = await response.json();
      return data;
    }

    console.warn(
      `[JarvisService] Backend returned ${response.status}, falling back to mock`
    );
  } catch (error) {
    console.warn("[JarvisService] Backend unavailable, using mock data", error);
  }

  // Fallback to frontend mock data
  if (thesisId === "thesis-hdfc-2026") {
    return mockHdfcReview;
  }

  return null;
}
