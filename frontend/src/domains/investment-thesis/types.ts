export type TimeHorizon = "Short-term" | "Medium-term" | "Long-term";
export type ThesisStatus = "Draft" | "Active" | "Invalidated" | "Completed";

export interface InvestmentThesis {
  id: string;
  companyId: string;
  title: string;
  thesis: string;
  conviction: number; // 0 - 100
  supportingReasons: string[];
  risks: string[];
  invalidationCriteria: string[];
  timeHorizon: TimeHorizon;
  status: ThesisStatus;
  createdAt: string; // ISO String
  updatedAt: string; // ISO String
}

export interface InvestmentThesisVersion {
  id: string;
  thesisId: string;
  statement: string;
  supportingReasons: string[];
  risks: string[];
  invalidationCriteria: string[];
  conviction: number;
  timeHorizon: TimeHorizon;
  createdAt: string; // ISO String
}
