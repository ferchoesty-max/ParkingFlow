import cors from 'cors'
import express from 'express'
import { env } from './config/env.js'
import { healthRouter } from './routes/health.routes.js'

export const createApp = () => {
  const app = express()

  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }))
  app.use(express.json())

  app.use('/api/v1/health', healthRouter)

  app.use((_request, response) => {
    response.status(404).json({ message: 'Route not found' })
  })

  return app
}
