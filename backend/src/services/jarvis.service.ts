import { z } from "zod";
import type { LLMProvider } from "../providers/types.js";
import type {
  JarvisReviewInput,
  JarvisReviewOutput,
  ThesisQuality,
  ConfidenceAssessment,
} from "../domains/jarvis/types.js";
import { Schema, SchemaType } from "@google/generative-ai";
import { providers } from "../config/providers.js"; // Importing registry directly for simplicity in service.
import { ResearchIntelligenceService } from "./research-intelligence.service.js";

// Ensure we have a service instance to fetch the intelligence.
const researchService = new ResearchIntelligenceService(
  providers.marketData,
  providers.news
);

// --- Output Validation Schema ---

const jarvisOutputSchema = z.object({
  overallAssessment: z.string(),
  strengths: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      explanation: z.string(),
    })
  ),
  gaps: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      explanation: z.string(),
      suggestion: z.string(),
      targetSection: z.string(),
    })
  ),
  questions: z.array(
    z.object({
      id: z.string(),
      question: z.string(),
      rationale: z.string(),
    })
  ),
  thesisQuality: z.enum([
    "Underdeveloped",
    "Developing",
    "Structured",
    "Well-Reasoned",
    "Exceptional",
  ]),
  confidenceAssessment: z.enum([
    "Insufficiently Supported",
    "Partially Supported",
    "Reasonably Supported",
    "Strongly Supported",
  ]),
});

// --- Gemini OpenAPI Schema ---

const geminiResponseSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    overallAssessment: {
      type: SchemaType.STRING,
      description: "A 2-3 sentence summary evaluating the thesis based ONLY on provided evidence.",
    },
    strengths: {
      type: SchemaType.ARRAY,
      description: "Well-supported aspects of the thesis.",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          id: { type: SchemaType.STRING },
          title: { type: SchemaType.STRING },
          explanation: { type: SchemaType.STRING, description: "Must cite specific evidence or structure." },
        },
        required: ["id", "title", "explanation"],
      },
    },
    gaps: {
      type: SchemaType.ARRAY,
      description: "Missing reasoning, unaddressed risks, or unsupported claims.",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          id: { type: SchemaType.STRING },
          title: { type: SchemaType.STRING },
          explanation: { type: SchemaType.STRING },
          suggestion: { type: SchemaType.STRING },
          targetSection: {
            type: SchemaType.STRING,
            description: "Which section needs editing: thesis-statement, supporting-reasons, risks, invalidation-criteria, conviction, horizon",
          },
        },
        required: ["id", "title", "explanation", "suggestion", "targetSection"],
      },
    },
    questions: {
      type: SchemaType.ARRAY,
      description: "Questions the investor should investigate further to strengthen the thesis.",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          id: { type: SchemaType.STRING },
          question: { type: SchemaType.STRING },
          rationale: { type: SchemaType.STRING },
        },
        required: ["id", "question", "rationale"],
      },
    },
    thesisQuality: {
      type: SchemaType.STRING,
      format: "enum",
      enum: [
        "Underdeveloped",
        "Developing",
        "Structured",
        "Well-Reasoned",
        "Exceptional",
      ],
    },
    confidenceAssessment: {
      type: SchemaType.STRING,
      format: "enum",
      enum: [
        "Insufficiently Supported",
        "Partially Supported",
        "Reasonably Supported",
        "Strongly Supported",
      ],
    },
  },
  required: [
    "overallAssessment",
    "strengths",
    "gaps",
    "questions",
    "thesisQuality",
    "confidenceAssessment",
  ],
};

// --- Impact Output Validation Schema ---

const impactOutputSchema = z.object({
  impacts: z.array(
    z.object({
      evidenceId: z.string(),
      impact: z.enum(["supports", "weakens", "neutral", "uncertain"]),
      rationale: z.string(),
    })
  ),
});

// --- Gemini Impact OpenAPI Schema ---

const geminiImpactResponseSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    impacts: {
      type: SchemaType.ARRAY,
      description: "Evaluation of how each provided piece of evidence impacts the thesis.",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          evidenceId: { type: SchemaType.STRING },
          impact: {
            type: SchemaType.STRING,
            format: "enum",
            enum: ["supports", "weakens", "neutral", "uncertain"],
            description: "How this evidence affects the user's thesis reasoning.",
          },
          rationale: { type: SchemaType.STRING, description: "A strict, factual explanation (1-2 sentences max) of why this evidence supports or weakens the thesis." },
        },
        required: ["evidenceId", "impact", "rationale"],
      },
    },
  },
  required: ["impacts"],
};

/**
 * Jarvis service — structured thesis review with live LLM and factual grounding.
 */
export class JarvisService {
  constructor(private llm: LLMProvider) {}

