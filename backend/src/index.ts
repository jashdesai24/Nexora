import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error-handler.js";
import companiesRoutes from "./routes/companies.routes.js";
import researchRoutes from "./routes/research.routes.js";
import jarvisRoutes from "./routes/jarvis.routes.js";

const app = express();

// --- Middleware ---
app.use(cors({ origin: env.FRONTEND_URL }));
app.use(express.json());

// --- Health Check ---
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// --- API Routes ---
app.use("/api/companies", companiesRoutes);
app.use("/api/companies", researchRoutes);
app.use("/api/jarvis", jarvisRoutes);

// --- Error Handling ---
app.use(errorHandler);

// --- Start ---
app.listen(env.PORT, () => {
  console.log(
    `[Nexora] Backend running on http://localhost:${env.PORT} (${env.NODE_ENV})`
  );
});
