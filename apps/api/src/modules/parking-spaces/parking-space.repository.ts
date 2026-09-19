import { db, isFirebaseConfigured } from '../../config/firebase.js'
import type { ParkingSpace } from './parking-space.types.js'

const collection = db.collection('parkingSpaces')

const memorySpaces: ParkingSpace[] = [
  { id: 'space-a01', code: 'A01', zone: 'A', type: 'REGULAR', status: 'AVAILABLE', active: true },
  { id: 'space-a02', code: 'A02', zone: 'A', type: 'REGULAR', status: 'AVAILABLE', active: true },
  { id: 'space-a03', code: 'A03', zone: 'A', type: 'REGULAR', status: 'AVAILABLE', active: true },
  { id: 'space-a04', code: 'A04', zone: 'A', type: 'REGULAR', status: 'AVAILABLE', active: true },
  { id: 'space-b01', code: 'B01', zone: 'B', type: 'REGULAR', status: 'AVAILABLE', active: true },
  { id: 'space-b02', code: 'B02', zone: 'B', type: 'REGULAR', status: 'AVAILABLE', active: true },
]

export const parkingSpaceRepository = {
  async list(): Promise<ParkingSpace[]> {
    if (!isFirebaseConfigured) return memorySpaces
    try {
      const snapshot = await collection.orderBy('code').get()
      if (!snapshot.empty) {
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<ParkingSpace, 'id'>),
        }))
      }
      return memorySpaces
    } catch {
      return memorySpaces
    }
  },

  async findByCode(code: string): Promise<ParkingSpace | null> {
    if (!isFirebaseConfigured) return memorySpaces.find(s => s.code === code) ?? null
    try {
      const snapshot = await collection.where('code', '==', code).limit(1).get()
      const doc = snapshot.docs[0]
      if (!doc) return memorySpaces.find(s => s.code === code) ?? null
      return { id: doc.id, ...(doc.data() as Omit<ParkingSpace, 'id'>) }
    } catch {
      return memorySpaces.find(s => s.code === code) ?? null
    }
  },

  async create(data: Omit<ParkingSpace, 'id'>): Promise<ParkingSpace> {
    if (!isFirebaseConfigured) {
      const space = { id: `space-${Date.now()}`, ...data }
      memorySpaces.push(space)
      return space
    }
    try {
      const ref = await collection.add(data)
      const space = { id: ref.id, ...data }
      memorySpaces.push(space)
      return space
    } catch {
      const space = { id: `space-${Date.now()}`, ...data }
      memorySpaces.push(space)
      return space
    }
  },

  updateMemoryStatus(spaceId: string, status: ParkingSpace['status']) {
    const space = memorySpaces.find(s => s.id === spaceId)
    if (space) space.status = status
  },

  getMemorySpaces(): ParkingSpace[] {
    return memorySpaces
  },
}
