<script setup lang="ts">
import * as PrimeVue from 'primevue'
import type { Field, Option } from '@v3technology/core'
import { useEditorStore } from '../store'
import { resolveComponentDefinition } from '@v3technology/components'

const field = defineModel<Field>('field')
const store = useEditorStore()
const def = computed(() => resolveComponentDefinition(field.value?.control))

const onRemoveOptionClick = (option: Option) => {
  store.removeOption(field.value!, option)
}
const newOptionLabel = ref('')
const newOptionValue = ref('')
const onAddOptionClick = () => {
  store.addOption(field.value!, {
    label: newOptionLabel.value,
    value: newOptionValue.value ?? newOptionLabel.value,
  })
  newOptionLabel.value = ''
  newOptionValue.value = ''
}
</script>

<template>
  <div class="relative">
    <details open class="group transition">
      <summary
        class="flex select-none appearance-none items-center gap-1.5 bg-slate-100 px-4 py-3 text-sm font-semibold leading-6 text-slate-800"
      >
        <i class="fal fa-fw fa-chevron-down hidden group-open:inline-block" aria-hidden="true"></i
        ><i
          class="fal fa-fw fa-chevron-right inline-block group-open:hidden"
          aria-hidden="true"
        ></i>
        Options
      </summary>
      <div class="group-open:p-3" v-if="field && def?.allowOptions">
        <div class="grid grid-cols-[1fr_1fr_2.5rem]">
          <div class="mb-0.5 flex text-sm font-medium">Label</div>
          <div class="mb-0.5 flex text-sm font-medium">Value</div>
          <div></div>
          <template v-for="(option, i) in field.options">
            <div class="group/op col-span-full grid grid-cols-subgrid" v-if="field.options">
              <input
                type="text"
                v-model="field.options[i].label"
                class="min-w-0 border-zinc-300 bg-transparent focus:z-10"
              />
              <input
                type="text"
                v-model="field.options[i].value"
                class="min-w-0 border-zinc-300 bg-transparent focus:z-10"
              />
              <PrimeVue.Button
                variant="link"
                icon="fal fa-fw fa-xmark text-red-700 group-hover/op:font-normal group-hover/op:opacity-100 opacity-20"
                @click="onRemoveOptionClick(option)"
              ></PrimeVue.Button>
            </div>
          </template>
          <hr class="col-span-full my-1" />
          <div class="group/op col-span-full grid grid-cols-subgrid">
            <input
              type="text"
              v-model="newOptionLabel"
              class="min-w-0 border-zinc-300 focus:z-10"
            />
            <input
              type="text"
              v-model="newOptionValue"
              class="min-w-0 border-zinc-300 focus:z-10"
            />
            <PrimeVue.Button
              variant="link"
              icon="fal fa-fw fa-plus text-green-600 group-hover/op:font-normal "
              @click="onAddOptionClick"
            ></PrimeVue.Button>
          </div>
        </div>
      </div>
    </details>
    <div class="absolute right-0 top-1">
      <PrimeVue.Button
        variant="link"
        class="group/icon"
        icon="fal fa-fw fa-arrow-down-a-z group-hover/icon:font-bold"
      ></PrimeVue.Button>
      <PrimeVue.Button
        variant="link"
        class="group/icon"
        icon="fal fa-fw fa-expand group-hover/icon:font-bold"
      ></PrimeVue.Button>
    </div>
  </div>
</template>
