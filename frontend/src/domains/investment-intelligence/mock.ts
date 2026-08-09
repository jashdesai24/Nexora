import type { InvestmentIntelligence } from "./types";

export const hdfcBankInvestmentIntelligence: InvestmentIntelligence = {
  companyId: "hdfc-bank",
  companyName: "HDFC Bank",
  generatedAt: "2026-07-24T10:30:00.000Z",
  whyToday:
    "HDFC Bank deserves renewed research attention because the post-merger deposit cycle, margin normalization, and credit quality trajectory are beginning to offer a clearer read on the durability of earnings growth.",
  summary:
    "The investment question is not whether HDFC Bank remains a high-quality franchise, but whether recent operating signals are enough to rebuild confidence in its compounding profile after a period of balance-sheet integration pressure. Evidence is improving, but the thesis still depends on deposit growth, net interest margin recovery, and disciplined credit underwriting moving in the same direction.",
  confidence: 78,
  evidence: [
    {
      id: "evidence-deposit-momentum",
      category: "fundamentals",
      title: "Deposit growth is central to the recovery path",
      explanation:
        "The bank's ability to fund loan growth with stable, granular deposits is the most important signal to monitor after the merger. Improving deposit momentum would reduce pressure on funding costs and support a more durable earnings base.",
      impact: "positive",
    },
    {
      id: "evidence-margin-normalization",
      category: "fundamentals",
      title: "Margins are a key swing factor",
      explanation:
        "Net interest margins remain below the level investors historically associated with the franchise. A gradual margin recovery would suggest that integration pressure is easing and that the bank can translate scale into stronger profitability.",
      impact: "mixed",
    },
    {
      id: "evidence-franchise-quality",
      category: "industry",
      title: "Scale and distribution remain structural advantages",
      explanation:
        "HDFC Bank retains a deep branch network, strong brand trust, and a large customer base across retail and commercial banking. These advantages support long-term relevance even when near-term earnings optics are uneven.",
      impact: "positive",
    },
  ],
  risks: [
    {
      id: "risk-funding-costs",
      title: "Funding costs may stay elevated",
      explanation:
        "If deposit competition remains intense, the bank may need to pay more for liabilities, delaying margin recovery and weakening operating leverage.",
      severity: "high",
    },
    {
      id: "risk-credit-cycle",
      title: "Credit quality could deteriorate late in the cycle",
      explanation:
        "Retail and unsecured credit stress across the sector would raise the burden of proof for HDFC Bank's asset quality and provisioning discipline.",
      severity: "medium",
    },
    {
      id: "risk-execution",
      title: "Post-merger execution may take longer than expected",
      explanation:
        "The scale of the merger means operational, cultural, and balance-sheet normalization may remain visible for several reporting periods.",
      severity: "medium",
    },
  ],
  catalysts: [
    {
      id: "catalyst-quarterly-results",
      title: "Next quarterly earnings update",
      expectedDate: "2026-07",
      importance: "high",
    },
    {
      id: "catalyst-deposit-commentary",
      title: "Management commentary on deposit growth and funding mix",
      importance: "high",
    },
    {
      id: "catalyst-sector-credit-data",
      title: "Sector-wide credit quality and deposit competition data",
      importance: "medium",
    },
  ],
  nextQuestions: [
    "Is deposit growth improving without materially increasing funding costs?",
    "What evidence would confirm that margin pressure has peaked?",
    "Are credit costs still consistent with a high-quality lending franchise?",
    "How much of the current valuation discount is explained by temporary integration pressure?",
  ],
  thesisImpact: "requires-more-evidence",
};
