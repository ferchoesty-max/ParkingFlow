import { db, isFirebaseConfigured } from '../../config/firebase.js'
import type { Vehicle } from './vehicle.types.js'

const collection = db.collection('vehicles')
const memoryVehicles: Vehicle[] = []

export const vehicleRepository = {
  async findByPlate(plate: string): Promise<Vehicle | null> {
    if (!isFirebaseConfigured) return memoryVehicles.find(v => v.plate === plate) ?? null
    try {
      const snapshot = await collection.where('plate', '==', plate).limit(1).get()
      const doc = snapshot.docs[0]
      if (!doc) return memoryVehicles.find(v => v.plate === plate) ?? null
      return { id: doc.id, ...(doc.data() as Omit<Vehicle, 'id'>) }
    } catch {
      return memoryVehicles.find(v => v.plate === plate) ?? null
    }
  },

  async create(data: Omit<Vehicle, 'id'>): Promise<Vehicle> {
    if (!isFirebaseConfigured) {
      const vehicle = { id: `veh-${Date.now()}`, ...data }
      memoryVehicles.push(vehicle)
      return vehicle
    }
    try {
      const ref = await collection.add(data)
      const vehicle = { id: ref.id, ...data }
      memoryVehicles.push(vehicle)
      return vehicle
    } catch {
      const vehicle = { id: `veh-${Date.now()}`, ...data }
      memoryVehicles.push(vehicle)
      return vehicle
    }
  },
}
