# Nexora

**Nexora** is an Investment Intelligence Operating System. It helps investors discover companies, synthesize real-time market data (via the Indian API), formulate structured investment theses, and receive adversarial AI feedback via Jarvis (Gemini).

## Architecture
- **Frontend**: React, TypeScript, Vite, TailwindCSS (Professional/Editorial UI).
- **Backend**: Node.js, Express, TypeScript, Prisma.
- **Database**: PostgreSQL (Persists users, companies, theses, and research provenance).
- **Background Jobs**: Redis + BullMQ (Handles asynchronous research ingestion & materiality analysis).
- **AI / LLM**: Gemini API (Powers Jarvis review).
- **Market Data**: Indian API (Real-time Indian equities data).

## Prerequisites
- Node.js v20+
- Docker & Docker Compose
- API Keys for external services

## Setup Instructions

### 1. Start Infrastructure (Docker)
Nexora uses Docker **only** to manage its backing services (PostgreSQL and Redis). The Node.js applications run directly on your host machine.

```bash
docker-compose up -d
```
This starts PostgreSQL (port 5432) and Redis (port 6379).

### 2. Configure Environment
Navigate to the `backend` directory and create a `.env` file based on `.env.example`:

```bash
cd backend
cp .env.example .env
```

**Important Credentials:**
- `DATABASE_URL`: Ensure this points to the local Postgres container (e.g., `postgresql://postgres:postgres@localhost:5432/nexora_db?schema=public`).
- `INDIAN_API_KEY`: Required for live market data and research ingestion.
- `GEMINI_API_KEY`: Required for Jarvis AI thesis evaluations.
- If you do not provide these API keys, Nexora will automatically fall back to internal **mock providers**, allowing you to develop locally without credentials.

### 3. Install & Start Backend
```bash
cd backend
npm install
npx prisma db push
npm run dev
```
*Note: The backend application runs on `http://localhost:3001`.*

### 4. Install & Start Frontend
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*Note: The frontend runs on `http://localhost:5173`.*

## Testing
Nexora includes comprehensive backend test suites covering Authentication (IDOR), API Routes, AI Schema Validation, and Background Workers.

To run the test suite:
```bash
cd backend
npm test
```

## Security
- **Rate Limiting**: Configured aggressively on LLM and Search endpoints to prevent API abuse.
- **Helmet & CORS**: Hardened Express configurations.
- **Authentication**: JWT & Bcrypt integrated via Prisma.

## License
MIT
