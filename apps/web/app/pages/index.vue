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
