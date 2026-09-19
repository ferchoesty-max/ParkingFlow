import type { NextFunction, Request, Response } from 'express'

export const requireRole = (...roles: Array<'ADMIN' | 'OPERATOR'>) => {
  return (request: Request, response: Response, next: NextFunction) => {
    if (!request.auth || !roles.includes(request.auth.role)) {
      response.status(403).json({ message: 'Forbidden' })
      return
    }
    next()
  }
}
