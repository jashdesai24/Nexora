import type { ResearchIntelligence } from "./types";
import { mockHdfcResearchIntelligence } from "./mock";

/**
 * Retrieves research intelligence for a specific company.
 *
 * @param companyId - The unique identifier of the company
 * @returns A promise that resolves to the ResearchIntelligence or null if not found
 */
export async function getResearchIntelligence(
  companyId: string
): Promise<ResearchIntelligence | null> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 700));

  if (companyId === "hdfc-bank") {
    return mockHdfcResearchIntelligence;
  }

  return null;
}
