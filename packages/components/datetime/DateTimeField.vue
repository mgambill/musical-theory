<script setup lang="ts">
import { computed } from 'vue'
import * as PrimeVue from 'primevue'
import { useValue } from '~/composables/useFormState'

import { type FieldProps } from '~/types'
import BaseField from '../BaseField.vue'
import ValueComponent from '../ValueComponent.vue'
const props = defineProps<FieldProps>()

const { value } = useValue(props, null as Date | null)

const formattedValue = computed(() => {
  if (!value.value) return null
  const dt = new Date(value.value)
  return `${dt.toLocaleDateString()} ${dt.toLocaleTimeString()}`
})
</script>

<template>
  <BaseField v-bind="props">
    <ValueComponent v-bind="props" :value="formattedValue">
      <PrimeVue.DatePicker
        v-model="value"
        showTime
        showIcon
        hourFormat="12"
        iconDisplay="input"
        data-field="datetime"
        data-field-block
      />
    </ValueComponent>
  </BaseField>
</template>
