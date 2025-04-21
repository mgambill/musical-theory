<script setup lang="ts">
import { type Field } from '@v3technology/core'
import { useEditorStore } from '../editor'

defineOptions({
  inheritAttrs: false,
})

const attrs = useAttrs()
const { field } = defineProps<{ field: Field }>()
//TODO: add support for field validation
const { useBinding } = useEditorStore()
const bindings = useBinding(field, attrs)
</script>

<template>
  <div v-bind="bindings" class="relative p-4 group">
    <slot />
    <div class="absolute -bottom-6 right-0">
      <p class="opacity-0 group-hover:opacity-30">{{ field.control }}</p>
    </div>
  </div>
</template>
