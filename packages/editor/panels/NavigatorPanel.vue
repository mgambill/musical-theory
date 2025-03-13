<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import NavigatorPanelItem from '../partials/NavigatorPanelItem.vue'
import { useEditorStoreRef } from '../store'
import * as PrimeVue from 'primevue'

const { form } = useEditorStoreRef()

const currentSlot = ref()
const slotFields = computed(() => form.value?.slots?.[currentSlot.value] ?? {})

onMounted(() => {
  currentSlot.value = Object.keys(form.value?.slots)[0]
})
</script>

<template>
  <div class="mb-8">
    <div class="px-2 pb-2 bg-zinc-50 grid grid-cols-[1fr_auto] gap-2 items-end">
      <div>
        <label for="" class="text-xs">Slot</label>
        <select name="" id="" class="border px-3 py-1 w-full">
          <template v-for="(slot, key) in form.slots" :key="key">
            <option :value="key">{{ slot.label }}</option>
          </template>
        </select>
      </div>
      <PrimeVue.Button icon="fal fa-fw fa-plus" size="small" class="self-bottom" variant="text" />
    </div>
    <hr class="mb-3" />
    <ul>
      <template v-for="field in slotFields.fields" :key="field.id">
        <NavigatorPanelItem :field="field" :parent="form" :root="true" />
      </template>
    </ul>
  </div>
  <!-- <Tree v-model:expandedKeys="expandedKeys" :value="form" class="w-full md:w-[30rem]"></Tree> -->
</template>
