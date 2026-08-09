import type { LLMProvider, LLMRequest, LLMResponse } from "../types.js";

/**
 * Mock LLM provider that returns pre-structured responses.
 * When real credentials are available, this is replaced by
 * GeminiProvider or GrokProvider — same interface, same service code.
 */
export class MockLLMProvider implements LLMProvider {
  name = "mock";

  async analyze(request: LLMRequest): Promise<LLMResponse> {
    // Simulate latency
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Return a structured mock response
    // The actual content depends on the system prompt context
    void request;

    return {
      content: JSON.stringify({
        summary:
          "This is a mock LLM response. When real credentials are configured, this will be replaced by structured Gemini or Grok output.",
        reasoning: "Mock reasoning for development purposes.",
      }),
      model: "mock-v1",
      tokensUsed: 0,
    };
  }
}
