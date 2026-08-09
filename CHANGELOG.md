# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### [0.1.0] - Sprint 7.2 (Thesis History — Phase 5)
- **What changed**: Introduced Thesis History snapshotting, ensuring user reasoning is never silently overwritten.
- **Why it changed**: Fulfills the "Maintain historical snapshots" requirement of Phase 5, allowing users to track how their thesis evolves over time.
- **Architecture**:
  - `thesis.repository.ts` now uses Prisma `$transaction` blocks to simultaneously save to `InvestmentThesis` and `InvestmentThesisVersion` on both create and update operations.
  - Added `GET /api/theses/:id/versions` API endpoint.
  - Frontend `ThesisBuilderPage` features a new "History" slide-over panel displaying previous versions, dates, and conviction scores.
- **What changed**: Introduced Thesis Monitoring by connecting the `ResearchIntelligence` ingestion pipeline to `JarvisService`. 
- **Why it changed**: Initiates Phase 5 (Thesis Intelligence), enabling Nexora to automatically evaluate how new evidence (`high`/`medium` materiality) impacts a user's active thesis.
- **Architecture**:
  - `ThesisImpact` model added to Prisma schema.
  - `JarvisService.evaluateEvidenceImpact` uses LLM to strictly evaluate evidence against thesis statements and return structured `supports`, `weakens`, `neutral`, or `uncertain` impacts.
  - Synchronous pipeline limits evaluation to 3 new evidence pieces per request to ensure UI responsiveness.
- **What changed**: Added data freshness classification and a rule-based materiality engine to the research pipeline.
- **Why it changed**: Completes Phase 4 (Research Engine) by enabling Nexora to automatically determine whether new evidence is fresh/stale and whether it is significant enough to warrant user attention.
- **Architecture**:
  - `MaterialityService`: Keyword-based classifier (no LLM calls) for `high`, `medium`, `low`, `unknown` materiality.
  - `classifyFreshness()`: Time-based classifier for `fresh` (< 24h), `recent` (< 7d), `stale` (> 7d).
  - Frontend: Evidence cards now display colored materiality badges and freshness indicators.

### [0.1.0] - Sprint 6.9 (Research Pipeline Migration)
- **What changed**: Refactored the `ResearchIntelligenceService` to persist external news and market data into the SQLite database.
- **Why it changed**: Completes Phase 4 (Research Pipeline Migration) by ensuring that any intelligence surfaced in the UI is safely archived and attributed to a canonical Source, maintaining data provenance for all Investment Theses.
- **Architecture**:
  - `ResearchRepository`: Added `Evidence`, `Source`, and `ResearchEvent` persistence logic.
  - `ResearchIntelligenceService`: Now acts as a data synchronizer. It fetches live data from `marketData` and `news` providers, upserts it into the SQLite DB, and then queries the DB to construct the `ResearchIntelligence` contract. The frontend contract remained completely untouched.

### [0.1.0] - Sprint 6.8 (Mock Persistence Replacement)
- **What changed**: Wired the `Company` and `JarvisReview` domain models to the Prisma database, removing static mocks.
- **Why it changed**: Completes Phase 3 (Persistence) by ensuring all core user-generated and LLM-generated data is saved reliably.
- **Architecture**:
  - `CompanyRepository`: Auto-seeds missing companies to prevent UI breakages while in development.
  - `JarvisRepository`: Saves Gemini LLM outputs (`strengths`, `gaps`, `questions`) persistently.
  - Frontend: `ThesisBuilderPage` now proactively fetches saved LLM reviews before deciding to ping the AI, drastically cutting down on redundant LLM token costs.

### [0.1.0] - Sprint 6.7 (Persistence & Authentication Foundation)
- **What changed**: Integrated Prisma ORM with SQLite (as a temporary Docker-free replacement for PostgreSQL) and built the initial authentication foundation.
- **Why it changed**: Nexora requires persistent storage and user identity to save Investment Theses and Watchlists securely across sessions.
- **Architecture**: 
  - Prisma Schema: Modeled `User`, `Company`, `InvestmentThesis`, and `JarvisReview`.
  - Service Layer: Added `AuthService` (bcrypt/jwt) and `ThesisRepository`.
  - Frontend: Replaced static local mocks with authenticated `fetch` calls to `/api/theses`. Added an `AuthProvider` and `/login` page.
- **Security**: JWT verification middleware protects private domain routes.

### [0.1.0] - Sprint 6.6 (Production Architecture Verification)
- **What changed**: Conducted a comprehensive technical audit of the codebase to verify architectural stability before beginning Phase 3 (Persistence).
- **Why it changed**: To ensure the provider abstraction, domain contracts, and security measures adhere strictly to the `NEXORA_MASTER_EXECUTION_SPEC.md` and are ready for database integration.
- **Documentation**: Created `docs/ARCHITECTURE.md` mapping the modular monolith design, provider registry, and AI grounding strategy.
- **Verification**: Confirmed zero lint/build errors across the frontend and backend. Confirmed zero secrets in Git history.

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
