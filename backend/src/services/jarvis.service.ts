import type { LLMProvider } from "../providers/types.js";
import type {
  JarvisReviewInput,
  JarvisReviewOutput,
} from "../domains/jarvis/types.js";

/**
 * Jarvis service — structured thesis review.
 *
 * Currently returns mock review data.
 * When a real LLM provider is configured, this service:
 * 1. Builds a structured prompt from the thesis input
 * 2. Sends it to the LLM with a JSON response schema
 * 3. Validates the output with Zod
 * 4. Returns the typed JarvisReviewOutput
 *
 * The LLM never receives unstructured free-form requests.
 */
export class JarvisService {
  constructor(private llm: LLMProvider) {}

  async reviewThesis(
    input: JarvisReviewInput
  ): Promise<JarvisReviewOutput> {
    // In production, this builds a structured prompt and sends to LLM
    void this.llm;

    const now = new Date().toISOString();

    // Mock structured review — matches the frontend's JarvisReview contract
    return {
      thesisId: input.thesisId,
      overallAssessment:
        "This thesis demonstrates structural reasoning. The core argument is well-articulated. However, the thesis would benefit from deeper quantification of key assumptions and more explicit monitoring criteria.",
      strengths: [
        {
          id: "str-1",
          title: "Clear thesis statement",
          explanation:
            "The thesis identifies a specific structural advantage rather than relying on generic growth narratives.",
        },
        {
          id: "str-2",
          title: "Defined invalidation criteria",
          explanation:
            "The inclusion of specific conditions that would disprove the thesis shows disciplined thinking.",
        },
      ],
      gaps: [
        {
          id: "gap-1",
          title: "Quantitative thresholds missing",
          explanation:
            "The invalidation criteria reference qualitative conditions without specific numeric thresholds.",
          suggestion:
            "Define specific measurable thresholds that would trigger a thesis reassessment.",
          targetSection: "invalidation-criteria",
        },
      ],
      questions: [
        {
          id: "q-1",
          question:
            "What specific metrics are you monitoring to validate or invalidate this thesis?",
          rationale:
            "A well-constructed thesis should have clear, observable indicators that can be tracked over time.",
        },
      ],
      thesisQuality: "Structured",
      confidenceAssessment: "Reasonably Supported",
      reviewedAt: now,
    };
  }
}
