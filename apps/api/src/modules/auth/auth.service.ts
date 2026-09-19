import { hashPassword, verifyPassword } from '../../shared/security/password.js'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../shared/security/jwt.js'
import { userRepository } from '../users/user.repository.js'
import type { PublicUser, User } from '../users/user.types.js'

const toPublicUser = (user: User): PublicUser => {
  const { passwordHash: _passwordHash, ...safe } = user
  return safe
}

export const authService = {
  async createUser(input: {
    name: string
    email: string
    password: string
    role: 'ADMIN' | 'OPERATOR'
  }) {
    const existing = await userRepository.findByEmail(input.email)
    if (existing) throw new Error('EMAIL_ALREADY_EXISTS')

    const passwordHash = await hashPassword(input.password)

    const user = await userRepository.create({
      name: input.name,
      email: input.email,
      role: input.role,
      active: true,
      passwordHash,
      createdAt: new Date().toISOString(),
    })

    return toPublicUser(user)
  },

  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email)
    if (!user || !user.active) throw new Error('INVALID_CREDENTIALS')

    const valid = await verifyPassword(password, user.passwordHash)
    if (!valid) throw new Error('INVALID_CREDENTIALS')

    const payload = { sub: user.id, email: user.email, role: user.role }

    return {
      user: toPublicUser(user),
      accessToken: signAccessToken(payload),
      refreshToken: signRefreshToken(payload),
    }
  },

  async refresh(token: string) {
    const payload = verifyRefreshToken(token)
    const user = await userRepository.findById(payload.sub)
    if (!user || !user.active) throw new Error('INVALID_REFRESH_TOKEN')

    return {
      accessToken: signAccessToken({ sub: user.id, email: user.email, role: user.role }),
      user: toPublicUser(user),
    }
  },
}
