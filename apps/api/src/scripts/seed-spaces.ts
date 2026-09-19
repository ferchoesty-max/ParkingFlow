import { parkingSpaceRepository } from '../modules/parking-spaces/parking-space.repository.js'
import type { ParkingSpace } from '../modules/parking-spaces/parking-space.types.js'

const initialSpaces: Omit<ParkingSpace, 'id'>[] = [
  { code: 'A01', zone: 'A', type: 'REGULAR', status: 'AVAILABLE', active: true },
  { code: 'A02', zone: 'A', type: 'REGULAR', status: 'AVAILABLE', active: true },
  { code: 'A03', zone: 'A', type: 'REGULAR', status: 'AVAILABLE', active: true },
  { code: 'A04', zone: 'A', type: 'REGULAR', status: 'AVAILABLE', active: true },
  { code: 'B01', zone: 'B', type: 'REGULAR', status: 'AVAILABLE', active: true },
  { code: 'B02', zone: 'B', type: 'REGULAR', status: 'AVAILABLE', active: true },
]

const run = async () => {
  console.log('Seeding initial parking spaces into Firestore...')
  for (const space of initialSpaces) {
    const existing = await parkingSpaceRepository.findByCode(space.code)
    if (!existing) {
      const created = await parkingSpaceRepository.create(space)
      console.log(`Created space: ${created.code}`)
    } else {
      console.log(`Space ${space.code} already exists.`)
    }
  }
  console.log('Finished seeding parking spaces.')
}

run().catch(error => {
  console.error('Error seeding spaces:', error)
  process.exit(1)
})
