// --- Jarvis Input/Output Contracts ---

export type ThesisQuality =
  | "Underdeveloped"
  | "Developing"
  | "Structured"
  | "Well-Reasoned"
  | "Exceptional";

export type ConfidenceAssessment =
  | "Insufficiently Supported"
  | "Partially Supported"
  | "Reasonably Supported"
  | "Strongly Supported";

export interface JarvisReviewInput {
  thesisId: string;
  thesis: string;
  supportingReasons: string[];
  risks: string[];
  invalidationCriteria: string[];
  conviction: number;
  timeHorizon: string;
  // Optional evidence context for evidence-aware review (Phase 3)
  evidenceContext?: string[];
}

export interface ReviewStrength {
  id: string;
  title: string;
  explanation: string;
}

export interface ReviewGap {
  id: string;
  title: string;
  explanation: string;
  suggestion: string;
  targetSection: string;
}

export interface ReviewQuestion {
  id: string;
  question: string;
  rationale: string;
}

export interface JarvisReviewOutput {
  thesisId: string;
  overallAssessment: string;
  strengths: ReviewStrength[];
  gaps: ReviewGap[];
  questions: ReviewQuestion[];
  thesisQuality: ThesisQuality;
  confidenceAssessment: ConfidenceAssessment;
  reviewedAt: string;
}

// --- Jarvis Task Types ---

export type JarvisTaskType =
  | "thesis-review"
  | "evidence-summary"
  | "change-analysis"
  | "risk-identification";

export interface JarvisTask {
  type: JarvisTaskType;
  input: JarvisReviewInput;
}
