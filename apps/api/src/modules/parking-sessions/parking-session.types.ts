export type ParkingSessionStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED'

export interface ParkingSession {
  id: string
  vehicleId: string
  parkingSpaceId: string
  entryAt: string
  exitAt: string | null
  status: ParkingSessionStatus
  durationMinutes: number | null
  total: number | null
  createdBy: string
}
