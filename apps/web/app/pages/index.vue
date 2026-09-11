<script setup lang="ts">
import { ref } from 'vue'
import { useParkingMock } from '~/composables/useParkingMock'
import ParkingSummary from '~/components/parking/ParkingSummary.vue'
import ParkingGrid from '~/components/parking/ParkingGrid.vue'
import type { ParkingSpace, ParkingSpaceStatus } from '~/types/parking'

const {
  spaces,
  total,
  available,
  occupied,
  outOfService,
  occupancyPercentage,
  updateStatus
} = useParkingMock()

const lastActionMessage = ref<string>('Haz clic en cualquier cajón para alternar su estado en tiempo real.')

const handleSelectSpace = (space: ParkingSpace) => {
  const nextStatusMap: Record<ParkingSpaceStatus, ParkingSpaceStatus> = {
    AVAILABLE: 'OCCUPIED',
    OCCUPIED: 'OUT_OF_SERVICE',
    OUT_OF_SERVICE: 'AVAILABLE'
  }
  const oldStatus = space.status
  const newStatus = nextStatusMap[space.status]
  updateStatus(space.id, newStatus)
  lastActionMessage.value = `Evento: Se cambió el estado del Cajón ${space.code} de [${oldStatus}] a [${newStatus}]`
}
</script>

<template>
  <main class="min-h-screen bg-slate-50">
    <!-- Header de la Aplicación -->
    <header class="border-b border-slate-200 bg-white shadow-xs">
      <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p class="text-xs font-bold uppercase tracking-widest text-indigo-600">
          ParkingFlow &bull; Sistema de Gestión en la Nube
        </p>
        <h1 class="mt-1 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          Dashboard de Estacionamiento
        </h1>
        <p class="mt-2 max-w-2xl text-sm text-slate-600">
          Monitoreo reactivo en tiempo real con Vue 3, Nuxt y Tailwind CSS.
        </p>
      </div>
    </header>

    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Monitor de Eventos / Acciones -->
      <div class="mb-8 flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50/70 px-5 py-3 text-sm text-indigo-900 shadow-xs">
        <div class="flex items-center gap-3">
          <span class="relative flex h-3 w-3">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
            <span class="relative inline-flex h-3 w-3 rounded-full bg-indigo-600" />
          </span>
          <span class="font-medium">{{ lastActionMessage }}</span>
        </div>
        <span class="hidden font-mono text-xs text-indigo-500 sm:inline-block">
          useParkingMock
        </span>
      </div>

      <!-- Resumen Métrico -->
      <div class="mb-10">
        <ParkingSummary
          :total="total"
          :available="available"
          :occupied="occupied"
          :out-of-service="outOfService"
          :occupancy-percentage="occupancyPercentage"
        />
      </div>

      <!-- Cuadrícula de Cajones -->
      <ParkingGrid
        :spaces="spaces"
        @select="handleSelectSpace"
      />
    </div>
  </main>
</template>
