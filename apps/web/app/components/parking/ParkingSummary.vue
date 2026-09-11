<script setup lang="ts">
interface Props {
  total?: number
  available?: number
  occupied?: number
  outOfService?: number
  occupancyPercentage?: number
}

withDefaults(defineProps<Props>(), {
  total: 0,
  available: 0,
  occupied: 0,
  outOfService: 0,
  occupancyPercentage: 0
})
</script>

<template>
  <section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
    <!-- Total Cajones -->
    <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">
        Total Cajones
      </p>
      <p class="mt-2 text-3xl font-black text-slate-900">
        {{ total }}
      </p>
      <p class="mt-1 text-xs text-slate-400">Capacidad total</p>
    </div>

    <!-- Disponibles -->
    <div class="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 shadow-sm">
      <p class="text-xs font-semibold uppercase tracking-wider text-emerald-700">
        Disponibles
      </p>
      <p class="mt-2 text-3xl font-black text-emerald-800">
        {{ available }}
      </p>
      <p class="mt-1 text-xs text-emerald-600">Listos para usar</p>
    </div>

    <!-- Ocupados -->
    <div class="rounded-2xl border border-red-200 bg-red-50/60 p-5 shadow-sm">
      <p class="text-xs font-semibold uppercase tracking-wider text-red-700">
        Ocupados
      </p>
      <p class="mt-2 text-3xl font-black text-red-800">
        {{ occupied }}
      </p>
      <p class="mt-1 text-xs text-red-600">Vehículos en sitio</p>
    </div>

    <!-- Fuera de Servicio -->
    <div class="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 shadow-sm">
      <p class="text-xs font-semibold uppercase tracking-wider text-amber-700">
        Fuera de Servicio
      </p>
      <p class="mt-2 text-3xl font-black text-amber-800">
        {{ outOfService }}
      </p>
      <p class="mt-1 text-xs text-amber-600">Mantenimiento</p>
    </div>

    <!-- Porcentaje de Ocupación -->
    <div class="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-5 shadow-sm">
      <div class="flex items-center justify-between">
        <p class="text-xs font-semibold uppercase tracking-wider text-indigo-700">
          Ocupación
        </p>
        <span class="text-xs font-bold text-indigo-700">{{ occupancyPercentage }}%</span>
      </div>
      <p class="mt-2 text-3xl font-black text-indigo-900">
        {{ occupancyPercentage }}%
      </p>
      <div class="mt-2 h-2 w-full overflow-hidden rounded-full bg-indigo-200">
        <div 
          class="h-full rounded-full bg-indigo-600 transition-all duration-300"
          :style="{ width: `${occupancyPercentage}%` }"
        />
      </div>
    </div>
  </section>
</template>
