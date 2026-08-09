import type { JarvisReview } from "./types";
import type { InvestmentThesis } from "../investment-thesis/types";
import { mockHdfcReview } from "./mock";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

function getHeaders() {
  const token = localStorage.getItem('nexora_token');
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {})
  };
}

export async function getSavedJarvisReview(thesisId: string): Promise<JarvisReview | null> {
  try {
    const response = await fetch(`${API_BASE}/api/jarvis/review/${thesisId}`, {
      headers: getHeaders()
    });
    
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn("[JarvisService] Could not fetch saved review", error);
  }
  return null;
}

export async function getJarvisReview(
  thesis: InvestmentThesis
): Promise<JarvisReview | null> {
  try {
    const payload = {
      thesisId: thesis.id,
      thesis: thesis.thesis,
      supportingReasons: thesis.supportingReasons,
      risks: thesis.risks,
      invalidationCriteria: thesis.invalidationCriteria,
      conviction: thesis.conviction,
      timeHorizon: thesis.timeHorizon,
    };

    const response = await fetch(`${API_BASE}/api/jarvis/review`, {
      method: "POST",
      headers: getHeaders(),
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
  if (thesis.id === "thesis-hdfc-2026" || thesis.companyId === "hdfc-bank") {
    return mockHdfcReview;
  }

  return null;
}
