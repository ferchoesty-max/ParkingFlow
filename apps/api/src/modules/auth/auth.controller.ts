import type { Request, Response } from 'express'
import { env } from '../../config/env.js'
import { loginSchema } from './auth.schema.js'
import { authService } from './auth.service.js'

const cookieOptions = {
  httpOnly: true,
  secure: env.COOKIE_SECURE,
  sameSite: 'lax' as const,
  path: '/api/v1/auth',
}

export const login = async (request: Request, response: Response) => {
  const input = loginSchema.parse(request.body)

  try {
    const result = await authService.login(input.email, input.password)
    response.cookie('refreshToken', result.refreshToken, cookieOptions)
    response.json({
      data: {
        accessToken: result.accessToken,
        user: result.user,
      },
    })
  } catch {
    response.status(401).json({ message: 'Invalid credentials' })
  }
}

export const refresh = async (request: Request, response: Response) => {
  const token = request.cookies?.refreshToken
  if (!token) {
    response.status(401).json({ message: 'Refresh token required' })
    return
  }

  try {
    const result = await authService.refresh(token)
    response.json({ data: result })
  } catch {
    response.status(401).json({ message: 'Invalid refresh token' })
  }
}

export const logout = (_request: Request, response: Response) => {
  response.clearCookie('refreshToken', cookieOptions)
  response.status(204).send()
}
