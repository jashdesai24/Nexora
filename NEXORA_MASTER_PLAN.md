# NEXORA — MASTER PRODUCT & ENGINEERING PLAN

Version: 1.0
Product: Nexora
Category: Investment Intelligence OS
Status: Active Development

---

# 1. PRODUCT VISION

Nexora is an Investment Intelligence Operating System designed to help investors:

1. Discover important companies and developments.
2. Understand why something matters.
3. Research evidence, risks, catalysts and changes.
4. Form their own investment thesis.
5. Have Jarvis challenge the reasoning.
6. Improve and monitor that thesis over time.

Nexora is NOT intended to be:

- a brokerage
- a trading terminal
- a stock-tip platform
- a social network
- a generic AI chatbot
- a news aggregator
- a collection of financial charts

The core product philosophy is:

> Help users think better about investments rather than tell them what to buy.

---

# 2. CORE PRODUCT LOOP

The primary product loop is:

Dashboard
    ↓
Discover Company
    ↓
Research Workspace
    ↓
Investment Intelligence
    ↓
Investment Thesis
    ↓
Jarvis Review
    ↓
Improve Thesis
    ↓
Monitor Thesis
    ↓
New Evidence
    ↓
Jarvis Re-evaluation
    ↓
Updated Thesis

This loop is the heart of Nexora.

---

# 3. PRODUCT PRINCIPLES

Every feature must satisfy these principles.

## 3.1 Reasoning over recommendations

Nexora should explain:

- What happened?
- Why does it matter?
- What evidence supports the view?
- What could invalidate it?
- What remains uncertain?

Avoid:

- Buy
- Sell
- Strong Buy
- Strong Sell
- Price targets
- Trading signals

---

## 3.2 Evidence before AI

AI should not invent the reasoning foundation.

The preferred architecture is:

Data
↓
Evidence
↓
Research Intelligence
↓
Thesis
↓
AI reasoning
↓
Jarvis Review

---

## 3.3 User remains in control

Jarvis should:

- challenge assumptions
- identify gaps
- ask questions
- organize reasoning
- surface contradictions
- highlight changes

Jarvis should NOT:

- automatically rewrite the user's thesis
- make investment decisions
- place trades
- manipulate conviction
- pretend certainty

---

## 3.4 Persistent artifacts

Every meaningful interaction should eventually produce something persistent.

Examples:

Research
→ Research Intelligence

Thesis
→ Investment Thesis

Jarvis
→ Review History

Monitoring
→ Thesis Timeline

Changes
→ Evidence/Event History

---

# 4. USER EXPERIENCE PHILOSOPHY

Nexora must feel like a professional investment research product.

The UI must NOT feel like:

- generic AI software
- chatbot UI
- futuristic AI dashboard
- excessive gradients
- excessive glassmorphism
- neon interfaces
- huge collections of cards
- unnecessary animations

Preferred visual direction:

- editorial
- professional
- calm
- premium
- information-dense but readable
- excellent typography
- generous whitespace
- subtle dividers
- restrained colors
- purposeful motion

The UI should resemble a serious research environment rather than an AI demo.

---

# 5. CURRENT FRONTEND ARCHITECTURE

The frontend is React + TypeScript.

Current conceptual structure:

src/
├── app/
├── components/
│   └── ui/
├── domains/
│   ├── investment-intelligence/
│   ├── investment-thesis/
│   ├── jarvis-review/
│   └── research-intelligence/
├── features/
│   ├── dashboard/
│   ├── research/
│   ├── thesis/
│   └── jarvis-review/
├── layouts/
├── pages/
└── routes/

Architecture principle:

Domain
↓
Service
↓
Page
↓
Section
↓
Component

---

# 6. DOMAIN LAYER

The domain layer must remain framework-independent.

Domain code must NOT import:

- React
- Tailwind
- JSX
- browser APIs
- UI components

The domain layer represents business concepts.

---

# 7. EXISTING DOMAINS

## Investment Intelligence

Responsible for structured research reasoning.

Contains concepts such as:

- evidence
- risks
- catalysts
- confidence
- questions
- company context

Current implementation initially uses mock data.

---

## Investment Thesis

Represents the user's investment reasoning.

Core concepts:

- thesis statement
- supporting reasons
- risks
- invalidation criteria
- conviction
- time horizon
- status
- timestamps

---

## Jarvis Review

Evaluates thesis quality.

Jarvis can identify:

- strengths
- gaps
- questions
- thesis quality
- confidence assessment

