import { db, isFirebaseConfigured } from '../../config/firebase.js'
import { parkingSpaceRepository } from '../parking-spaces/parking-space.repository.js'
import type { ParkingSession } from './parking-session.types.js'

const sessions = db.collection('parkingSessions')
const spaces = db.collection('parkingSpaces')

const memorySessions: ParkingSession[] = []

export const parkingSessionRepository = {
  async findActiveByVehicle(vehicleId: string): Promise<ParkingSession | null> {
    if (!isFirebaseConfigured) {
      return memorySessions.find(s => s.vehicleId === vehicleId && s.status === 'ACTIVE') ?? null
    }
    try {
      const snapshot = await sessions
        .where('vehicleId', '==', vehicleId)
        .where('status', '==', 'ACTIVE')
        .limit(1)
        .get()

      const doc = snapshot.docs[0]
      if (!doc) return null
      return { id: doc.id, ...(doc.data() as Omit<ParkingSession, 'id'>) }
    } catch {
      return memorySessions.find(s => s.vehicleId === vehicleId && s.status === 'ACTIVE') ?? null
    }
  },

  async listActive(): Promise<ParkingSession[]> {
    if (!isFirebaseConfigured) {
      return memorySessions.filter(s => s.status === 'ACTIVE')
    }
    try {
      const snapshot = await sessions.where('status', '==', 'ACTIVE').get()
      if (!snapshot.empty) {
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<ParkingSession, 'id'>),
        }))
      }
      return memorySessions.filter(s => s.status === 'ACTIVE')
    } catch {
      return memorySessions.filter(s => s.status === 'ACTIVE')
    }
  },

  async createWithSpace(
    data: Omit<ParkingSession, 'id'>,
    vehicleType: 'CAR' | 'MOTORCYCLE',
  ): Promise<ParkingSession> {
    if (!isFirebaseConfigured) {
      const currentSpaces = parkingSpaceRepository.getMemorySpaces()
      const compatible = currentSpaces.find(s => {
        if (s.status !== 'AVAILABLE' || !s.active) return false
        if (vehicleType === 'MOTORCYCLE') {
          return s.type === 'MOTORCYCLE' || s.type === 'REGULAR'
        }
        return s.type === 'REGULAR'
      })

      if (!compatible) throw new Error('NO_AVAILABLE_SPACE')

      const session: ParkingSession = {
        ...data,
        id: `sess-${Date.now()}`,
        parkingSpaceId: compatible.id,
      }
      parkingSpaceRepository.updateMemoryStatus(compatible.id, 'OCCUPIED')
      memorySessions.push(session)
      return session
    }
    try {
      return await db.runTransaction(async transaction => {
        const snapshot = await transaction.get(
          spaces.where('status', '==', 'AVAILABLE').where('active', '==', true),
        )

        const compatible = snapshot.docs.find(doc => {
          const type = doc.data().type
          if (vehicleType === 'MOTORCYCLE') {
            return type === 'MOTORCYCLE' || type === 'REGULAR'
          }
          return type === 'REGULAR'
        })

        if (!compatible) throw new Error('NO_AVAILABLE_SPACE')

        const sessionRef = sessions.doc()
        const finalData = { ...data, parkingSpaceId: compatible.id }

        transaction.set(sessionRef, finalData)
        transaction.update(compatible.ref, { status: 'OCCUPIED' })

        return { id: sessionRef.id, ...finalData }
      })
    } catch (err: any) {
      if (err?.message === 'NO_AVAILABLE_SPACE') throw err

      // Fallback for offline/local demonstration
      const currentSpaces = parkingSpaceRepository.getMemorySpaces()
      const compatible = currentSpaces.find(s => {
        if (s.status !== 'AVAILABLE' || !s.active) return false
        if (vehicleType === 'MOTORCYCLE') {
          return s.type === 'MOTORCYCLE' || s.type === 'REGULAR'
        }
        return s.type === 'REGULAR'
      })

      if (!compatible) throw new Error('NO_AVAILABLE_SPACE')

      const session: ParkingSession = {
        ...data,
        id: `sess-${Date.now()}`,
        parkingSpaceId: compatible.id,
      }
      parkingSpaceRepository.updateMemoryStatus(compatible.id, 'OCCUPIED')
      memorySessions.push(session)
      return session
    }
  },
}
