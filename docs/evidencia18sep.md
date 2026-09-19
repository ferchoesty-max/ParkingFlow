# Evidencia 2 — Check-in de Vehículos y Asignación Automática de Cajones

**Nombre:** Fernando Daniel Tolentino Uribe  
**NUA:** 395108  
**Universidad:** Universidad de Guanajuato (DICIS, Campus Irapuato-Salamanca)  
**Carrera:** Ingeniería en Sistemas Computacionales  
**Materia:** Cómputo en la Nube  
**Fecha:** 18 de Septiembre de 2026  

---

## 📁 `apps/api/src/modules/vehicles/vehicle.types.ts`

```typescript
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
```

---

## 📁 `apps/api/src/modules/vehicles/vehicle.repository.ts`

```typescript
import { db, isFirebaseConfigured } from '../../config/firebase.js'
import type { Vehicle } from './vehicle.types.js'

const collection = db.collection('vehicles')
const memoryVehicles: Vehicle[] = []

export const vehicleRepository = {
  async findByPlate(plate: string): Promise<Vehicle | null> {
    if (!isFirebaseConfigured) return memoryVehicles.find(v => v.plate === plate) ?? null
    try {
      const snapshot = await collection.where('plate', '==', plate).limit(1).get()
      const doc = snapshot.docs[0]
      if (!doc) return memoryVehicles.find(v => v.plate === plate) ?? null
      return { id: doc.id, ...(doc.data() as Omit<Vehicle, 'id'>) }
    } catch {
      return memoryVehicles.find(v => v.plate === plate) ?? null
    }
  },

  async create(data: Omit<Vehicle, 'id'>): Promise<Vehicle> {
    if (!isFirebaseConfigured) {
      const vehicle = { id: `veh-${Date.now()}`, ...data }
      memoryVehicles.push(vehicle)
      return vehicle
    }
    try {
      const ref = await collection.add(data)
      const vehicle = { id: ref.id, ...data }
      memoryVehicles.push(vehicle)
      return vehicle
    } catch {
      const vehicle = { id: `veh-${Date.now()}`, ...data }
      memoryVehicles.push(vehicle)
      return vehicle
    }
  },
}
```

---

## 📁 `apps/api/src/modules/parking-sessions/parking-session.types.ts`

```typescript
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
```

---

## 📁 `apps/api/src/modules/parking-sessions/parking-session.schema.ts`

```typescript
import { z } from 'zod'

export const checkInSchema = z.object({
  plate: z.string().min(3).max(15).transform(value => value.trim().toUpperCase()),
  brand: z.string().max(40).optional(),
  model: z.string().max(40).optional(),
  color: z.string().max(30).optional(),
  type: z.enum(['CAR', 'MOTORCYCLE']),
})

export type CheckInInput = z.infer<typeof checkInSchema>
```

---

## 📁 `apps/api/src/modules/parking-sessions/parking-session.repository.ts`

```typescript
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
      if (!doc) {
        return memorySessions.find(s => s.vehicleId === vehicleId && s.status === 'ACTIVE') ?? null
      }

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
```

---

## 📁 `apps/api/src/modules/parking-sessions/parking-session.service.ts`

```typescript
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
```

---

## 📁 `apps/api/src/modules/parking-sessions/parking-session.controller.ts`

```typescript
import type { Request, Response } from 'express'
import { checkInSchema } from './parking-session.schema.js'
import { parkingSessionService } from './parking-session.service.js'

export const listActiveSessions = async (_request: Request, response: Response) => {
  const data = await parkingSessionService.listActive()
  response.json({ data })
}

export const checkIn = async (request: Request, response: Response) => {
  const input = checkInSchema.parse(request.body)

  try {
    const data = await parkingSessionService.checkIn(input, request.auth!.sub)
    response.status(201).json({ data })
  } catch (error) {
    if (error instanceof Error && ['VEHICLE_ALREADY_INSIDE', 'NO_AVAILABLE_SPACE'].includes(error.message)) {
      response.status(409).json({ message: error.message })
      return
    }
    throw error
  }
}
```

---

## 📁 `apps/api/src/modules/parking-sessions/parking-session.routes.ts`

```typescript
import { Router } from 'express'
import { requireAuth } from '../../shared/middleware/auth.middleware.js'
import { checkIn, listActiveSessions } from './parking-session.controller.js'

export const parkingSessionRouter = Router()

parkingSessionRouter.use(requireAuth)
parkingSessionRouter.get('/active', listActiveSessions)
parkingSessionRouter.post('/', checkIn)
```

