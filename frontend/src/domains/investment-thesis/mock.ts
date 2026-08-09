import type { InvestmentThesis } from "./types";

export const mockHdfcThesis: InvestmentThesis = {
  id: "thesis-hdfc-2026",
  companyId: "hdfc-bank",
  title: "Structural Moat Through Liability Franchise Scale",
  thesis:
    "HDFC Bank possesses an enduring structural moat driven by its unparalleled deposit-gathering capability and low cost of funds. Following the merger, temporary margin compression has obscured the underlying strength of the combined entity's reach. As branch expansion continues and operational synergies materialize, the bank is positioned to capture a disproportionate share of India's long-term credit penetration while maintaining superior asset quality.",
  conviction: 85,
  supportingReasons: [
    "Unmatched liability franchise generating a consistently low cost of funds compared to peers.",
    "Decades of disciplined underwriting resulting in industry-leading asset quality across credit cycles.",
    "Massive branch expansion strategy creating a vast distribution network for cross-selling financial products.",
    "Macroeconomic tailwinds from India's structural shift toward formal financialization and credit adoption.",
  ],
  risks: [
    "Prolonged pressure on Net Interest Margins (NIM) if deposit repricing outpaces yield improvement on the asset side.",
    "Potential regulatory shifts affecting liquidity coverage ratio (LCR) requirements and capital buffers.",
    "Intensifying competition from nimble fintechs in the payment and unsecured lending spaces.",
  ],
  invalidationCriteria: [
    "A structural and persistent deterioration in the CASA (Current Account Savings Account) ratio below historical floors.",
    "A significant and unexpected degradation in asset quality leading to credit costs materially above the historical average.",
    "Management deviating from their historical risk-averse underwriting culture.",
  ],
  timeHorizon: "Long-term",
  status: "Active",
  createdAt: "2026-08-01T10:00:00Z",
  updatedAt: "2026-08-04T12:00:00Z",
};
