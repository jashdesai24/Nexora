import { CompanyProvider, CompanySearchResult } from "../types.js";
import { mockCompanies } from "../../domains/company/mock.js";

export class MockCompanyProvider implements CompanyProvider {
  name = "mock-company";

  async search(query: string): Promise<CompanySearchResult[]> {
    if (!query) return mockCompanies;
    
    const lowerQuery = query.toLowerCase();
    return mockCompanies.filter(
      (c) =>
        c.name.toLowerCase().includes(lowerQuery) ||
        c.listings.some((l) => l.symbol.toLowerCase().includes(lowerQuery))
    );
  }

  async getById(id: string): Promise<CompanySearchResult | null> {
    const company = mockCompanies.find((c) => c.id === id);
    return company || null;
  }
}
