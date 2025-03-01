<script setup lang="ts">
import { MultiViewInjectionKey } from './'

defineOptions({ inheritAttrs: false })

type Props = { label: string; custom?: boolean }

const { label, custom = false } = defineProps<Props>()
const { activeIndex, register } = inject(MultiViewInjectionKey)!
const attrs = useAttrs()

const id = useId()
const ctx = register({ id, label, ...attrs })
</script>

<template>
  <slot :activeIndex v-bind="ctx" v-if="!custom && ctx.active.value" />
</template>
