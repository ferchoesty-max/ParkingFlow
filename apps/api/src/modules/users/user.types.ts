export type UserRole = 'ADMIN' | 'OPERATOR'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  active: boolean
  passwordHash: string
  createdAt: string
}

export type PublicUser = Omit<User, 'passwordHash'>
