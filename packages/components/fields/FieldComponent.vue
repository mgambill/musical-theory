<script setup lang="ts">
import { type FieldProps } from '../types'
import { useComponentContext } from '../composables/useResolvers'
import { computed } from 'vue'
const props = defineProps<FieldProps & { nowrapper?: boolean }>()
const { resolveComponent } = useComponentContext()
const component = computed(() => (props.field ? resolveComponent(props.field.control) : null))
</script>

<template>
  <template v-if="component"> <component :is="component" v-bind="props" /> </template>
  <template v-else>
    <div>
      component `<span class="font-mono">{{ props.field.control ?? 'unspecified' }}</span
      >` not found
    </div>
  </template>
</template>
