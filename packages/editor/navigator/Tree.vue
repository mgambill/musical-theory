<!-- <script setup lang="ts">
import ContextMenu from 'primevue/contextmenu'
import { type Field } from '@v3technology/fields-core'
import TreeNode from './TreeNode.vue'
import { useProvideLayerState, useLayerState } from './useTree'
import { isRef, isReactive, ref } from 'vue'

const fields = defineModel<Field[]>({ required: true })
console.log(isRef(fields), isReactive(fields))

const onImageRightClick = (event: Event, field: Field) => {
  activeField.value = field
  console.log(menu.value, activeField.value)
  menu.value.show(event)
}

useProvideLayerState(fields, onImageRightClick)

const { selectedKeys, expandedKeys, expandAll, collapseAll, findField } = useLayerState()

const menu = ref()
const activeField = ref()
const items = ref([
  {
    label: 'Clone',
    icon: 'pi pi-copy',
    command: () => {
      const [f, p] = findField(activeField.value.id)
      if (p && f) {
        const newField = {
          ...f,
          id: crypto.randomUUID(),
          label: { text: f.label.text + '- Copy' }
        } as Field
        p.push(newField)
      }
      console.log('Copy', activeField.value.id, p, fields)
    }
  },
  {
    label: 'Rename',
    icon: 'pi pi-file-edit',
    command: () => {
      const [f, p] = findField(activeField.value)
      console.log('Rename', activeField.value.id, p)
    }
  }
])

expandAll()
</script>

<template>
  <div class="flex w-full bg-white">
    <ul class="w-96">
      <template v-for="(field, i) in fields" :key="field.id">
        <TreeNode :field :index="i" :depth="0" />
      </template>
    </ul>
  </div>
  <ContextMenu ref="menu" :model="items" />
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
