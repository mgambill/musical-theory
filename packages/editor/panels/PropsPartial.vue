<script setup lang="ts">
import type { Field } from '@v3technology/core'
import { useComponentContext } from '~/components'
import PropsPartialItem from '../partials/PropsPartialItem.vue'

const field = defineModel<Field>('field')

const { findDefinitionById } = useComponentContext()
const currentDefinition = computed(() => findDefinitionById(field.value?.control))
</script>

<template>
  <details open class="group transition">
    <summary
      class="flex select-none appearance-none items-center gap-1.5 bg-slate-100 px-4 py-3 text-sm font-semibold leading-6 text-slate-800"
    >
      <i class="fal fa-fw fa-chevron-down hidden group-open:inline-block" aria-hidden="true"></i
      ><i class="fal fa-fw fa-chevron-right inline-block group-open:hidden" aria-hidden="true"></i>
      Settings
    </summary>
    <div class="flex flex-col gap-2 group-open:p-3" v-if="currentDefinition && field">
      <template v-for="(prop, key, index) in currentDefinition.props" :key="key">
        <div class="col-span-full" v-if="index > 0">
          <hr class="border-dashed border-zinc-200" />
        </div>
        <PropsPartialItem :prop v-model="field" :propertyKey="key" />
        <!-- <div class="col-span-full grid grid-cols-subgrid">
          <div class="flex text-sm font-medium">
            <div class="self-center">{{ prop.label ?? toTitleCase(key.toString()) }}</div>
          </div>
          <div>
            <template v-if="prop.type === 'string'">
              <PrimeVue.InputText size="small" fluid type="text" v-model="field.props[key]" />
            </template>
            <template v-else-if="prop.type === 'number'">
              <PrimeVue.InputNumber
                size="small"
                fluid
                v-model="field.props[key]"
                v-bind="numberBindings(prop)"
              />
            </template>
            <template v-else-if="prop.type === 'select'">
              <PrimeVue.Select
                size="small"
                fluid
                v-model="field.props[key]"
                :options="[...prop.options]"
                optionLabel="label"
                optionValue="value"
              />
            </template>
            <template v-else-if="prop.type === 'boolean'">
              <PrimeVue.Select
                size="small"
                fluid
                v-model="field.props[key]"
                :options="[
                  { label: 'Yes', value: true },
                  { label: 'No', value: false },
                ]"
                optionLabel="label"
                optionValue="value"
              />
            </template>
            <template v-else>Not found {{ prop.type }}</template>
          </div>
        </div> -->
      </template>
    </div>
  </details>
</template>
