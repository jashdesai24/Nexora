import { companyRepository } from "../repositories/company.repository.js";
import { providers } from "../config/providers.js";

/**
 * Company service — resolves canonical company identity.
 */
export async function getCompanyById(companyId: string) {
  let company = await companyRepository.getCompanyById(companyId);
  
  if (!company) {
    // Attempt to fetch from provider
    const providerResult = await providers.company.getById(companyId);
    if (providerResult) {
      company = await companyRepository.createCompany({
        id: providerResult.id,
        name: providerResult.name,
        sector: providerResult.sector,
        industry: providerResult.industry,
        identifiers: providerResult.listings.map(l => ({ type: l.exchange, value: l.symbol }))
      });
    }
  }

  return company;
}

export async function searchCompanies(query: string) {
  // Always query the provider. We can store them locally, but search is dynamic.
  // Actually, we can return what we have in the DB + what the provider returns,
  // or just rely on the provider for discovery, and save them when selected.
  // We'll search both DB and Provider and merge them.
  const dbResults = await companyRepository.searchCompanies(query);
  const providerResults = await providers.company.search(query);

  const seenIds = new Set(dbResults.map(r => r.id));
  const merged = [...dbResults];

  for (const p of providerResults) {
    if (!seenIds.has(p.id)) {
      merged.push({
        id: p.id,
        name: p.name,
        sector: p.sector,
        industry: p.industry,
        createdAt: new Date(),
        updatedAt: new Date(),
        identifiers: p.listings.map(l => ({ 
          id: `tmp-${l.exchange}-${l.symbol}`, 
          companyId: p.id, 
          type: l.exchange, 
          value: l.symbol 
        }))
      });
    }
  }

  return merged;
}

export async function getAllCompanies() {
  const results = await companyRepository.searchCompanies("");
  if (results.length === 0) {
    // Try to auto-seed from empty search query via provider (mock typically returns all)
    const providerResults = await providers.company.search("");
    for (const mock of providerResults) {
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
