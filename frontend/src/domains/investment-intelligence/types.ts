export type EvidenceCategory =
  | "fundamentals"
  | "valuation"
  | "industry"
  | "management"
  | "market-structure";

export type EvidenceImpact = "positive" | "negative" | "mixed";

export type RiskSeverity = "low" | "medium" | "high";

export type CatalystImportance = "low" | "medium" | "high";

export type ThesisImpact =
  | "strengthens"
  | "weakens"
  | "neutral"
  | "requires-more-evidence";

export interface Evidence {
  id: string;
  category: EvidenceCategory;
  title: string;
  explanation: string;
  impact: EvidenceImpact;
}

export interface Risk {
  id: string;
  title: string;
  explanation: string;
  severity: RiskSeverity;
}

export interface Catalyst {
  id: string;
  title: string;
  expectedDate?: string;
  importance: CatalystImportance;
}

export interface InvestmentIntelligence {
  companyId: string;
  companyName: string;
  generatedAt: string;
  whyToday: string;
  summary: string;
  confidence: number;
  evidence: Evidence[];
  risks: Risk[];
  catalysts: Catalyst[];
  nextQuestions: string[];
  thesisImpact: ThesisImpact;
}
