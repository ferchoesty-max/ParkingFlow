import { db } from '../../config/firebase.js'
import type { User } from './user.types.js'

const collection = db.collection('users')

export const userRepository = {
  async findByEmail(email: string): Promise<User | null> {
    const snapshot = await collection.where('email', '==', email).limit(1).get()
    const doc = snapshot.docs[0]
    if (!doc) return null
    return { id: doc.id, ...(doc.data() as Omit<User, 'id'>) }
  },

  async findById(id: string): Promise<User | null> {
    const doc = await collection.doc(id).get()
    if (!doc.exists) return null
    return { id: doc.id, ...(doc.data() as Omit<User, 'id'>) }
  },

  async create(data: Omit<User, 'id'>): Promise<User> {
    const ref = await collection.add(data)
    return { id: ref.id, ...data }
  },
}
