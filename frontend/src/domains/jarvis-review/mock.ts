import type { JarvisReview } from "./types";

export const mockHdfcReview: JarvisReview = {
  thesisId: "thesis-hdfc-2026",
  overallAssessment:
    "This thesis demonstrates strong structural reasoning anchored in HDFC Bank's liability franchise advantage. The core argument — that the bank's deposit-gathering capability creates a durable competitive moat — is well-articulated and supported by observable fundamentals. However, the thesis would benefit from deeper quantification of post-merger integration risks and a more explicit framework for monitoring the invalidation criteria over time.",
  strengths: [
    {
      id: "str-1",
      title: "Clear identification of the structural moat",
      explanation:
        "The thesis correctly isolates the liability franchise as the primary competitive advantage rather than relying on generic growth narratives. This demonstrates an understanding of what actually drives long-term value in Indian banking.",
    },
    {
      id: "str-2",
      title: "Well-defined invalidation criteria",
      explanation:
        "The inclusion of specific invalidation triggers — CASA ratio deterioration, asset quality degradation, and management culture shifts — shows disciplined thinking. Most theses lack this self-correcting mechanism.",
    },
    {
      id: "str-3",
      title: "Appropriate time horizon selection",
      explanation:
        "A long-term horizon is consistent with the structural nature of the thesis. The argument depends on branch expansion and merger synergies, both of which require multi-year execution windows to materialize.",
    },
  ],
  gaps: [
    {
      id: "gap-1",
      title: "Post-merger integration risk is underweighted",
      explanation:
        "The thesis acknowledges temporary margin compression but does not explore the operational complexity of integrating HDFC Ltd's asset book. Large-scale mergers in Indian banking have historically produced multi-year execution drag that goes beyond NIM pressure.",
      suggestion:
        "Add a dedicated section examining the merger integration timeline, management bandwidth allocation, and technology platform consolidation progress.",
      targetSection: "risks",
    },
    {
      id: "gap-2",
      title: "Competitive landscape lacks specificity",
      explanation:
        "The fintech competition risk is mentioned but treated as a single line item. The nature of the threat varies significantly across segments — payments (PhonePe, Google Pay), unsecured lending (Slice, KreditBee), and wealth management (Zerodha, Groww) each present distinct challenges.",
      suggestion:
        "Break the competitive risk into segment-specific threats with an assessment of HDFC Bank's positioning in each.",
      targetSection: "risks",
    },
    {
      id: "gap-3",
      title: "No quantitative benchmarks for monitoring",
      explanation:
        "The invalidation criteria reference 'historical floors' and 'historical averages' without specifying actual numbers. This makes it difficult to objectively trigger a thesis review.",
      suggestion:
        "Define specific thresholds — e.g., CASA ratio below 42%, credit costs above 1.2% — that would trigger a formal re-evaluation of the thesis.",
      targetSection: "invalidation-criteria",
    },
  ],
  questions: [
    {
      id: "q-1",
      question:
        "What is the current trajectory of the CASA ratio post-merger, and how does it compare to the pre-merger baseline?",
      rationale:
        "The CASA ratio is the thesis's primary health indicator. Understanding its post-merger trajectory is essential to validating the core moat argument.",
    },
    {
      id: "q-2",
      question:
        "How is management allocating bandwidth between merger integration and organic growth initiatives?",
      rationale:
        "Large integrations can consume disproportionate management attention. If branch expansion or technology investments are slowing, the long-term growth trajectory may be at risk.",
    },
    {
      id: "q-3",
      question:
        "What percentage of the new branch network is achieving deposit run-rate targets within the expected timeframe?",
      rationale:
        "Branch expansion is cited as a key supporting reason, but new branches typically take 18–24 months to reach profitability. Understanding the ramp-up curve is critical.",
    },
    {
      id: "q-4",
      question:
        "Has the bank's market share in unsecured retail lending changed meaningfully over the past four quarters?",
      rationale:
        "Fintech competition is most directly visible in unsecured lending market share data. A declining share here would validate the competitive risk flagged in the thesis.",
    },
  ],
  thesisQuality: "Well-Reasoned",
  confidenceAssessment: "Reasonably Supported",
  reviewedAt: "2026-08-07T14:00:00Z",
};
