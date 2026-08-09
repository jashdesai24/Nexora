import type { Company } from "./types";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

export async function getUserWatchlist(): Promise<Company[]> {
  const token = localStorage.getItem("nexora_token");
  if (!token) return [];

  const response = await fetch(`${API_BASE}/api/watchlist`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) return [];
    throw new Error("Failed to fetch watchlist");
  }

  return response.json();
}

export async function addToWatchlist(companyId: string): Promise<void> {
  const token = localStorage.getItem("nexora_token");
  if (!token) throw new Error("Unauthorized");

  const response = await fetch(`${API_BASE}/api/watchlist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ companyId })
  });

  if (!response.ok) {
    throw new Error("Failed to add to watchlist");
  }
}

export async function removeFromWatchlist(companyId: string): Promise<void> {
  const token = localStorage.getItem("nexora_token");
  if (!token) throw new Error("Unauthorized");

  const response = await fetch(`${API_BASE}/api/watchlist/${companyId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error("Failed to remove from watchlist");
  }
}
