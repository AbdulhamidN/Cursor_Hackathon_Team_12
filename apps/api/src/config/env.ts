import { z } from 'zod';

/** Treats `KEY=` in the .env file the same as a missing key. */
const optionalString = z
  .string()
  .optional()
  .transform((value) => (value?.trim() ? value.trim() : undefined));

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  MONGODB_URI: z.string().min(1).default('mongodb://127.0.0.1:27017/ethiopian_coffee_buy'),
  CORS_ORIGIN: z.string().min(1).default('http://localhost:5173'),
  GEMINI_API_KEY: optionalString,
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const problems = parsed.error.issues
    .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
    .join('\n');
  throw new Error(`Invalid environment configuration. Check the .env file:\n${problems}`);
}

/**
 * The validated server configuration. Read configuration from here, never
 * from `process.env` directly, and add new variables to the schema above and
 * to `.env.example` in the same change.
 */
export const env = parsed.data;
