import { vehicleRepository } from '../vehicles/vehicle.repository.js'
import { parkingSessionRepository } from './parking-session.repository.js'

export const parkingSessionService = {
  listActive() {
    return parkingSessionRepository.listActive()
  },

  async checkIn(
    input: {
      plate: string
      brand?: string
      model?: string
      color?: string
      type: 'CAR' | 'MOTORCYCLE'
    },
    userId: string,
  ) {
    let vehicle = await vehicleRepository.findByPlate(input.plate)

    if (!vehicle) {
      vehicle = await vehicleRepository.create({
        plate: input.plate,
        brand: input.brand,
        model: input.model,
        color: input.color,
        type: input.type,
        createdAt: new Date().toISOString(),
      })
    }

    const active = await parkingSessionRepository.findActiveByVehicle(vehicle.id)
    if (active) throw new Error('VEHICLE_ALREADY_INSIDE')

    return parkingSessionRepository.createWithSpace(
      {
        vehicleId: vehicle.id,
        parkingSpaceId: '',
        entryAt: new Date().toISOString(),
        exitAt: null,
        status: 'ACTIVE',
        durationMinutes: null,
        total: null,
        createdBy: userId,
      },
      input.type,
    )
  },
}