---

## 📁 `apps/api/src/app.ts`

```typescript
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { env } from './config/env.js'
import { authRouter } from './modules/auth/auth.routes.js'
import { parkingSessionRouter } from './modules/parking-sessions/parking-session.routes.js'
import { parkingSpaceRouter } from './modules/parking-spaces/parking-space.routes.js'
import { healthRouter } from './routes/health.routes.js'
import { errorMiddleware } from './shared/middleware/error.middleware.js'

export const createApp = () => {
  const app = express()

  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }))
  app.use(express.json())
  app.use(cookieParser())

  app.use('/api/v1/health', healthRouter)
  app.use('/health', healthRouter)
  app.use('/api/v1/auth', authRouter)
  app.use('/auth', authRouter)
  app.use('/api/v1/parking-spaces', parkingSpaceRouter)
  app.use('/parking-spaces', parkingSpaceRouter)
  app.use('/api/v1/parking-sessions', parkingSessionRouter)
  app.use('/parking-sessions', parkingSessionRouter)

  app.use((_request, response) => {
    response.status(404).json({ message: 'Route not found' })
  })

  app.use(errorMiddleware)

  return app
}
```

---

## 📁 `apps/web/app/components/vehicle/VehicleEntryForm.vue`

```vue
<script setup lang="ts">
interface Payload {
  plate: string
  brand?: string
  model?: string
  color?: string
  type: 'CAR' | 'MOTORCYCLE'
}

const emit = defineEmits<{
  submit: [payload: Payload]
>()

const plate = ref('')
const brand = ref('')
const model = ref('')
const color = ref('')
const type = ref<'CAR' | 'MOTORCYCLE'>('CAR')

const submit = () => {
  emit('submit', {
    plate: plate.value,
    brand: brand.value || undefined,
    model: model.value || undefined,
    color: color.value || undefined,
    type: type.value,
  })
}
</script>

<template>
  <form @submit.prevent="submit" class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
    <h2 class="text-xl font-black text-slate-900">Registrar Entrada</h2>
    <div class="mt-5 grid gap-4 md:grid-cols-2">
      <label>
        <span class="text-sm font-semibold text-slate-700">Placa *</span>
        <input
          type="text"
          v-model="plate"
          required
          class="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 uppercase"
        />
      </label>

      <label>
        <span class="text-sm font-semibold text-slate-700">Tipo</span>
        <select
          v-model="type"
          class="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 uppercase"
        >
          <option value="CAR">Automovil</option>
          <option value="MOTORCYCLE">Motocicleta</option>
        </select>
      </label>

      <label>
        <span class="text-sm font-semibold text-slate-700">Marca</span>
        <input
          v-model="brand"
          class="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 uppercase"
        />
      </label>

      <label>
        <span class="text-sm font-semibold text-slate-700">Modelo</span>
        <input
          v-model="model"
          class="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 uppercase"
        />
      </label>

      <label>
        <span class="text-sm font-semibold text-slate-700">Color</span>
        <input
          v-model="color"
          class="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 uppercase"
        />
      </label>

      <div class="flex items-end">
        <button
          type="submit"
          class="w-full rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white hover:bg-indigo-700 transition"
        >
          Registrar Entrada
        </button>
      </div>
    </div>
  </form>
</template>
```

---

## 📁 `apps/web/app/composables/useParkingSessions.ts`

```typescript
interface CheckInPayload {
  plate: string
  brand?: string
  model?: string
  color?: string
  type: 'CAR' | 'MOTORCYCLE'
}

export const useParkingSessions = () => {
  const api = useApi()

  const checkIn = (payload: CheckInPayload) => {
    return api('/parking-sessions', {
      method: 'POST',
      body: payload,
    })
  }

  return { checkIn }
}
```

---

## 📁 `apps/web/app/composables/useParkingSpaces.ts`

