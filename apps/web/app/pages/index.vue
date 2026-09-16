<script setup lang="ts">
import type { ParkingSpace } from '~/types/parking'

const {
  spaces,
  total,
  available,
  occupied,
  outOfService,
  occupancyPercentage,
} = useParkingMock()

const selectedSpace = ref<ParkingSpace | null>(null)

const handleSelect = (space: ParkingSpace) => {
  selectedSpace.value = space
}
</script>

<template>
  <main class="min-h-screen bg-slate-50">
    <header class="border-b border-slate-200 bg-white">
      <div class="mx-auto max-w-7xl px-6 py-10">
        <p class="text-sm font-black uppercase tracking-widest text-indigo-600">ParkingFlow</p>
        <h1 class="mt-2 text-4xl font-black text-slate-900">Dashboard de estacionamiento</h1>
        <p class="mt-3 max-w-2xl text-slate-600">
          Visualización de cajones mediante componentes y estructuras TypeScript.
        </p>
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

      <ParkingGrid :spaces="spaces" @select="handleSelect" />
    </div>
  </main>
</template>
