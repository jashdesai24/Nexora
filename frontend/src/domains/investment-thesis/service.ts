import type { InvestmentThesis } from "./types";
import { mockHdfcThesis } from "./mock";

/**
 * Retrieves the investment thesis for a specific company.
 * 
 * @param companyId - The unique identifier of the company
 * @returns A promise that resolves to the InvestmentThesis or null if not found
 */
export async function getInvestmentThesis(
  companyId: string
): Promise<InvestmentThesis | null> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (companyId === "hdfc-bank") {
    return mockHdfcThesis;
  }

  return null;
}
