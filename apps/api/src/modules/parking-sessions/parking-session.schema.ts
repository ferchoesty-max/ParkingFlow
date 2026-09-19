import { z } from 'zod'

export const checkInSchema = z.object({
  plate: z.string().min(3).max(15).transform(value => value.trim().toUpperCase()),
  brand: z.string().max(40).optional(),
  model: z.string().max(40).optional(),
  color: z.string().max(30).optional(),
  type: z.enum(['CAR', 'MOTORCYCLE']),
})

export type CheckInInput = z.infer<typeof checkInSchema>
