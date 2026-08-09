import { companyRepository } from "../repositories/company.repository.js";
import { mockCompanies } from "../domains/company/mock.js";

/**
 * Company service — resolves canonical company identity.
 */
export async function getCompanyById(companyId: string) {
  let company = await companyRepository.getCompanyById(companyId);
  
  if (!company) {
    // Auto-seed fallback for development/demo purposes
    const mock = mockCompanies.find(c => c.id === companyId);
    if (mock) {
      company = await companyRepository.createCompany({
        id: mock.id,
        name: mock.name,
        sector: mock.sector,
        industry: mock.industry,
        identifiers: mock.listings.map(l => ({ type: l.exchange, value: l.symbol }))
      });
    }
  }

  return company;
}

export async function searchCompanies(query: string) {
  return companyRepository.searchCompanies(query);
}

export async function getAllCompanies() {
  // We'll return top 20 or seed all mocks if empty, but for now just search empty string
  const results = await companyRepository.searchCompanies("");
  if (results.length === 0) {
    // Quick auto-seed of all mocks
    for (const mock of mockCompanies) {
      await companyRepository.createCompany({
        id: mock.id,
        name: mock.name,
        sector: mock.sector,
        industry: mock.industry,
        identifiers: mock.listings.map(l => ({ type: l.exchange, value: l.symbol }))
      });
    }
    return companyRepository.searchCompanies("");
  }
  return results;
}
