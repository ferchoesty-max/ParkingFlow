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
  <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
    <article class="rounded-2xl bg-slate-900 p-5 text-white">
      <p class="text-sm text-slate-300">Total</p>
      <p class="mt-2 text-3xl font-black">{{ total }}</p>
    </article>
    <article class="rounded-2xl bg-emerald-600 p-5 text-white">
      <p class="text-sm text-emerald-100">Disponibles</p>
      <p class="mt-2 text-3xl font-black">{{ available }}</p>
    </article>
    <article class="rounded-2xl bg-red-600 p-5 text-white">
      <p class="text-sm text-red-100">Ocupados</p>
      <p class="mt-2 text-3xl font-black">{{ occupied }}</p>
    </article>
    <article class="rounded-2xl bg-amber-500 p-5 text-white">
      <p class="text-sm text-amber-100">Fuera de servicio</p>
      <p class="mt-2 text-3xl font-black">{{ outOfService }}</p>
    </article>
    <article class="rounded-2xl bg-indigo-600 p-5 text-white">
      <p class="text-sm text-indigo-100">Ocupación</p>
      <p class="mt-2 text-3xl font-black">{{ occupancyPercentage }}%</p>
    </article>
  </section>
</template>
