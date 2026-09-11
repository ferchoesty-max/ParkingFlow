<script setup lang="ts">
import BaseBadge from '../ui/BaseBadge.vue'
import type { ParkingSpace } from '~/types/parking'

interface Props {
  space: ParkingSpace
}

defineProps<Props>()

const emit = defineEmits<{
  select: [space: ParkingSpace]
}>()

const statusData = {
  AVAILABLE: { label: 'Disponible', variant: 'success' as const },
  OCCUPIED: { label: 'Ocupado', variant: 'danger' as const },
  OUT_OF_SERVICE: { label: 'Fuera de Servicio', variant: 'warning' as const }
}
</script>

<template>
  <button
    type="button" 
    class="w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
    @click="emit('select', space)"
  >
    <div class="flex items-start justify-between gap-3">
      <div>
        <p class="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Cajón
        </p>
        <p class="mt-1 text-2xl font-black text-slate-900">
          {{ space.code }}
        </p>
      </div>
      <BaseBadge :variant="statusData[space.status].variant">
        {{ statusData[space.status].label }}
      </BaseBadge>
    </div>

    <dl class="mt-5 grid grid-cols-2 gap-3 text-sm">
      <div>
        <dt class="text-slate-400">Zona</dt>
        <dd class="font-semibold text-slate-700">{{ space.zone }}</dd>
      </div>

      <div>
        <dt class="text-slate-400">Tipo</dt>
        <dd class="font-semibold text-slate-700">{{ space.type }}</dd>
      </div>
    </dl>
  </button>
</template>