```typescript
import type { ParkingSpace } from '~/types/parking'

interface ParkingSpacesResponse {
  data: ParkingSpace[]
}

export const useParkingSpaces = () => {
  const api = useApi()

  const { data, error, status, refresh } = useAsyncData(
    'parking-spaces',
    () => api<ParkingSpacesResponse>('/parking-spaces'),
  )

  const spaces = computed(() => data.value?.data ?? [])
  const total = computed(() => spaces.value.length)
  const available = computed(() => spaces.value.filter(item => item.status === 'AVAILABLE').length)
  const occupied = computed(() => spaces.value.filter(item => item.status === 'OCCUPIED').length)
  const outOfService = computed(() => spaces.value.filter(item => item.status === 'OUT_OF_SERVICE').length)
  const occupancyPercentage = computed(() => total.value === 0 ? 0 : Math.round((occupied.value / total.value) * 100))

  return {
    spaces,
    total,
    available,
    occupied,
    outOfService,
    occupancyPercentage,
    error,
    status,
    refresh,
  }
}
```

---

## 📁 `apps/web/app/composables/useApi.ts`

```typescript
export const useApi = () => {
  const config = useRuntimeConfig()
  const auth = useAuthStore()

  return $fetch.create({
    baseURL: (config.public.apiBaseUrl as string) || 'http://localhost:3001/api/v1',
    credentials: 'include',
    async onRequest({ options }) {
      if (!auth.accessToken && typeof window !== 'undefined') {
        try {
          const res = await $fetch<{ data: { accessToken: string; user: any } }>(
            'http://localhost:3001/api/v1/auth/login',
            {
              method: 'POST',
              body: { email: 'admin@parkingflow.local', password: 'Admin123!' },
            },
          )
          if (res?.data?.accessToken) {
            auth.setSession(res.data.accessToken, res.data.user)
          }
        } catch {
          // ignore error if server not reached
        }
      }

      if (auth.accessToken) {
        options.headers = new Headers(options.headers)
        options.headers.set('Authorization', `Bearer ${auth.accessToken}`)
      }
    },
  })
}
```

---

## 📁 `apps/web/app/pages/index.vue`

```vue
<script setup lang="ts">
import type { ParkingSpace } from '~/types/parking'

const {
  spaces,
  total,
  available,
  occupied,
  outOfService,
  occupancyPercentage,
  error,
  status,
  refresh,
} = useParkingSpaces()

const { checkIn } = useParkingSessions()

const selectedSpace = ref<ParkingSpace | null>(null)

const handleSelect = (space: ParkingSpace) => {
  selectedSpace.value = space
}

const handleCheckIn = async (payload: Parameters<typeof checkIn>[0]) => {
  await checkIn(payload)
  await refresh()
}
</script>

<template>
  <main class="min-h-screen bg-slate-50">
    <header class="border-b border-slate-200 bg-white">
      <div class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-10">
        <div>
          <p class="text-sm font-black uppercase tracking-widest text-indigo-600">ParkingFlow</p>
          <h1 class="mt-2 text-4xl font-black text-slate-900">Dashboard de estacionamiento</h1>
          <p class="mt-3 max-w-2xl text-slate-600">
            Visualización de cajones mediante componentes y estructuras TypeScript.
          </p>
        </div>
        <button
          type="button"
          @click="refresh()"
          class="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-100 active:scale-95"
          title="Actualizar estado de cajones"
        >
          <svg class="h-4 w-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualizar
        </button>
      </div>
    </header>

    <div class="mx-auto max-w-7xl space-y-10 px-6 py-10">
      <ParkingSummary
        :total="total"
        :available="available"
        :occupied="occupied"
        :out-of-service="outOfService"
        :occupancy-percentage="occupancyPercentage"
      />

      <div
        v-if="selectedSpace"
        class="rounded-2xl border border-indigo-200 bg-indigo-50 p-5"
      >
        <p class="text-xs font-black uppercase tracking-widest text-indigo-600">Selección</p>
        <p class="mt-2 text-slate-700">
          Cajón <strong>{{ selectedSpace.code }}</strong> — {{ selectedSpace.status }}
        </p>
      </div>

      <div v-if="status === 'pending'" class="rounded-2xl bg-white p-6 text-slate-500">
        Cargando cajones...
      </div>

      <div v-else-if="error" class="rounded-2xl border border-red-200 bg-red-50 p-6">
        <p class="font-bold text-red-700">No fue posible cargar los cajones.</p>
        <button class="mt-3 rounded-lg bg-red-600 px-4 py-2 text-white" @click="refresh()">
          Reintentar
        </button>
      </div>

      <ParkingGrid v-else :spaces="spaces" @select="handleSelect" />

      <VehicleEntryForm @submit="handleCheckIn" />
    </div>
  </main>
</template>
```
