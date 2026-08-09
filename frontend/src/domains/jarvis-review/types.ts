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

export type ThesisSectionTarget =
  | "thesis-statement"
  | "supporting-reasons"
  | "risks"
  | "invalidation-criteria"
  | "conviction"
  | "horizon";

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
  targetSection: ThesisSectionTarget;
}

export interface ReviewQuestion {
  id: string;
  question: string;
  rationale: string;
}

export interface JarvisReview {
  thesisId: string;
  overallAssessment: string;
  strengths: ReviewStrength[];
  gaps: ReviewGap[];
  questions: ReviewQuestion[];
  thesisQuality: ThesisQuality;
  confidenceAssessment: ConfidenceAssessment;
  reviewedAt: string; // ISO String
}
