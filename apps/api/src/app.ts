import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { env } from './config/env.js'
import { authRouter } from './modules/auth/auth.routes.js'
import { parkingSessionRouter } from './modules/parking-sessions/parking-session.routes.js'
import { parkingSpaceRouter } from './modules/parking-spaces/parking-space.routes.js'
import { healthRouter } from './routes/health.routes.js'
import { errorMiddleware } from './shared/middleware/error.middleware.js'

export const createApp = () => {
  const app = express()

  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }))
  app.use(express.json())
  app.use(cookieParser())

  app.use('/api/v1/health', healthRouter)
  app.use('/api/v1/auth', authRouter)
  app.use('/api/v1/parking-spaces', parkingSpaceRouter)
  app.use('/api/v1/parking-sessions', parkingSessionRouter)

  app.use((_request, response) => {
    response.status(404).json({ message: 'Route not found' })
  })

  app.use(errorMiddleware)

  return app
}
