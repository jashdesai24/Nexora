import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { providers } from "./config/providers.js";
import { errorHandler } from "./middleware/error-handler.js";
import companiesRoutes from "./routes/companies.routes.js";
import researchRoutes from "./routes/research.routes.js";
import jarvisRoutes from "./routes/jarvis.routes.js";

import { authRouter } from "./routes/auth.routes.js";
import { thesisRoutes } from "./routes/thesis.routes.js";
import { notificationRoutes } from "./routes/notification.routes.js";
import { watchlistRoutes } from "./routes/watchlist.routes.js";
import { briefingRoutes } from "./routes/briefing.routes.js";

const app = express();

// --- Middleware ---
app.use(cors({ origin: env.FRONTEND_URL }));
app.use(express.json());

// --- Health Check ---
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    environment: env.NODE_ENV,
    providers: {
      marketData: providers.marketData.name,
      news: providers.news.name,
      fundamentals: providers.fundamentals.name,
      llm: providers.llm.name,
    },
    timestamp: new Date().toISOString(),
  });
});

// --- API Routes ---
app.use("/api/auth", authRouter);
app.use("/api/theses", thesisRoutes);
app.use("/api/companies", companiesRoutes);
app.use("/api/companies", researchRoutes);
app.use("/api/jarvis", jarvisRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/briefings", briefingRoutes);

// --- Error Handling ---
app.use(errorHandler);

export { app };

// --- Start ---
if (env.NODE_ENV !== 'test') {
  app.listen(env.PORT, () => {
    console.log(
      `[Nexora] Backend running on http://localhost:${env.PORT} (${env.NODE_ENV})`
    );
    console.log(
      `[Nexora] Providers — marketData: ${providers.marketData.name}, news: ${providers.news.name}, llm: ${providers.llm.name}`
    );
  });
}
