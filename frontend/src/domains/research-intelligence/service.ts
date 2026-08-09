import type { ResearchIntelligence } from "./types";
import { mockHdfcResearchIntelligence } from "./mock";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

/**
 * Retrieves research intelligence for a specific company.
 *
 * Strategy:
 * 1. Try the backend API first (real or mock provider data)
 * 2. Fall back to frontend mock data if the backend is unavailable
 *
 * This allows development without running the backend server.
 */
export async function getResearchIntelligence(
  companyId: string
): Promise<ResearchIntelligence | null> {
  try {
    const token = localStorage.getItem("nexora_token");
    const headers: Record<string, string> = { Accept: "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
      `${API_BASE}/api/companies/${encodeURIComponent(companyId)}/research`,
      {
        headers,
        signal: AbortSignal.timeout(10_000),
      }
    );

    if (response.ok) {
      const data: ResearchIntelligence = await response.json();
      return data;
    }

    // 404 = company not found, don't fall back
    if (response.status === 404) {
      return null;
    }

    // Other errors — fall through to mock
    console.warn(
      `[ResearchIntelligence] Backend returned ${response.status}, falling back to mock`
    );
  } catch {
    // Backend unavailable — fall through to mock
    console.warn(
      "[ResearchIntelligence] Backend unavailable, using mock data"
    );
  }

  // Fallback to frontend mock data
  if (companyId === "hdfc-bank") {
    return mockHdfcResearchIntelligence;
  }

  return null;
}
