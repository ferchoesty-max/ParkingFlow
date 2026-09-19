import { db } from '../../config/firebase.js'
import type { Vehicle } from './vehicle.types.js'

const collection = db.collection('vehicles')

export const vehicleRepository = {
  async findByPlate(plate: string): Promise<Vehicle | null> {
    const snapshot = await collection.where('plate', '==', plate).limit(1).get()
    const doc = snapshot.docs[0]
    if (!doc) return null
    return { id: doc.id, ...(doc.data() as Omit<Vehicle, 'id'>) }
  },

  async create(data: Omit<Vehicle, 'id'>): Promise<Vehicle> {
    const ref = await collection.add(data)
    return { id: ref.id, ...data }
  },
}
