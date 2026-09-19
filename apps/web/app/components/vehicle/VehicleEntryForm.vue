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
}>()

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
