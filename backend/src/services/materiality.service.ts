import type { FreshnessStatus } from "../domains/research-intelligence/types.js";

/**
 * Materiality levels for research evidence.
 * Determines whether new information is significant enough to warrant user attention.
 */
export type MaterialityLevel = "high" | "medium" | "low" | "unknown";

// --- Freshness Classification ---

const FRESH_THRESHOLD_MS = 24 * 60 * 60 * 1000;   // 24 hours
const RECENT_THRESHOLD_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function classifyFreshness(publishedAt: Date): FreshnessStatus {
  const ageMs = Date.now() - publishedAt.getTime();

  if (ageMs <= FRESH_THRESHOLD_MS) return "fresh";
  if (ageMs <= RECENT_THRESHOLD_MS) return "recent";
  return "stale";
}

// --- Materiality Classification ---

/** Keywords that signal HIGH materiality */
const HIGH_KEYWORDS = [
  "earnings", "results", "quarterly", "annual", "q1", "q2", "q3", "q4",
  "profit", "loss", "revenue", "net income", "ebitda", "margin",
  "guidance", "outlook", "forecast", "target",
  "regulatory", "sebi", "rbi", "compliance", "penalty", "fine",
  "ceo", "cfo", "managing director", "board", "management change",
  "acquisition", "merger", "stake", "buyback", "takeover", "demerger",
  "ipo", "fpo", "ofs", "rights issue",
  "downgrade", "default", "fraud", "investigation",
];

/** Keywords that signal MEDIUM materiality */
const MEDIUM_KEYWORDS = [
  "dividend", "bonus", "stock split", "record date",
  "contract", "partnership", "deal", "order", "mou",
  "rating", "upgrade", "downgrade", "analyst",
  "expansion", "capex", "investment", "plant", "facility",
  "market share", "growth", "decline",
  "nifty", "sensex", "sector",
];

/** Keywords that signal LOW materiality */
const LOW_KEYWORDS = [
  "general", "industry", "market update", "commentary",
  "opinion", "blog", "podcast", "webinar",
  "report", "survey", "index",
];

/**
 * Classifies the materiality of an evidence item based on keyword signals
 * in the title and summary. No LLM calls — purely rule-based.
 *
 * Per the spec: "Do not run LLM analysis over every piece of data."
 */
export function classifyMateriality(
  title: string,
  summary?: string
): MaterialityLevel {
  const text = `${title} ${summary ?? ""}`.toLowerCase();

  // Check HIGH signals first
  if (HIGH_KEYWORDS.some((kw) => text.includes(kw))) {
    return "high";
  }

  // Then MEDIUM
  if (MEDIUM_KEYWORDS.some((kw) => text.includes(kw))) {
    return "medium";
  }

  // Then LOW
  if (LOW_KEYWORDS.some((kw) => text.includes(kw))) {
    return "low";
  }

  return "unknown";
}
