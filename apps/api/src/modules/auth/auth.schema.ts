import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(8).max(100),
})

export const createUserSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().toLowerCase(),
  password: z.string().min(8).max(100),
  role: z.enum(['ADMIN', 'OPERATOR']),
})
