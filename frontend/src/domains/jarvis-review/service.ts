import type { JarvisReview } from "./types";
import { mockHdfcReview } from "./mock";

/**
 * Retrieves the Jarvis review for a specific investment thesis.
 *
 * @param thesisId - The unique identifier of the thesis to review
 * @returns A promise that resolves to the JarvisReview or null if not found
 */
export async function getJarvisReview(
  thesisId: string
): Promise<JarvisReview | null> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 600));

  if (thesisId === "thesis-hdfc-2026") {
    return mockHdfcReview;
  }

  return null;
}
