# Master Specification Audit

This document is a brutally honest gap analysis of Nexora's current state versus the `NEXORA_MASTER_EXECUTION_SPEC.md`.

## 1. Evidence Before AI
✅ **IMPLEMENTED + VERIFIED**
- System strictly fetches `ResearchIntelligence` before building LLM contexts. LLM is an evaluation engine, not a search engine.

## 2. No Hallucinated Financial Facts
✅ **IMPLEMENTED + VERIFIED**
- Prompt strictness and Zod schemas enforce that the LLM grounds its analysis in the provided evidence.

## 3. No Trading Recommendations
✅ **IMPLEMENTED + VERIFIED**
- `evaluateEvidenceImpact` only returns `supports`, `weakens`, `neutral`, `uncertain`. It does not output "buy" or "sell".

## 4. Canonical Company Identity
🟡 **PARTIALLY IMPLEMENTED**
- **What exists:** A SQLite table with `Company` and `CompanyIdentifier`, plus a `searchCompanies` endpoint.
- **What is missing:** A robust live connection to seed canonical identity from real providers. It currently auto-seeds from hardcoded mock lists in `backend/src/services/company.service.ts` and `mockCompanies`.
- **Exact files:** `backend/src/services/company.service.ts`, `backend/src/domains/company/mock.ts`.
- **Severity:** P1 (Important).
- **Recommended fix:** When a user searches, the backend should query an external provider (e.g. Indian API) and normalize the result into the database, rather than falling back to local mocks.

## 5. Research Intelligence Data Provenance
✅ **IMPLEMENTED + VERIFIED**
- All evidence fetched via the providers is attributed to a canonical `Source` table and retains URL, publisher, and timestamp.

## 6. Data Deduplication
🟡 **PARTIALLY IMPLEMENTED**
- **What exists:** The `ResearchIntelligenceService` upserts evidence based on external URLs or generated IDs.
- **What is missing:** Real semantic deduplication (e.g. matching two articles with slightly different URLs but the same story).
- **Exact files:** `backend/src/services/research-intelligence.service.ts`.
- **Severity:** P2 (Improvement).
- **Recommended fix:** Implement a hash or similarity check on the normalized title/summary before inserting into the DB.

## 7. Data Freshness
✅ **IMPLEMENTED + VERIFIED**
- The `classifyFreshness` function in `MaterialityService` correctly tags `fresh`, `recent`, and `stale`.

## 8. Materiality Engine
✅ **IMPLEMENTED + VERIFIED**
- `MaterialityService` currently runs a keyword-based classifier to assign `high`, `medium`, `low`.

## 9. Investment Thesis (Persistence)
✅ **IMPLEMENTED + VERIFIED**
- Prisma ORM successfully persists theses, including conviction and time horizons, with strict ownership.

## 10. Thesis History
✅ **IMPLEMENTED + VERIFIED**
- Saves to `InvestmentThesisVersion` inside a Prisma transaction upon every update.

## 11. Jarvis Review
✅ **IMPLEMENTED + VERIFIED**
- The integration with Gemini is fully operational, structured via Zod, and gracefully handles `strengths`, `gaps`, and `questions`.

## 12. Thesis Monitoring
✅ **IMPLEMENTED + VERIFIED**
- `JarvisService.evaluateEvidenceImpact` handles this. The application calculates the impact and triggers a notification if the thesis is weakened.

## 13. Daily Research (Live Scheduled Ingestion)
❌ **NOT IMPLEMENTED**
- **What exists:** Data is fetched and normalized *on-demand* when a user requests a Daily Briefing or views a Research Workspace.
- **What is missing:** A cron job or scheduled worker (e.g., BullMQ) that wakes up, fetches new data for watchlisted companies, runs materiality, and saves to the database asynchronously.
- **Exact files:** No worker currently exists. Missing from `backend/src/index.ts` or a separate worker process.
- **Severity:** P0 (Blocking for a real product).
- **Recommended fix:** Integrate a lightweight scheduler (like `node-cron` or `bullmq`) in the backend to poll providers for watchlisted companies automatically.

## 14. Notifications
✅ **IMPLEMENTED + VERIFIED**
- Integrated into Prisma, populated upon thesis weakening, and exposed in `TopNavigation.tsx` via a dropdown bell.

## 15. Daily Briefing
✅ **IMPLEMENTED + VERIFIED**
- Users can manually trigger a briefing generation on their dashboard that synthesizes overnight fresh/recent evidence.

## 16. Target Database (PostgreSQL)
⚠️ **IMPLEMENTED BUT NEEDS PRODUCTION HARDENING**
- **What exists:** The `docker-compose.yml` spins up a PostgreSQL container, but the application uses `sqlite` in `schema.prisma`.
- **What is missing:** Proper `provider = "postgresql"` in Prisma, and a database URL environment variable swap.
- **Exact files:** `backend/prisma/schema.prisma`, `backend/.env.example`.
- **Severity:** P0 (Blocking for multi-container production scaling).
- **Recommended fix:** Change the provider to `postgresql`, migrate the database, and update the CI to accommodate it.

## 17. Authentication
🟡 **PARTIALLY IMPLEMENTED**
- **What exists:** Full JWT/bcrypt implementation in `backend/src/services/auth.service.ts`, plus `requireAuth` middleware and `AuthContext` on the frontend.
- **What is missing:** Robust cross-user data isolation tests. While `userId` is bound to Theses and Watchlists, there are no integration tests validating that User A cannot fetch User B's thesis.
- **Exact files:** `backend/src/routes/thesis.routes.ts`. (Quick audit confirms it filters by `req.userId`, but testing is missing).
- **Severity:** P1 (Important).
- **Recommended fix:** Write API integration tests covering IDOR vulnerabilities to mathematically prove data isolation.

## 18. Frontend UX & Architecture
✅ **IMPLEMENTED + VERIFIED**
- Clean, editorial style. Heavy use of domains, custom hooks, and Lucide icons instead of generic chatbot UI.

## 19. Security
⚠️ **IMPLEMENTED BUT NEEDS PRODUCTION HARDENING**
- **What exists:** API keys remain strictly backend. `.env` is ignored.
- **What is missing:** Rate limiting, strict CORS (currently overly permissive), and helmet/security headers.
- **Exact files:** `backend/src/index.ts`.
- **Severity:** P1 (Important).
- **Recommended fix:** Install `helmet` and `express-rate-limit` to secure production endpoints.

## 20. Testing
❌ **NOT IMPLEMENTED**
- **What exists:** Backend linting, Frontend linting, strict TypeScript building via CI/CD.
- **What is missing:** Unit tests (Vitest/Jest), Integration tests (Supertest).
- **Exact files:** No test suites exist in `backend/` or `frontend/`.
- **Severity:** P0 (Blocking for a real startup product).
- **Recommended fix:** Add Vitest and configure test suites for `JarvisService`, `AuthService`, and all API routes.

## 21. AI Provider Abstraction
✅ **IMPLEMENTED + VERIFIED**
- `JarvisService` only interacts with `LLMProvider`. Providers inject via `config/providers.ts`.
