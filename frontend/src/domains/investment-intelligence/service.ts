import { hdfcBankInvestmentIntelligence } from "./mock";
import type { InvestmentIntelligence } from "./types";

export async function getInvestmentIntelligence(
  companyId: string,
): Promise<InvestmentIntelligence> {
  void companyId;

  return hdfcBankInvestmentIntelligence;
}
