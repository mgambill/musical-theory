<script setup lang="ts">
import { toValue, computed } from 'vue'
import { DISPLAY_MODES, getFormStateContext } from '../composables/useFormState'
import { isOption } from '@v3technology/core'
import { type FieldProps } from '../types'

const props = defineProps<FieldProps & { value?: unknown }>()
const context = getFormStateContext()
const displayValue = computed(() => {
  const v = toValue(props.value)
  if (isOption(v)) return v.label
  if (Array.isArray(v)) {
    return v.map((x) => (isOption(x) ? x.label : x)).join(', ')
  }
  return v
})
const isDisplayMode = computed(() => context.mode.value === DISPLAY_MODES.response)
</script>

<template>
  <template v-if="isDisplayMode">
    <slot name="value" :value="props.value">
      {{ displayValue }}
    </slot>
  </template>
  <template v-else>
    <slot />
  </template>
</template>
