import type { Company } from "./types";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

export async function searchCompanies(query: string): Promise<Company[]> {
  const response = await fetch(`${API_BASE}/api/companies/search?q=${encodeURIComponent(query)}`);
  
  if (!response.ok) {
    throw new Error("Failed to search companies");
  }

  const data = await response.json();
  return data.companies;
}

export async function getAllCompanies(): Promise<Company[]> {
  const response = await fetch(`${API_BASE}/api/companies`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch companies");
  }

  const data = await response.json();
  return data.companies;
}
