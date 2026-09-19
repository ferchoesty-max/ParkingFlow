import { db } from '../../config/firebase.js'
import type { ParkingSession } from './parking-session.types.js'

const sessions = db.collection('parkingSessions')
const spaces = db.collection('parkingSpaces')

export const parkingSessionRepository = {
  async findActiveByVehicle(vehicleId: string): Promise<ParkingSession | null> {
    const snapshot = await sessions
      .where('vehicleId', '==', vehicleId)
      .where('status', '==', 'ACTIVE')
      .limit(1)
      .get()

    const doc = snapshot.docs[0]
    if (!doc) return null

    return { id: doc.id, ...(doc.data() as Omit<ParkingSession, 'id'>) }
  },

  async listActive(): Promise<ParkingSession[]> {
    const snapshot = await sessions.where('status', '==', 'ACTIVE').get()
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<ParkingSession, 'id'>),
    }))
  },

  async createWithSpace(
    data: Omit<ParkingSession, 'id'>,
    vehicleType: 'CAR' | 'MOTORCYCLE',
  ): Promise<ParkingSession> {
    return db.runTransaction(async transaction => {
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
  },
}
