<script setup lang="ts">
import { useEditorStore } from '../store'

const { form } = useEditorStore()
</script>

<template>
  <template v-for="slot in form.slots" :key="slot.label">
    <li>{{ slot.label }}</li>
  </template>
</template>
