import jwt from 'jsonwebtoken'
import { env } from '../../config/env.js'

export interface TokenPayload {
  sub: string
  email: string
  role: 'ADMIN' | 'OPERATOR'
}

export const signAccessToken = (payload: TokenPayload) => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.ACCESS_TOKEN_TTL as jwt.SignOptions['expiresIn'],
  })
}

export const signRefreshToken = (payload: TokenPayload) => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.REFRESH_TOKEN_TTL as jwt.SignOptions['expiresIn'],
  })
}

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload
}

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload
}
