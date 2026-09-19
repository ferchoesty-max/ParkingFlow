import type { Request, Response } from 'express'
import { createParkingSpaceSchema } from './parking-space.schema.js'
import { parkingSpaceService } from './parking-space.service.js'

export const listParkingSpaces = async (_request: Request, response: Response) => {
  const data = await parkingSpaceService.list()
  response.json({ data })
}

export const createParkingSpace = async (request: Request, response: Response) => {
  const input = createParkingSpaceSchema.parse(request.body)

  try {
    const data = await parkingSpaceService.create(input)
    response.status(201).json({ data })
  } catch (error) {
    if (error instanceof Error && error.message === 'PARKING_SPACE_CODE_EXISTS') {
      response.status(409).json({ message: 'Parking space code already exists' })
      return
    }
    throw error
  }
}
