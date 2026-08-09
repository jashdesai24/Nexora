// --- Data Provenance ---

export type SourceType =
  | "earnings-report"
  | "filing"
  | "news"
  | "analyst-note"
  | "press-release"
  | "corporate-action";

export type FreshnessStatus = "fresh" | "recent" | "stale" | "superseded";

export interface DataProvenance {
  sourceId: string;
  sourceUrl: string;
  publisher: string;
  publishedAt: string;
  fetchedAt: string;
  updatedAt: string;
  sourceType: SourceType;
  externalId?: string;
  freshness: FreshnessStatus;
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

export interface ResearchSource {
  id: string;
  title: string;
  publisher: string;
  url: string;
  publishedAt: string;
  sourceType: SourceType;
}

export interface ResearchEvidence {
  id: string;
  companyId: string;
  title: string;
  summary: string;
  source: ResearchSource;
  publishedAt: string;
  category: ResearchEvidenceCategory;
  impact: ResearchEvidenceImpact;
  provenance: DataProvenance;
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
  occurredAt: string;
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

// --- Aggregate ---

export interface ResearchIntelligence {
  companyId: string;
  companyName: string;
  generatedAt: string;
  evidence: ResearchEvidence[];
  events: ResearchEvent[];
  sources: ResearchSource[];
  keyChanges: KeyChange[];
  thesisImpacts: ThesisImpactEntry[];
}
