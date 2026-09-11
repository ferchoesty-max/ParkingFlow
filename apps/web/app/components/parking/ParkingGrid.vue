<script setup lang="ts">
import type { ParkingSpace } from '~/types/parking'
import ParkingSpaceCard from './ParkingSpaceCard.vue'

interface Props {
  spaces: ParkingSpace[]
}

defineProps<Props>()

const emit = defineEmits<{
  select: [space: ParkingSpace]
}>()
</script>

<template>
  <section>
    <div class="mb-5 flex items-center justify-between">
      <h2 class="text-xl font-bold text-slate-900">
        Estado del Estacionamiento
      </h2>
      <span class="text-sm font-medium text-slate-500">
        {{ spaces.length }} cajones registrados
      </span>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <ParkingSpaceCard 
        v-for="space in spaces"
        :key="space.id"
        :space="space"
        @select="emit('select', $event)"
      />
    </div>
  </section>
</template>
