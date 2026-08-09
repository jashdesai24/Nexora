import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(3001),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  // Data providers
  INDIAN_API_KEY: z.string().optional(),
  ALPHA_VANTAGE_KEY: z.string().optional(),

  // LLM providers
  GEMINI_API_KEY: z.string().optional(),
  GROK_API_KEY: z.string().optional(),

  // CORS
  FRONTEND_URL: z.string().default("http://localhost:5173"),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("❌ Invalid environment configuration:");
    console.error(result.error.format());
    process.exit(1);
  }

  return result.data;
}

export const env = loadEnv();
