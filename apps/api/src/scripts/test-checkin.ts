import { parkingSessionService } from '../modules/parking-sessions/parking-session.service.js'
import { parkingSpaceRepository } from '../modules/parking-spaces/parking-space.repository.js'

async function run() {
  console.log('--- TEST: REGISTRANDO VEHÍCULO EN GOOGLE CLOUD FIRESTORE ---')
  const session = await parkingSessionService.checkIn(
    {
      plate: 'TEST-100',
      type: 'CAR',
      brand: 'NISSAN',
      model: 'TSURU',
      color: 'ROJO',
    },
    '7Ex89nQqcy8MyVTEKCwJ'
  )
  console.log('Check-in Exitoso!')
  console.log('Sesión Creada:', session)

  console.log('\n--- ESTADO DE CAJONES EN CLOUD FIRESTORE TRAS CHECK-IN ---')
  const spaces = await parkingSpaceRepository.list()
  spaces.forEach(s => console.log(`  * Cajón ${s.code}: ${s.status} (ID: ${s.id})`))
}

run().catch(err => {
  console.error('Error durante test-checkin:', err)
  process.exit(1)
})
