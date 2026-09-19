export type VehicleType = 'CAR' | 'MOTORCYCLE'

export interface Vehicle {
  id: string
  plate: string
  brand?: string
  model?: string
  color?: string
  type: VehicleType
  createdAt: string
}
