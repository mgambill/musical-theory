<script setup lang="ts">
import { type Form, type StringDictionary } from '@v3technology/core'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { type DisplayModes } from '~/components'
import { useEditorStore } from './store'
import SelectorDock from './SelectorDock.vue'
import Workspace from './Workspace.vue'
import AssetsPanel from './panels/AssetsPanel.vue'
import NavigatorPanel from './panels/NavigatorPanel.vue'
import SlotsPanel from './panels/SlotsPanel.vue'
import LibraryPanel from './panels/LibraryPanel.vue'
import FieldPanel from './panels/FieldPanel.vue'
const store = useEditorStore()
const { initialize } = store
//const { currentField: _currentField } = storeToRefs(store)
const { initialMode } = defineProps<{ initialMode?: DisplayModes }>()
const library = defineModel<Form[]>('library')
const form = defineModel<Form>('form')
const datasource = defineModel<StringDictionary>('datasource', { default: {} })

initialize(form.value, library.value, datasource.value)

const left = computed(() => {
  return [
    { label: 'Navigator', icon: 'fa-layer-group', component: NavigatorPanel },
    { label: 'Assests', icon: 'fa-book-font', component: AssetsPanel },
    { label: 'Slots', icon: 'fa-objects-column', component: SlotsPanel },
    library.value?.length && {
      label: 'Library',
      icon: 'fa-folder-bookmark',
      component: LibraryPanel,
    },
  ].filter((x) => !!x)
})

const right = computed(() => {
  return [{ label: 'General', icon: 'fa-gear', component: FieldPanel }]
})
</script>

<template>
  <div class="grid grid-cols-[minmax(20rem,auto)_1fr_minmax(30rem,auto)] flex-1 w-full">
    <slot name="left">
      <SelectorDock :tabs="left" />
    </slot>

    <slot name="center">
      <Workspace :initialMode />
    </slot>

    <slot name="right">
      <SelectorDock :tabs="right" />
    </slot>
  </div>
</template>
