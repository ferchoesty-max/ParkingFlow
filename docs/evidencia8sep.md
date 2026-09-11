# Evidencia - 8 de Septiembre de 2026

## `app/pages/index.vue`

```vue
<script setup lang="ts">
import ProductCard from '~/components/ProductCard.vue'
import { computed, ref } from 'vue'

interface Product {
    id: number
    title: string
    description: string
    price: number
    available: boolean
}

const products: Product[] = [
    {
        id: 1,
        title: 'Laptop Pro 14',
        description: 'Laptop ligera para trabajo y estudio.',
        price: 24999,
        available: true,
    },
    {
        id: 2,
        title: 'Teclado mecánico',
        description: 'Teclado compacto con switches mecánicos.',
        price: 1499,
        available: true,
    },
    {
        id: 3,
        title: 'Mouse inalámbrico',
        description: 'Mouse ergonómico con conexión inalámbrica.',
        price: 699,
        available: true,
    },
    {
        id: 4,
        title: 'Monitor 27 pulgadas',
        description: 'Monitor de alta resolución para productividad.',
        price: 5299,
        available: false,
    },
    {
        id: 5,
        title: 'Audífonos Bluetooth',
        description: 'Audífonos con cancelación de ruido.',
        price: 2199,
        available: true,
    },
    {
        id: 6,
        title: 'Webcam Full HD',
        description: 'Cámara web para videollamadas nítidas.',
        price: 1199,
        available: true,
    },
    {
        id: 7,
        title: 'Disco SSD externo',
        description: 'Almacenamiento portátil rápido de 1 TB.',
        price: 1899,
        available: true,
    },
    {
        id: 8,
        title: 'Hub USB-C',
        description: 'Adaptador multipuerto para dispositivos modernos.',
        price: 899,
        available: false,
    },
    {
        id: 9,
        title: 'Soporte para laptop',
        description: 'Soporte ajustable de aluminio.',
        price: 799,
        available: true,
    },
    {
        id: 10,
        title: 'Micrófono USB',
        description: 'Micrófono de condensador para grabaciones.',
        price: 1699,
        available: true,
    },
]

const cartCount = ref(0)
const lastEvent = ref('No se ha ejecutado ningún evento')
const favoriteProducts = ref<string[]>([])
const favoriteCount = computed(() => favoriteProducts.value.length)

const handleAddToCart = (productName: string) => {
    cartCount.value++
    lastEvent.value = `Evento Recibido: add-to-cart | Producto: ${productName}`
}

const handleToggleFavorite = (productName: string) => {
    const productIndex = favoriteProducts.value.indexOf(productName)
    if (productIndex === -1) {
        favoriteProducts.value.push(productName)
        lastEvent.value = `Evento Recibido: toggle-favorite | Se Agrego: ${productName}`
    } else {
        favoriteProducts.value.splice(productIndex, 1)
        lastEvent.value = `Evento Recibido: toggle-favorite | Se Elimino: ${productName}`
    }
}
</script>

<template>
    <main class="min-h-screen bg-slate-50">
        <section class="border-b border-slate-200 bg-white">
            <div class="mx-auto max-w-7xl px-6 py-12">
                <p class="mb-3 text-sm font-bold uppercase tracking-widset text-indigo-600">
                    Proyecto con Nuxt 4 y TailwindCSS 4 + Vue 3
                </p>
                <h1 class="max-w-4xl text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
                    Componentes con Propiedades y Eventos
                </h1>
                <p class="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                    Ejemplo práctico para visualizar como un componente puede recibir propiedades y emitir eventos.
                </p>
            </div>
        </section>
        <section class="mx-auto max-w-7xl px-6 py-10">
            <div class="mb-10 grid gap-4 md:grid-cols-3">
                <div class="rounded-2xl bg-slate-900 p-6 text-white">
                    <p class="text-sm text-slate-300">
                        Productos
                    </p>
                    <p class="mt-2 text-4xl font-black">
                        {{ products.length }}
                    </p>
                </div>
                <div class="rounded-2xl bg-indigo-600 p-6 text-white">
                    <p class="text-sm text-indigo-100">
                        Productos Agregados
                    </p>
                    <p class="mt-2 text-4xl font-black">
                        {{ cartCount }}
                    </p>
                </div>
                <div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                    <p class="text-sm text-slate-500">
                        Favoritos
                    </p>
                    <p class="mt-2 text-4xl font-black text-slate-900">
                        {{ favoriteCount }}
                    </p>
                </div>
            </div>
            <div class="mb-10 rounded-2xl border border-indigo-200 bg-indigo-50 py-5">
                <p class="mb-2 text-xs font-bold uppercase tracking-widest text-indigo-700">
                    Monitor de Eventos
                </p>
                <p class="font-mono text-sm text-salte-700">
                    {{ lastEvent }}
                </p>
            </div>
            <div class="grid gap-6 lg:grid-cols-3">
                <ProductCard
                    v-for="product in products"
                    :key="product.id"
                    :title="product.title"
                    :description="product.description"
                    :price="product.price"
                    :available="product.available"
                    @add-to-cart="handleAddToCart"
                    @toggle-favorite="handleToggleFavorite"
                />
            </div>
        </section>
    </main>
</template>
```

## `app/components/ProductCard.vue`

```vue
<script setup lang="ts">
interface Props {
    title: string
    description: string
    price: number
    available?: boolean
}
const props = withDefaults(defineProps<Props>(), {
    available: true
})
const emit = defineEmits<{
    'add-to-cart': [productName: string]
    'toggle-favorite': [productName: string]
}>()
const handleAddToCart = () => {
    emit('add-to-cart', props.title)
}
const handleToggleFavorite = () => {
    emit('toggle-favorite', props.title)
}
</script>
 
<template>
    <article class=" p-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
        <div class="mb-4 flex items-center justify-between gap-4">
            <div>
                <p class="mb-1 text-xs font-semibold uppercase tracking-widest text-indigo-600">
                    Componente Hijo
                </p>
                <h2 class="text-xl font-bold text-slate-900">
                    {{ title }}
                </h2>
            </div>
            <span
             class="rounded-full px-3 py-1 text-xs font-semibold"
             :class="available ? 'bg-emerald-100 text-emerald-700':'bg-red-100 text-red-700'"
            >
                {{ available ? 'Disponible' : 'Agotado' }}
            </span>
        </div>
        <p class="mb-6 min-h-12 text-sm leading-6 text-slate-600">
            {{ description }}
        </p>
        <div class="mb-6">
            <p class="text-sm text-slate-500">
                Precio
            </p>
            <p class="text-3xl font-bold text-slate-900">
                ${{ price.toFixed(2) }}
            </p>
        </div>
        <div class="grid gap-3 sm:grid-cols-2">
            <button
                class="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                type="button"
                :disabled="!available"
                @click="handleAddToCart"
            >
                Agregar
            </button>
            <button
                class="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                type="button"
                @click="handleToggleFavorite"
            >
                Favorito
            </button>
        </div>
    </article>
</template>
```

## Evidencia

![Evidencia 8 de Septiembre](./evidenciaimagen8sep.png)
