import type {
  ResearchIntelligence,
  ResearchSource,
  ResearchEvidence,
  ResearchEvent,
  KeyChange,
  ThesisImpactEntry,
} from "./types";

// --- Sources ---

const bseFilingSource: ResearchSource = {
  id: "src-1",
  title: "HDFC Bank Q1 FY27 Results Filing",
  publisher: "BSE India",
  url: "https://www.bseindia.com/corporates/results.html",
  publishedAt: "2026-07-28T06:30:00Z",
  sourceType: "filing",
};

const earningsCallSource: ResearchSource = {
  id: "src-2",
  title: "HDFC Bank Q1 FY27 Earnings Conference Call Transcript",
  publisher: "HDFC Bank Investor Relations",
  url: "https://www.hdfcbank.com/investor-relations",
  publishedAt: "2026-07-28T11:00:00Z",
  sourceType: "earnings-report",
};

const rbiCircularSource: ResearchSource = {
  id: "src-3",
  title: "RBI Circular — Revised LCR Framework",
  publisher: "Reserve Bank of India",
  url: "https://www.rbi.org.in/scripts/NotificationUser.aspx",
  publishedAt: "2026-07-15T10:00:00Z",
  sourceType: "filing",
};

const economicTimesSource: ResearchSource = {
  id: "src-4",
  title: "HDFC Bank Adds 200 Branches in Q1, Accelerates Rural Penetration",
  publisher: "The Economic Times",
  url: "https://economictimes.indiatimes.com/industry/banking",
  publishedAt: "2026-07-30T08:00:00Z",
  sourceType: "news",
};

const managementCommentarySource: ResearchSource = {
  id: "src-5",
  title: "CEO Commentary — Post-Merger Integration Progress Update",
  publisher: "HDFC Bank Investor Relations",
  url: "https://www.hdfcbank.com/investor-relations",
  publishedAt: "2026-07-28T12:00:00Z",
  sourceType: "press-release",
};

const sources: ResearchSource[] = [
  bseFilingSource,
  earningsCallSource,
  rbiCircularSource,
  economicTimesSource,
  managementCommentarySource,
];

// --- Evidence ---

const evidence: ResearchEvidence[] = [
  {
    id: "ev-1",
    companyId: "hdfc-bank",
    title: "Net Interest Margin expands 8 bps sequentially to 3.54%",
    summary:
      "HDFC Bank reported a sequential NIM expansion of 8 basis points in Q1 FY27, reaching 3.54%. This reverses two quarters of post-merger compression and suggests the liability franchise repricing is progressing ahead of management's guided timeline.",
    source: bseFilingSource,
    publishedAt: "2026-07-28T06:30:00Z",
    category: "fundamentals",
    impact: "positive",
  },
  {
    id: "ev-2",
    companyId: "hdfc-bank",
    title: "CASA ratio stabilizes at 43.2%, up from 42.8% in Q4 FY26",
    summary:
      "The Current Account Savings Account ratio improved 40 bps sequentially to 43.2%, indicating the deposit franchise is absorbing the merged HDFC Ltd book without structural dilution. This is above the 42% threshold identified in the investment thesis.",
    source: earningsCallSource,
    publishedAt: "2026-07-28T11:00:00Z",
    category: "fundamentals",
    impact: "positive",
  },
  {
    id: "ev-3",
    companyId: "hdfc-bank",
    title: "RBI proposes tighter LCR norms effective April 2027",
    summary:
      "The Reserve Bank of India released a draft circular proposing revised Liquidity Coverage Ratio requirements that would increase the run-off factor for digitally-sourced deposits. If implemented, this could require HDFC Bank to hold additional high-quality liquid assets, temporarily compressing returns on the investment book.",
    source: rbiCircularSource,
    publishedAt: "2026-07-15T10:00:00Z",
    category: "regulatory",
    impact: "negative",
  },
  {
    id: "ev-4",
    companyId: "hdfc-bank",
    title: "Branch network reaches 8,900 with 200 additions in Q1",
    summary:
      "HDFC Bank added 200 new branches in Q1 FY27, bringing the total to approximately 8,900. Management indicated a focus on semi-urban and rural markets, where digital banking penetration remains low and the cost-of-deposit advantage is most pronounced.",
    source: economicTimesSource,
    publishedAt: "2026-07-30T08:00:00Z",
    category: "market-structure",
    impact: "positive",
  },
  {
    id: "ev-5",
    companyId: "hdfc-bank",
    title: "Gross NPA ratio stable at 1.24%, credit costs at 0.42%",
    summary:
      "Asset quality metrics remained stable with Gross NPA at 1.24% and net credit costs at 0.42% annualized. The retail unsecured book showed no material stress despite elevated industry-wide delinquencies in microfinance and small personal loans.",
    source: bseFilingSource,
    publishedAt: "2026-07-28T06:30:00Z",
    category: "fundamentals",
    impact: "positive",
  },
];

