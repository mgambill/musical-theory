<script setup lang="ts">
import { ref, type Component } from 'vue'

import * as PrimeVue from 'primevue'

type Props = { tabs: { label: string; icon: string; component: Component }[] }
const { tabs } = defineProps<Props>()

const currentIndex = ref<number | string>(0)
// type Props = {}
// const { } = defineProps<Props>()
// const emits = defineEmits<{ click:[] }>()
</script>

<template>
  <PrimeVue.Tabs
    :value="currentIndex"
    class="!grid !grid-rows-[auto_1fr] w-full h-full border-x"
    @update:value="(v) => (currentIndex = v)"
  >
    <PrimeVue.TabList>
      <template v-for="(item, index) in tabs" :key="item.label">
        <PrimeVue.Tab
          :value="index"
          :class="{ '!bg-primary/5': currentIndex === index }"
          class="flex items-center gap-1.5"
          :title="item.label"
        >
          <div><i :class="[currentIndex === index ? 'fadl' : 'fal', 'fa-fw', item.icon]"></i></div>
        </PrimeVue.Tab>
      </template>
    </PrimeVue.TabList>
    <PrimeVue.TabPanels class="relative bg-black">
      <template v-for="(item, index) in tabs" :key="item.label">
        <PrimeVue.TabPanel :value="index" class="absolute inset-0 overflow-auto">
          <component :is="item.component" />
        </PrimeVue.TabPanel>
      </template>
    </PrimeVue.TabPanels>
  </PrimeVue.Tabs>
</template>
