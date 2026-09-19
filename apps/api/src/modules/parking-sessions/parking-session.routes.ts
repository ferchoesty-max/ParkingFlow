import { Router } from 'express'
import { requireAuth } from '../../shared/middleware/auth.middleware.js'
import { checkIn, listActiveSessions } from './parking-session.controller.js'

export const parkingSessionRouter = Router()

parkingSessionRouter.use(requireAuth)
parkingSessionRouter.get('/active', listActiveSessions)
parkingSessionRouter.post('/', checkIn)
