<script setup lang="ts">
import { useMultiView } from './'

const currentIndex = defineModel<number>({ default: 0, required: true})
const { views, activeIndex, isActive} = useMultiView(currentIndex)
</script>

<template>
  <slot :views  :activeIndex :isActive />
</template>
