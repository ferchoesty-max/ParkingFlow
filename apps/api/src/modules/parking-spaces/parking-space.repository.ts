import { db } from '../../config/firebase.js'
import type { ParkingSpace } from './parking-space.types.js'

const collection = db.collection('parkingSpaces')

export const parkingSpaceRepository = {
  async list(): Promise<ParkingSpace[]> {
    const snapshot = await collection.orderBy('code').get()
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<ParkingSpace, 'id'>),
    }))
  },

  async findByCode(code: string): Promise<ParkingSpace | null> {
    const snapshot = await collection.where('code', '==', code).limit(1).get()
    const doc = snapshot.docs[0]
    if (!doc) return null
    return { id: doc.id, ...(doc.data() as Omit<ParkingSpace, 'id'>) }
  },

  async create(data: Omit<ParkingSpace, 'id'>): Promise<ParkingSpace> {
    const ref = await collection.add(data)
    return { id: ref.id, ...data }
  },
}
