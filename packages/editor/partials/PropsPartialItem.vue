<script setup lang="ts">
import type { Field, StringDictionary, ControlProperty } from '@v3technology/core'
import * as PrimeVue from 'primevue'

const field = defineModel<Field>()
const { prop, propertyKey: key } = defineProps<{
  prop: ControlProperty
  propertyKey: string
}>()

// convert repeateColumns to Repeat Columns
const toTitleCase = (str: string) => {
  return str.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())
}

const numberBindings = <T extends ControlProperty>(p: T) => {
  if (p.type !== 'number') return {}
  let attr = {} as StringDictionary
  if (p.min) attr.min = p.min
  if (p.max) attr.max = p.max

  return attr
}

const localValue = computed({
  get: () => field.value?.props?.[key] ?? prop.defaultValue,
  set: (value) => {
    if (field.value) {
      field.value.props ??= {}
      field.value.props[key] = value
    }
  },
})
</script>

<template>
  <div class="col-span-full grid grid-cols-subgrid">
    <div class="flex text-sm font-medium">
      <div class="self-center">{{ prop.label ?? toTitleCase(key.toString()) }}</div>
    </div>
    <div>
      <template v-if="prop.type === 'string'">
        <PrimeVue.InputText size="small" fluid type="text" v-model="localValue" />
      </template>
      <template v-else-if="prop.type === 'number'">
        <PrimeVue.InputNumber
          size="small"
          fluid
          v-model="localValue"
          v-bind="numberBindings(prop)"
        />
      </template>
      <template v-else-if="prop.type === 'select'">
        <PrimeVue.Select
          size="small"
          fluid
          v-model="localValue"
          :options="[...prop.options]"
          optionLabel="label"
          optionValue="value"
        />
      </template>
      <template v-else-if="prop.type === 'boolean'">
        <PrimeVue.Select
          size="small"
          fluid
          v-model="localValue"
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
  </div>
</template>