Jarvis must remain advisory.

---

## Research Intelligence

Responsible for real-world research information.

Core concepts:

- sources
- evidence
- events
- key changes
- thesis impacts

This layer will eventually receive information from real external data providers.

---

# 8. RESEARCH INTELLIGENCE ARCHITECTURE

The future intelligence pipeline should look like:

External Sources
    ↓
Data Ingestion
    ↓
Normalization
    ↓
Research Intelligence
    ↓
Evidence / Events
    ↓
Company Intelligence
    ↓
Thesis Impact
    ↓
Jarvis

Possible data categories:

- market data
- company fundamentals
- earnings
- filings
- corporate announcements
- reputable financial news
- company disclosures
- macroeconomic information

Do not connect providers until the domain contract is stable.

---

# 9. SOURCE ATTRIBUTION

Every external factual claim should eventually have source attribution.

A source should support:

- publisher
- title
- URL
- publication timestamp
- source type

The user should be able to understand:

> Where did this information come from?

Avoid opaque AI-generated claims.

---

# 10. LIVE INFORMATION

Nexora must eventually respond to changing information.

The product should NOT permanently display the same research content.

For example:

Day 1:
New earnings information appears.

Day 2:
A management announcement changes the context.

Day 3:
A new filing changes an assumption.

Nexora should detect:

New information
↓
Changed evidence
↓
Changed research interpretation
↓
Potential thesis impact
↓
Jarvis review

---

# 11. DASHBOARD

The dashboard is the user's starting point.

Current concepts include:

- Morning Intelligence / Briefing
- Market Pulse
- Companies Worth Investigating
- Recent Theses

The dashboard should answer:

> What deserves my attention today?

It should NOT become an overwhelming financial terminal.

---

# 12. RESEARCH WORKSPACE

The Research Workspace is the main company investigation environment.

Current reasoning flow:

1. Why Today
2. Evidence
3. Risks
4. Catalysts
5. Confidence
6. Next Questions

The workspace should help users understand:

> Why does this company deserve my attention?

---

# 13. INVESTMENT THESIS BUILDER

The Thesis Builder should feel like writing an investment memo.

Not a generic form.

Core sections:

- Thesis statement
- Supporting reasons
- Risks
- Invalidation criteria
- Conviction
- Time horizon

The user's writing should remain the visual priority.

---

# 14. JARVIS REVIEW

Jarvis is the reasoning companion.

The intended interaction:

User writes thesis
↓
User requests review
↓
Jarvis analyzes reasoning
↓
Jarvis identifies strengths
↓
Jarvis identifies gaps
↓
Jarvis asks questions
↓
User improves thesis
↓
User reviews again

Jarvis should challenge the investor without taking control.

---

# 15. THESIS IMPROVEMENT LOOP

Current UX:

Write
↓
Review
↓
Identify Gap
↓
Address This
↓
Jump to Relevant Thesis Section
↓
Edit
↓
Review Again

The system should track whether a previous review has become outdated after thesis edits.

---

# 16. THESIS MONITORING

Future capability.

After a thesis is saved:

Nexora monitors relevant information.

New evidence
↓
Evaluate thesis impact
↓
Supports / Weakens / Neutral / Uncertain
↓
Notify user
↓
Jarvis explains why

The user decides whether the thesis should change.

---

# 17. THESIS HISTORY

Future capability.

Store versions of a thesis.

Example:

August
Conviction: 72

September
Conviction: 65

October
Conviction: 81

Each version should eventually record:

- what changed
- why it changed
- evidence responsible
- user reasoning
- Jarvis observations

This creates a long-term record of investment thinking.

---

# 18. JARVIS EVOLUTION

Jarvis should evolve in phases.

## Phase 1

Deterministic mock review.

Already implemented.

## Phase 2

AI-powered structured review.

LLM receives structured thesis data.

## Phase 3

Evidence-aware review.

LLM receives:

- thesis
- evidence
- risks
- sources
- events

## Phase 4

Change-aware review.

Jarvis compares:

Previous thesis
vs
Current evidence
vs
Current thesis

## Phase 5

Continuous thesis monitoring.

Jarvis proactively identifies meaningful changes.

---

# 19. AI ARCHITECTURE

Do not create a generic chatbot.

Instead build specialized AI workflows.

Example:

Research synthesis
→ Research Agent

Thesis review
→ Thesis Review Agent

Evidence analysis
→ Evidence Agent

Change detection
→ Thesis Monitoring Agent

The AI system should produce structured outputs matching domain contracts.

