import type { DailyBriefing } from "./types";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

export async function generateDailyBriefing(): Promise<DailyBriefing[]> {
  const token = localStorage.getItem("nexora_token");
  if (!token) throw new Error("Unauthorized");

  const response = await fetch(`${API_BASE}/api/briefings/generate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error("Failed to generate daily briefing");
  }

  return response.json();
}
