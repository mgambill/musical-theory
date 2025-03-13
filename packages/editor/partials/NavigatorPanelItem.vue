<script setup lang="ts">
import { computed } from 'vue'
import type { Field, Form } from '@v3technology/core'
import { useEditorStore } from '../store'
import { resolveComponentDefinition } from '@v3technology/components'

const { useBinding } = useEditorStore()
type Props = { field: Field; parent: Field | Form; root?: boolean }
const { field, root = false } = defineProps<Props>()
const def = computed(() => resolveComponentDefinition(field.control)!)

const bindings = useBinding(field)
</script>

<template>
  <li :class="[!root && 'border-l ml-4', 'x-2']">
    <div
      v-bind="bindings"
      class="grid grid-cols-[2rem_auto] col-span-full items-center py-1 px-2 cursor-pointer"
    >
      <i :class="['fal fa-fw text-zinc-400 ak-selected:text-black', def?.icon]"></i>
      <span class="line-clamp-1 ak-selected:text-black">{{
        (field.label?.text?.length ?? 0) > 0 ? field.label?.text : def?.label
      }}</span>
    </div>

    <ul class="">
      <template v-for="f in field.fields" :key="`${f.id}`">
        <NavigatorPanelItem :field="f" :parent="field" />
      </template>
    </ul>
  </li>
</template>
