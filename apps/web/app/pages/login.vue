<script setup lang="ts">
const email = ref('admin@parkingflow.local')
const password = ref('Admin123!')
const errorMessage = ref<string | null>(null)
const loading = ref(false)

const auth = useAuthStore()
const api = useApi()

const submit = async () => {
  loading.value = true
  errorMessage.value = null

  try {
    const response = await api<{
      data: {
        accessToken: string
        user: {
          id: string
          name: string
          email: string
          role: 'ADMIN' | 'OPERATOR'
          active: boolean
        }
      }
    }>('/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value },
    })

    auth.setSession(response.data.accessToken, response.data.user)
    await navigateTo('/')
  } catch {
    errorMessage.value = 'Credenciales inválidas.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="grid min-h-screen place-items-center bg-slate-950 px-6">
    <form class="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl" @submit.prevent="submit">
      <p class="text-sm font-black uppercase tracking-widest text-indigo-600">ParkingFlow</p>
      <h1 class="mt-2 text-3xl font-black text-slate-900">Iniciar sesión</h1>

      <label class="mt-8 block">
        <span class="text-sm font-semibold text-slate-700">Correo</span>
        <input v-model="email" type="email" class="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3">
      </label>

      <label class="mt-5 block">
        <span class="text-sm font-semibold text-slate-700">Contraseña</span>
        <input v-model="password" type="password" class="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3">
      </label>

      <p v-if="errorMessage" class="mt-4 text-sm font-semibold text-red-600">{{ errorMessage }}</p>

      <button type="submit" class="mt-6 w-full rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white disabled:opacity-60" :disabled="loading">
        {{ loading ? 'Ingresando...' : 'Entrar' }}
      </button>
    </form>
  </main>
</template>
