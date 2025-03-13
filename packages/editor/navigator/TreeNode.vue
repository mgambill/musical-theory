<!-- <script setup lang="ts">
//import { type TreeNode } from 'primevue/treenode'
import { type Field } from '@v3technology/fields-core'
import { computed } from 'vue';

import { useLayerState } from './useTree'
import { useControlResolver } from '../../../composables'
type Props = { depth: number; index?: number; lineage?: string }

const field = defineModel<Field>('field', { required: true })
const control = useControlResolver(field)
const { bindings, expandedKeys, triggerContextMenu } = useLayerState()
const { depth, index = -1 } = defineProps<Props>()

const hasChildren = computed(() => {
  return field.value.fields && field.value.fields.length > 0
})
const expanded = computed(() => {
  return expandedKeys && expandedKeys.value[field.value.key!] === true
})
const toggleExpand = () => {
  const t = expandedKeys.value[field.value.key!] ?? false
  expandedKeys.value[field.value.key!] = !t
}
</script>

<template>
  <li :class="[depth > 0 && 'ml-4', 'my-0.5']">
    <div class="grid grid-cols-[theme(spacing.4),theme(spacing.5),1fr] gap-2 rounded py-1.5 hover:bg-zinc-100" v-bind="bindings(field, index)" @contextmenu="triggerContextMenu($event, field)">
      <template v-if="hasChildren">
        <button @click="toggleExpand">
          <i class="fal fa-fw fa-chevron-down" v-if="expanded"></i>
          <i class="fal fa-fw fa-chevron-right" v-else></i>
        </button>
      </template>
      <template v-else>
        <span></span>
      </template>
      <button class="pointer-events-none col-span-2 grid grid-cols-subgrid justify-start text-left">
        <span>
          <i :class="[control.icon, 'fa-fw']"></i>
        </span>
        <span> {{ field.label?.text && field.label?.text.length > 0 ? field.label?.text : (control?.name ?? field.control) }}</span>
      </button>
    </div>

    <ul v-if="field.fields?.length === 0">
      <li class="my-0.5 ml-10 text-xs text-gray-500">
        <div v-bind="bindings(field, index)">No Fields</div>
      </li>
    </ul>
    <ul v-if="hasChildren">
      <template v-for="(n, i) in field.fields" :key="n.key">
        <TreeNode :field="n" :index="i" :depth="depth + 1" />
      </template>
    </ul>
  </li>
</template>

<style>
.hovering {
  @apply bg-blue-100;
}
.dragging {
  @apply opacity-50;
}
</style> -->
<template></template>