---

# 20. AI SAFETY / QUALITY

AI responses must:

- distinguish facts from interpretation
- provide sources where applicable
- express uncertainty
- avoid fabricated evidence
- avoid unsupported conclusions
- avoid investment recommendations

AI output should be structured and validated before reaching the UI.

---

# 21. BACKEND

Eventually introduce a backend layer.

Preferred conceptual architecture:

Frontend
    ↓
API
    ↓
Application Services
    ↓
Domain
    ↓
Database
    ↓
External Data Providers
    ↓
AI Services

Do not expose provider API keys in the frontend.

---

# 22. DATABASE

The database should eventually persist:

Users
Companies
Sources
Research Evidence
Research Events
Investment Theses
Thesis Versions
Jarvis Reviews
Watchlists
Portfolio References
Notifications
User Preferences

Use migrations and typed database access.

Avoid putting business logic directly into database queries.

---

# 23. AUTHENTICATION

Eventually support:

- user registration
- login
- session management
- protected routes
- user-specific theses
- user-specific watchlists

Security requirements:

- hashed passwords where applicable
- secure sessions/tokens
- server-side authorization
- no secrets in frontend code

---

# 24. WATCHLIST

Users should eventually be able to follow companies.

A watchlist should not simply show prices.

It should answer:

> Has anything important changed regarding the companies I care about?

---

# 25. NOTIFICATIONS

Notifications should be meaningful.

Examples:

- Important new evidence
- Earnings event
- Thesis-impacting development
- Thesis review becoming stale

Avoid notification spam.

---

# 26. PORTFOLIO

Portfolio functionality comes later.

It should be designed around:

- understanding holdings
- monitoring thesis
- understanding changes

Not around trading.

Nexora is not a brokerage.

---

# 27. REAL DATA LAYER

Before selecting external providers, evaluate:

- Indian market coverage
- reliability
- licensing
- cost
- rate limits
- historical data
- corporate actions
- earnings
- filings
- news
- API quality
- production suitability

Never hard-code provider-specific models into the domain.

Use adapters:

Domain Contract
↓
Provider Adapter
↓
External API

This allows providers to be replaced later.

---

# 28. PROVIDER-AGNOSTIC DESIGN

Bad:

Frontend
↓
Provider-specific response

Good:

External API
↓
Adapter
↓
Normalized Research Intelligence
↓
Domain
↓
UI

---

# 29. CACHING

Real research data should eventually be cached.

Goals:

- reduce API costs
- reduce latency
- avoid unnecessary duplicate requests
- maintain predictable user experience

Use appropriate cache expiration based on data type.

---

# 30. DATA FRESHNESS

Different information has different freshness requirements.

Examples:

Market information
→ very short freshness

News
→ short freshness

Company fundamentals
→ longer freshness

Historical filings
→ persistent

The system should track:

- publishedAt
- fetchedAt
- processedAt
- freshness status

---

# 31. SEARCH

Eventually provide company search.

Search should support:

- company name
- ticker
- identifier
- aliases

Search results should be fast and clean.

---

# 32. ERROR HANDLING

Every real data workflow needs:

Loading
↓
Success
↓
Empty
↓
Partial
↓
Error

Never leave the user with a blank screen.

Errors should explain:

What happened
What can be done next

Avoid technical stack traces in the UI.

---

# 33. OBSERVABILITY

Production system should eventually track:

- API failures
- latency
- data ingestion failures
- AI failures
- malformed provider data
- authentication failures
- important frontend errors

Do not log secrets or sensitive user information.

---

# 34. TESTING

Testing strategy:

## Unit tests

Domain logic.

## Integration tests

Services + database.

## Component tests

Important interactive UI.

## End-to-end tests

Critical user journeys.

Minimum critical flow:

Dashboard
→ Research
→ Thesis
→ Jarvis Review
→ Improve Thesis

---

# 35. PERFORMANCE

Keep the application fast.

Priorities:

- lazy loading
- code splitting
- efficient API calls
- caching
- optimized rendering
- image optimization
- minimal unnecessary dependencies

Do not install libraries merely for visual effects.

---

# 36. ACCESSIBILITY

Support:

- keyboard navigation
- semantic HTML
- visible focus
- sufficient contrast
- screen-reader labels
- accessible forms

---

# 37. RESPONSIVE DESIGN

Support:

Desktop
Tablet
Mobile

Desktop is the primary research environment, but the application should remain usable on smaller screens.

---

# 38. DESIGN SYSTEM

Maintain centralized:

