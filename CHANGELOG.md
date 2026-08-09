# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### [0.1.0] - Sprint 6.5 (Grounded Jarvis V1)

### Added
- **Gemini Provider (`@google/generative-ai`)**: Implemented the official Google Gen AI SDK in the backend for real AI reasoning.
- **Structured JSON Output**: Configured `gemini-1.5-pro` with strict OpenAPI schema validation via Zod to guarantee well-formed reviews.
- **Context Builder Grounding**: Jarvis now bases reviews *strictly* on real market data and news fetched from the Research Intelligence service, preventing hallucination.
- **Jarvis UI Loading/Error States**: Added professional loading states ("Jarvis is reviewing...") and graceful error handling on the frontend.
- **Provider Auto-Detection**: Backend `ProviderRegistry` now auto-detects `GEMINI_API_KEY` and falls back to `MockLLMProvider` seamlessly if missing.

## [0.1.0] - Sprint 6.4 (Real Data Provider Integration)
### Sprint 6.3: Real Data + Backend Architecture
- **What changed**: Created the complete backend foundation for Nexora's real data platform.
- **Why it changed**: Nexora is transitioning from mock-only frontend to a backend-powered architecture capable of ingesting real Indian equity research data (Phase 2 of Master Plan).
- **Provider research**: Evaluated Indian API, Alpha Vantage, TrueData for market/fundamental data; Gemini and Grok for LLM. Recommended Indian API (primary) + Alpha Vantage (backup) + Gemini free tier (LLM).
- **Backend stack**: Node.js + Express + TypeScript + Zod.
- **Architecture**:
  - Provider adapter pattern (MarketData, Fundamentals, News, LLM interfaces)
  - Canonical company identity (NSE/BSE/ISIN mapping)
  - Data provenance model (source attribution + freshness tracking)
  - Mock implementations for all four provider types
  - Zod-validated API inputs
  - Express routes for companies, research, quotes, news, and Jarvis review
  - Typed environment configuration
- **Database schema**: Documented (companies, sources, evidence, events, theses, reviews, ingestion) but not implemented — deferred to Phase 4 per master plan.
- **Security**: All API keys backend-only via `.env`; `.gitignore` updated to protect secrets.
- **Files created**: 18 new files in `backend/src/`
- **Verification**: Backend lint ✅, backend build ✅, frontend lint ✅, frontend build ✅
- **Next milestone**: Wire a real data provider (Indian API or Alpha Vantage) behind the adapter interfaces when credentials are available.

### Sprint 6.2: Research Intelligence UI Foundation
- **What changed**: Added source-attributed research data UI to the Research Workspace.
- **Why it changed**: To surface factual, provider-agnostic research data alongside Jarvis's synthesized analysis.
- **Architecture**: New `features/research-intelligence/sections/` with 5 section components consuming the research-intelligence domain contract.
- **Verification**: Lint and build passed.

### Sprint 6.1: Real Intelligence Data Contract
- **What changed**: Created the `research-intelligence` domain model.
- **Why it changed**: To define a strongly typed, framework-independent contract for real-world research data.
- **Architecture**: Pure TypeScript, no React dependencies. Kept separate from `investment-intelligence`.
- **Verification**: Lint and build passed.
