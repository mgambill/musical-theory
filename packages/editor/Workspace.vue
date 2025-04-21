<script setup lang="ts">
import { computed, ref, type Component } from 'vue'
import * as PrimeVue from 'primevue'

import { useEditorStore } from './store'
import { DISPLAY_MODES, type DisplayModes } from '~/components'

// views
import EditView from './views/EditView.vue'
import CodeView from './views/CodeView.vue'
import EntryView from './views/EntryView.vue'
import ResponseView from './views/ResponseView.vue'

const { initialMode = 'edit' } = defineProps<{ initialMode?: DisplayModes }>()

const store = useEditorStore()

const tabs = computed(() => {
  return [
    { label: 'Editor', icon: 'fa-pen-field', component: EditView, mode: DISPLAY_MODES.edit },
    { label: 'Preview', icon: 'fa-file-invoice', component: EntryView, mode: DISPLAY_MODES.entry },
    { label: 'Response', icon: 'fa-tv', component: ResponseView, mode: DISPLAY_MODES.response },
    { label: 'Code', icon: 'fa-code', component: CodeView, mode: DISPLAY_MODES.code },
  ] as { label: string; icon: string; component: Component; mode: DisplayModes }[]
})
console.log(initialMode)
const currentIndex = ref<number>(tabs.value.findIndex((t) => t.mode === initialMode))

const onTabChange = (index: number | string) => {
  store.setMode(tabs.value[+index].mode)
  currentIndex.value = +index
}

store.setMode(tabs.value[currentIndex.value].mode)
</script>

<template>
  <div class="h-full relative">
    <PrimeVue.Tabs
      v-model="currentIndex"
      :value="currentIndex"
      class="!grid !grid-rows-[auto_1fr] h-full !w-full"
      @update:value="onTabChange"
    >
      <PrimeVue.TabList class="">
        <template v-for="(item, index) in tabs" :key="item.label">
          <PrimeVue.Tab
            :value="index"
            :class="{ '!bg-primary/5': currentIndex === index }"
            class="flex items-center gap-1.5"
          >
            <i :class="[currentIndex === index ? 'fadl' : 'fal', 'fa-fw', item.icon]"></i>
            {{ item.label }}
          </PrimeVue.Tab>
        </template>
      </PrimeVue.TabList>
      <PrimeVue.TabPanels class="relative !bg-transparent">
        <div class="absolute inset-0 overflow-y-auto w-full p-8">
          <div class="w-full max-w-screen-xl mx-auto">
            <template v-for="(item, index) in tabs" :key="item.label">
              <PrimeVue.TabPanel :value="index">
                <component :is="item.component" />
              </PrimeVue.TabPanel>
            </template>
          </div>
        </div>
      </PrimeVue.TabPanels>
    </PrimeVue.Tabs>
  </div>
</template>
