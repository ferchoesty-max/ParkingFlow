import { Router } from 'express'
import { createParkingSpace, listParkingSpaces } from './parking-space.controller.js'

export const parkingSpaceRouter = Router()

parkingSpaceRouter.get('/', listParkingSpaces)
parkingSpaceRouter.post('/', createParkingSpace)