// --- Events ---

const events: ResearchEvent[] = [
  {
    id: "evt-1",
    companyId: "hdfc-bank",
    title: "Q1 FY27 Earnings Release",
    description:
      "HDFC Bank reported net profit of ₹16,820 crore for Q1 FY27, a 21% year-over-year increase. Revenue grew 18% YoY driven by loan book growth and improving margins.",
    eventType: "earnings",
    occurredAt: "2026-07-28T06:30:00Z",
    source: bseFilingSource,
  },
  {
    id: "evt-2",
    companyId: "hdfc-bank",
    title: "RBI Draft Circular on LCR Framework",
    description:
      "The RBI issued a draft circular proposing changes to the LCR framework, specifically targeting higher run-off rates for deposits sourced through digital channels. The comment period ends September 2026.",
    eventType: "regulatory",
    occurredAt: "2026-07-15T10:00:00Z",
    source: rbiCircularSource,
  },
  {
    id: "evt-3",
    companyId: "hdfc-bank",
    title: "CEO Provides Integration Progress Update",
    description:
      "In the post-earnings call, the CEO stated that 85% of the technology platform migration from HDFC Ltd systems is complete, with full consolidation expected by Q3 FY27. The remaining 15% involves complex mortgage servicing workflows.",
    eventType: "management-change",
    occurredAt: "2026-07-28T12:00:00Z",
    source: managementCommentarySource,
  },
];

// --- Key Changes ---

const keyChanges: KeyChange[] = [
  {
    id: "kc-1",
    title: "NIM trajectory reversing post-merger compression",
    description:
      "After two quarters of post-merger NIM decline, the Q1 FY27 result shows the first sequential expansion. The trend suggests the liability franchise repricing is working.",
    direction: "improving",
  },
  {
    id: "kc-2",
    title: "CASA ratio stabilizing above thesis threshold",
    description:
      "CASA at 43.2% is above the 42% floor identified in the thesis invalidation criteria, suggesting the deposit moat is intact.",
    direction: "improving",
  },
  {
    id: "kc-3",
    title: "Regulatory risk from revised LCR norms",
    description:
      "If implemented, the new LCR framework could increase the cost of holding digital deposits and moderately compress returns on the investment portfolio.",
    direction: "deteriorating",
  },
];

// --- Thesis Impacts ---

const thesisImpacts: ThesisImpactEntry[] = [
  {
    evidenceId: "ev-1",
    impact: "supports",
    rationale:
      "NIM expansion directly validates the core thesis that the liability franchise advantage would reassert itself after the post-merger adjustment period.",
  },
  {
    evidenceId: "ev-2",
    impact: "supports",
    rationale:
      "CASA ratio stabilization above the thesis invalidation floor (42%) confirms the deposit moat remains structurally intact.",
  },
  {
    evidenceId: "ev-3",
    impact: "weakens",
    rationale:
      "The proposed LCR changes introduce a regulatory risk not explicitly addressed in the current thesis, potentially affecting the cost advantage of digital deposit gathering.",
  },
  {
    evidenceId: "ev-4",
    impact: "supports",
    rationale:
      "Branch expansion pace is consistent with the thesis supporting reason about distribution network growth and cross-selling potential.",
  },
  {
    evidenceId: "ev-5",
    impact: "supports",
    rationale:
      "Stable asset quality validates the thesis's claim of disciplined underwriting culture being maintained post-merger.",
  },
];

// --- Aggregate ---

export const mockHdfcResearchIntelligence: ResearchIntelligence = {
  companyId: "hdfc-bank",
  companyName: "HDFC Bank",
  generatedAt: "2026-08-07T15:00:00Z",
  evidence,
  events,
  sources,
  keyChanges,
  thesisImpacts,
};