  async reviewThesis(
    input: JarvisReviewInput
  ): Promise<JarvisReviewOutput> {
    
    // 1. Fetch grounded intelligence
    // The companyId is expected to be passed from the route.
    // For V1, the thesisId is structured as `thesis-${companyId}` or we extract companyId from thesis.
    // Assuming thesisId roughly contains or maps to companyId. Let's extract it (e.g. hdfc-bank).
    const companyId = input.thesisId.replace("thesis-", ""); 
    
    const intelligence = await researchService.getResearchIntelligence(companyId);
    
    // 2. Build Context
    let contextData = "NO EXTERNAL EVIDENCE AVAILABLE.";
    if (intelligence) {
      contextData = `
### Current Market Data
${intelligence.keyChanges.map((kc) => `- ${kc.title}: ${kc.description}`).join("\n")}

### Recent News & Evidence
${intelligence.evidence
  .map(
    (e) => `
ID: ${e.id}
Title: ${e.title}
Summary: ${e.summary}
Date: ${e.publishedAt}
Source: ${e.source.publisher}
`
  )
  .join("\n")}
`;
    }

    const systemPrompt = `
You are Jarvis, an analytical reasoning engine for investment research. 
Your core principle is: FACTS FIRST. AI SECOND.

You are reviewing an investment thesis for a user.
You must evaluate the structure, reasoning, and factual support of their thesis based ONLY on the provided Context Data.

RULES:
1. Use ONLY the supplied Context Data for factual claims.
2. Do not invent financial figures, events, sources, or URLs.
3. Distinguish FACT from INFERENCE. Never present an inference as a confirmed fact.
4. If the Context Data does not contain enough information to support a claim in the user's thesis, flag it as a gap.
5. Provide NO investment recommendations (No Buy/Sell/Target Price/Trading Signals). Focus on research quality.
6. When explaining strengths or gaps, reference the IDs of the evidence you used if applicable.
`;

    const userPrompt = `
### Context Data (Verified Facts)
${contextData}

---

### User's Investment Thesis

Thesis Statement:
${input.thesis}

Supporting Reasons:
${input.supportingReasons.map((r) => `- ${r}`).join("\n")}

Risks:
${input.risks.map((r) => `- ${r}`).join("\n")}

Invalidation Criteria:
${input.invalidationCriteria.map((r) => `- ${r}`).join("\n")}

Time Horizon: ${input.timeHorizon}
Conviction Score: ${input.conviction}/100

---
Review this thesis based strictly on the provided Context Data and your system rules. Return the structured JSON output as defined by your schema.
`;

    // 3. Call LLM
    const llmResponse = await this.llm.analyze({
      systemPrompt,
      userPrompt,
      responseSchema: geminiResponseSchema,
    });

    // 4. Validate and Parse
    let parsedJson;
    try {
      parsedJson = JSON.parse(llmResponse.content);
    } catch (_e) {
      console.error("[JarvisService] Failed to parse LLM JSON response");
      throw new Error("Invalid response format from LLM", { cause: _e });
    }

    const validated = jarvisOutputSchema.safeParse(parsedJson);

    if (!validated.success) {
      console.error(
        "[JarvisService] LLM output failed schema validation:",
        validated.error.format()
      );
      throw new Error("LLM output did not match expected structure");
    }

    const now = new Date().toISOString();

    return {
      thesisId: input.thesisId,
      overallAssessment: validated.data.overallAssessment,
      strengths: validated.data.strengths,
      gaps: validated.data.gaps,
      questions: validated.data.questions,
      thesisQuality: validated.data.thesisQuality as ThesisQuality,
      confidenceAssessment: validated.data.confidenceAssessment as ConfidenceAssessment,
      reviewedAt: now,
    };
  }

  /**
   * Evaluates the impact of a batch of evidence on an existing thesis.
   */
  async evaluateEvidenceImpact(
    thesis: { statement: string; supportingReasons: string[]; risks: string[]; invalidationCriteria: string[] },
    evidence: { id: string; title: string; summary: string | null }[]
  ): Promise<{ evidenceId: string; impact: string; rationale: string }[]> {
    if (evidence.length === 0) return [];

    const systemPrompt = `
You are Jarvis, an analytical reasoning engine for investment research.
Your core principle is: FACTS FIRST. AI SECOND.

You will be given an active Investment Thesis and a list of new factual Evidence.
Your job is to determine how EACH piece of evidence affects the Thesis.

RULES:
1. Return a JSON object with an "impacts" array.
2. For each evidence item, you MUST include its ID, determine the impact (supports, weakens, neutral, or uncertain), and provide a short, factual rationale.
3. Rationale MUST strictly reference the evidence content and connect it to a specific part of the thesis (statement, reasons, risks, or invalidation).
4. Do not invent facts or assumptions.
    `;

    const userPrompt = `
### User's Investment Thesis

Thesis Statement:
${thesis.statement}

Supporting Reasons:
${thesis.supportingReasons.map((r) => `- ${r}`).join("\n")}

Risks:
${thesis.risks.map((r) => `- ${r}`).join("\n")}

Invalidation Criteria:
${thesis.invalidationCriteria.map((r) => `- ${r}`).join("\n")}

---

### New Evidence

${evidence.map((e) => `ID: ${e.id}\nTitle: ${e.title}\nSummary: ${e.summary || "N/A"}\n`).join("---\n")}
    `;

    const llmResponse = await this.llm.analyze({
      systemPrompt,
      userPrompt,
      responseSchema: geminiImpactResponseSchema,
    });

    let parsedJson;
    try {
      parsedJson = JSON.parse(llmResponse.content);
    } catch (e) {
      console.error("[JarvisService] Failed to parse LLM impact JSON response");
      throw new Error("Invalid response format from LLM", { cause: e });
    }

    const validated = impactOutputSchema.safeParse(parsedJson);

    if (!validated.success) {
      console.error(
        "[JarvisService] LLM impact output failed schema validation:",
        validated.error.format()
      );
      throw new Error("LLM impact output did not match expected structure");
    }

    return validated.data.impacts;
  }
}
