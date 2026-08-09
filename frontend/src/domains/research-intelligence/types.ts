// --- Source Types ---

export type SourceType =
  | "earnings-report"
  | "filing"
  | "news"
  | "analyst-note"
  | "press-release"
  | "corporate-action";

export interface ResearchSource {
  id: string;
  title: string;
  publisher: string;
  url: string;
  publishedAt: string; // ISO String
  sourceType: SourceType;
}

// --- Evidence ---

export type ResearchEvidenceCategory =
  | "fundamentals"
  | "valuation"
  | "industry"
  | "management"
  | "market-structure"
  | "regulatory"
  | "macro";

export type ResearchEvidenceImpact = "positive" | "negative" | "mixed";

export type FreshnessStatus = "fresh" | "recent" | "stale";
export type MaterialityLevel = "high" | "medium" | "low" | "unknown";

export interface ResearchEvidence {
  id: string;
  companyId: string;
  title: string;
  summary: string;
  source: ResearchSource;
  publishedAt: string; // ISO String
  category: ResearchEvidenceCategory;
  impact: ResearchEvidenceImpact;
  freshness?: FreshnessStatus;
  materiality?: MaterialityLevel;
}

// --- Events ---

export type EventType =
  | "earnings"
  | "filing"
  | "management-change"
  | "corporate-action"
  | "regulatory"
  | "macro";

export interface ResearchEvent {
  id: string;
  companyId: string;
  title: string;
  description: string;
  eventType: EventType;
  occurredAt: string; // ISO String
  source: ResearchSource;
}

// --- Thesis Impact ---

export type ResearchThesisImpact =
  | "supports"
  | "weakens"
  | "neutral"
  | "uncertain";

export interface ThesisImpactEntry {
  evidenceId: string;
  impact: ResearchThesisImpact;
  rationale: string;
}

// --- Key Change ---

export interface KeyChange {
  id: string;
  title: string;
  description: string;
  direction: "improving" | "deteriorating" | "stable";
}

// --- Aggregate Root ---

export interface ResearchIntelligence {
  companyId: string;
  companyName: string;
  generatedAt: string; // ISO String
  evidence: ResearchEvidence[];
  events: ResearchEvent[];
  sources: ResearchSource[];
  keyChanges: KeyChange[];
  thesisImpacts: ThesisImpactEntry[];
}
