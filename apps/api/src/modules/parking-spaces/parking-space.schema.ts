import { z } from 'zod'

export const createParkingSpaceSchema = z.object({
  code: z.string().min(2).max(10),
  zone: z.string().min(1).max(10),
  type: z.enum(['REGULAR', 'DISABLED', 'MOTORCYCLE']),
})

export type CreateParkingSpaceInput = z.infer<typeof createParkingSpaceSchema>
