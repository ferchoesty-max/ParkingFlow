import { authService } from '../modules/auth/auth.service.js'

const run = async () => {
  const user = await authService.createUser({
    name: 'Administrador',
    email: 'admin@parkingflow.local',
    password: 'Admin123!',
    role: 'ADMIN',
  })
  console.log('Admin created successfully:', user)
}

run().catch(error => {
  console.error(error)
  process.exit(1)
})
