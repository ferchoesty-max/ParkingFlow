import type { NextFunction, Request, Response } from 'express'
import { verifyAccessToken } from '../security/jwt.js'

declare global {
  namespace Express {
    interface Request {
      auth?: {
        sub: string
        email: string
        role: 'ADMIN' | 'OPERATOR'
      }
    }
  }
}

export const requireAuth = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const header = request.headers.authorization

  if (!header || !header.startsWith('Bearer ')) {
    response.status(401).json({ message: 'Unauthorized' })
    return
  }

  try {
    request.auth = verifyAccessToken(header.substring(7))
    next()
  } catch {
    response.status(401).json({ message: 'Invalid or expired token' })
  }
}
