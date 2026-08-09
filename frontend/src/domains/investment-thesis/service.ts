import type { InvestmentThesis, InvestmentThesisVersion } from "./types";
import { mockHdfcThesis } from "./mock";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

function getHeaders() {
  const token = localStorage.getItem('nexora_token');
  return {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {})
  };
}

export async function getThesisVersions(id: string): Promise<InvestmentThesisVersion[]> {
  const token = localStorage.getItem('nexora_token');
  const response = await fetch(`${API_BASE}/api/theses/${id}/versions`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    if (response.status === 404) return [];
    throw new Error("Failed to fetch thesis versions");
  }

  const data: InvestmentThesisVersion[] = await response.json();
  return data;
}

export async function getInvestmentThesis(
  companyId: string
): Promise<InvestmentThesis | null> {
  try {
    const res = await fetch(`${API_BASE}/api/theses`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Failed to fetch theses");
    const theses: InvestmentThesis[] = await res.json();
    
    // Find the one matching companyId (for now we assume 1 active thesis per company)
    const thesis = theses.find(t => t.companyId === companyId);
    if (thesis) return thesis;
  } catch (err) {
    console.warn("[ThesisService] Backend fetch failed, falling back to mock", err);
  }

  // Fallback
  if (companyId === "hdfc-bank") {
    return mockHdfcThesis;
  }
  return null;
}

export async function saveInvestmentThesis(
  thesis: InvestmentThesis
): Promise<InvestmentThesis> {
  const isNew = thesis.id.startsWith("thesis-"); // Just a quick check for our mock ids vs real uuids
  const method = isNew ? "POST" : "PATCH";
  const url = isNew 
    ? `${API_BASE}/api/theses` 
    : `${API_BASE}/api/theses/${thesis.id}`;

  const res = await fetch(url, {
    method,
    headers: getHeaders(),
    body: JSON.stringify(thesis)
  });

  if (!res.ok) {
    throw new Error("Failed to save thesis");
  }

  return res.json();
}
