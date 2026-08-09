import { GoogleGenerativeAI, Schema } from "@google/generative-ai";
import type { LLMProvider, LLMRequest, LLMResponse } from "../types.js";

interface GeminiProviderConfig {
  apiKey: string;
}

/**
 * Gemini Provider using the official Google Gen AI SDK.
 * Configured specifically for structured JSON output (gemini-1.5-pro).
 */
export class GeminiProvider implements LLMProvider {
  name = "gemini";
  private genAI: GoogleGenerativeAI;
  private modelName = "gemini-1.5-pro";

  constructor(config: GeminiProviderConfig) {
    this.genAI = new GoogleGenerativeAI(config.apiKey);
  }

  async analyze(request: LLMRequest): Promise<LLMResponse> {
    console.log(`[Gemini] Starting analysis using ${this.modelName}`);

    // Map the generic JSON schema to the SDK's Schema type if provided
    const responseSchema = request.responseSchema as Schema | undefined;

    const model = this.genAI.getGenerativeModel({
      model: this.modelName,
      systemInstruction: request.systemPrompt,
      generationConfig: {
        responseMimeType: "application/json",
        ...(responseSchema && { responseSchema }),
      },
    });

    try {
      const result = await model.generateContent(request.userPrompt);
      const text = result.response.text();

      return {
        content: text,
        model: this.modelName,
        tokensUsed: result.response.usageMetadata?.totalTokenCount ?? 0,
      };
    } catch (error) {
      console.error(
        "[Gemini] API Error:",
        error instanceof Error ? error.message : "Unknown error"
      );
      throw error;
    }
  }
}
