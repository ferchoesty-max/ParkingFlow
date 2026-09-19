import { parkingSpaceRepository } from './parking-space.repository.js'
import type { CreateParkingSpaceInput } from './parking-space.schema.js'

export const parkingSpaceService = {
  list() {
    return parkingSpaceRepository.list()
  },

  async create(input: CreateParkingSpaceInput) {
    const existing = await parkingSpaceRepository.findByCode(input.code)
    if (existing) throw new Error('PARKING_SPACE_CODE_EXISTS')

    return parkingSpaceRepository.create({
      ...input,
      status: 'AVAILABLE',
      active: true,
    })
  },
}