- colors
- typography
- spacing
- radius
- shadows
- transitions

Use shared components where appropriate.

Do not create slightly different versions of the same component.

---

# 39. UI QUALITY RULE

Before considering a feature complete:

Ask:

Does this look like a real product?

Does the interaction make sense?

Does the feature solve a real user problem?

Does it reduce cognitive load?

Does it feel consistent with the rest of Nexora?

Would a serious investor trust the interface?

---

# 40. NO FEATURE CREEP

Do not add features simply because they sound impressive.

Prioritize features that improve the core loop:

Research
→ Thesis
→ Review
→ Improve
→ Monitor

---

# 41. DEVELOPMENT PHASES

## PHASE 1 — FOUNDATION

Completed:

- React/TypeScript foundation
- Routing
- Dashboard
- Research Workspace
- Design foundation
- Investment Intelligence domain
- Investment Thesis domain
- Thesis Builder
- Jarvis Review domain
- Jarvis Review UI
- Thesis Improvement Loop

---

## PHASE 2 — REAL INTELLIGENCE

Current:

- Research Intelligence contract

Next:

- Data provider evaluation
- Backend API
- Provider adapters
- Data normalization
- Source attribution
- Research ingestion
- Real company intelligence

---

## PHASE 3 — REAL JARVIS

Build:

- structured AI prompts
- output validation
- evidence-aware reasoning
- thesis review
- uncertainty handling
- source-aware responses

---

## PHASE 4 — PERSISTENCE

Build:

- database
- users
- theses
- thesis versions
- reviews
- evidence
- events

---

## PHASE 5 — MONITORING

Build:

- company watchlist
- thesis monitoring
- change detection
- thesis impact
- meaningful notifications
- review history

---

## PHASE 6 — PRODUCTION

Build:

- authentication
- security
- observability
- testing
- performance
- accessibility
- deployment
- production environment configuration

---

# 42. DEFINITION OF DONE

A feature is complete only when:

- functionality works
- architecture is clean
- responsive behavior works
- loading state exists where needed
- error state exists where needed
- empty state exists where needed
- accessibility is reasonable
- lint passes
- build passes
- unrelated functionality is not broken

---

# 43. AGENT WORKFLOW

Antigravity should follow this process for every task:

1. Read PROJECT_CONTEXT.md.
2. Read NEXORA_MASTER_PLAN.md.
3. Inspect existing implementation.
4. Identify reusable components.
5. Produce a short implementation plan.
6. Implement only the requested scope.
7. Run lint.
8. Run build.
9. Review changed files.
10. Report:
   - files changed
   - architecture
   - UX decisions
   - verification
   - known limitations

Never silently expand scope.

---

# 44. CHANGE MANAGEMENT

Maintain:

CHANGELOG.md

Each sprint should record:

- Sprint number
- What changed
- Why it changed
- Important architecture decisions
- Verification
- Next milestone

---

# 45. AGENT SAFETY RULES

Never:

- rewrite the entire project unnecessarily
- replace architecture without justification
- install large dependencies without need
- expose API keys
- modify unrelated features
- delete existing working functionality
- create duplicate domain models
- put business logic into UI components
- add fake "AI" behavior without labeling it
- use fabricated financial information as real information

If a requirement is ambiguous:

STOP and explain the ambiguity before making a major architectural decision.

---

# 46. PRODUCT NORTH STAR

The final Nexora experience should feel like:

"Open Nexora and understand what deserves my attention, why it matters, what evidence supports it, what could invalidate it, and whether my own investment thinking still holds."

That is the product.

Not more charts.

Not more AI.

Not more buttons.

Better thinking.

---

# 47. FINAL TARGET ARCHITECTURE

Frontend
│
├── Dashboard
├── Research Workspace
├── Thesis Builder
├── Jarvis Review
├── Watchlist
├── Thesis Timeline
└── Settings
        │
        ▼
API Layer
        │
        ▼
Application Services
        │
        ├── Research Service
        ├── Thesis Service
        ├── Jarvis Service
        ├── Monitoring Service
        └── Notification Service
        │
        ▼
Domain Layer
        │
        ├── Research Intelligence
        ├── Investment Intelligence
        ├── Investment Thesis
        ├── Jarvis Review
        └── Monitoring
        │
        ▼
Persistence
        │
        ├── Database
        ├── Cache
        └── Search
        │
        ▼
External Systems
        │
        ├── Market Data
        ├── Financial Data
        ├── News
        ├── Filings
        └── AI Models