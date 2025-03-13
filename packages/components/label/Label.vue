<script setup lang="ts">
//import { computed } from 'vue'

import { type FieldLabel } from '@v3technology/core'

const { bold = true, visibility = 'visible' } = defineProps<Partial<FieldLabel>>()

//const visibilityClass = computed(() => (visibility === "invisible" ? "invisible" : visibility === 'hidden' ? 'hidden' : ''))
</script>

<template>
  <label
    v-if="visibility !== 'hidden'"
    :class="[{ 'font-medium': bold }, visibility, 'text-sm/6 text-gray-700 mb-1']"
    ><slot
  /></label>
</template>
