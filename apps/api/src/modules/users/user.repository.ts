import { db, isFirebaseConfigured } from '../../config/firebase.js'
import type { User } from './user.types.js'

const collection = db.collection('users')

// Default admin user for local / test development
const memoryUsers: User[] = [
  {
    id: 'user-admin-default',
    name: 'Administrador',
    email: 'admin@parkingflow.local',
    role: 'ADMIN',
    active: true,
    // Hash for 'Admin123!' with bcrypt
    passwordHash: '$2b$10$/zlXxIQ7tfms2XmgmNsWt.UQO55IAjrdtqagQkBaNSvlrk34FbA7O',
    createdAt: new Date().toISOString(),
  },
]

export const userRepository = {
  async findByEmail(email: string): Promise<User | null> {
    if (!isFirebaseConfigured) return memoryUsers.find(u => u.email === email) ?? null
    try {
      const snapshot = await collection.where('email', '==', email).limit(1).get()
      const doc = snapshot.docs[0]
      if (!doc) return memoryUsers.find(u => u.email === email) ?? null
      return { id: doc.id, ...(doc.data() as Omit<User, 'id'>) }
    } catch {
      return memoryUsers.find(u => u.email === email) ?? null
    }
  },

  async findById(id: string): Promise<User | null> {
    if (!isFirebaseConfigured) return memoryUsers.find(u => u.id === id) ?? null
    try {
      const doc = await collection.doc(id).get()
      if (!doc.exists) return memoryUsers.find(u => u.id === id) ?? null
      return { id: doc.id, ...(doc.data() as Omit<User, 'id'>) }
    } catch {
      return memoryUsers.find(u => u.id === id) ?? null
    }
  },

  async create(data: Omit<User, 'id'>): Promise<User> {
    if (!isFirebaseConfigured) {
      const user = { id: `user-${Date.now()}`, ...data }
      memoryUsers.push(user)
      return user
    }
    try {
      const ref = await collection.add(data)
      return { id: ref.id, ...data }
    } catch {
      const user = { id: `user-${Date.now()}`, ...data }
      memoryUsers.push(user)
      return user
    }
  },
}
