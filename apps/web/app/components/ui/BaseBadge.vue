<script setup lang="ts">
type Variant = 'success' | 'danger' | 'warning' | 'neutral'
interface Props {
  variant?: Variant
}

withDefaults(defineProps<Props>(), {
  variant: 'neutral'
})

const classes: Record<Variant, string> = {
  success: 'bg-emerald-100 text-emerald-700',
  danger: 'bg-red-100 text-red-700',
  warning: 'bg-amber-100 text-amber-700',
  neutral: 'bg-slate-100 text-slate-700'
}
</script>

<template>
  <span 
    :class="classes[variant]"
    class="inline-flex rounded-full px-3 py-1 text-xs font-bold"
  >
    <slot />
  </span>
</template>
