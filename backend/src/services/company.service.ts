import { mockCompanies } from "../domains/company/mock.js";
import type { CanonicalCompany } from "../domains/company/types.js";

/**
 * Company service — resolves canonical company identity.
 * Currently uses mock data. Will query database when persistence is added.
 */
export function getCompanyById(
  companyId: string
): CanonicalCompany | undefined {
  return mockCompanies.find((c) => c.id === companyId);
}

export function getCompanyBySymbol(
  symbol: string
): CanonicalCompany | undefined {
  return mockCompanies.find((c) =>
    c.listings.some(
      (l) => l.symbol.toUpperCase() === symbol.toUpperCase()
    )
  );
}

export function getAllCompanies(): CanonicalCompany[] {
  return mockCompanies;
}
