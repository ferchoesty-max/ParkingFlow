import type { Request, Response } from 'express'
import { checkInSchema } from './parking-session.schema.js'
import { parkingSessionService } from './parking-session.service.js'

export const listActiveSessions = async (_request: Request, response: Response) => {
  const data = await parkingSessionService.listActive()
  response.json({ data })
}

export const checkIn = async (request: Request, response: Response) => {
  const input = checkInSchema.parse(request.body)

  try {
    const data = await parkingSessionService.checkIn(input, request.auth!.sub)
    response.status(201).json({ data })
  } catch (error) {
    if (error instanceof Error && ['VEHICLE_ALREADY_INSIDE', 'NO_AVAILABLE_SPACE'].includes(error.message)) {
      response.status(409).json({ message: error.message })
      return
    }
    throw error
  }
}
