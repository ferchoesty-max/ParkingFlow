import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(3001),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  FIREBASE_PROJECT_ID: z.string().default('parking-flow-dev'),
  FIREBASE_CLIENT_EMAIL: z.string().default('firebase-adminsdk@parking-flow-dev.iam.gserviceaccount.com'),
  FIREBASE_PRIVATE_KEY: z.string().default('-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC6\n-----END PRIVATE KEY-----\n'),
  JWT_ACCESS_SECRET: z.string().min(32).default('change-me-access-secret-minimum-32-characters-key'),
  JWT_REFRESH_SECRET: z.string().min(32).default('change-me-refresh-secret-minimum-32-characters-key'),
  ACCESS_TOKEN_TTL: z.string().default('15m'),
  REFRESH_TOKEN_TTL: z.string().default('7d'),
  COOKIE_SECURE: z.string().default('false').transform(value => value === 'true'),
})

export const env = envSchema.parse(process.env)