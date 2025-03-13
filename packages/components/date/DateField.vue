<script setup lang="ts">
import * as PrimeVue from 'primevue'
import { type FieldProps } from '~/types'
import { useValue } from '~/composables/useFormState'
import { computed } from 'vue'
import BaseField from '../BaseField.vue'
import ValueComponent from '../ValueComponent.vue'

const props = defineProps<FieldProps>()

const { value } = useValue(props, null as Date | null)

const formattedValue = computed(() => {
  if (!value.value) return null
  const dt = new Date(value.value)
  return dt.toLocaleDateString()
})
</script>

<template>
  <BaseField v-bind="props">
    <ValueComponent v-bind="props" :value="formattedValue">
      <PrimeVue.DatePicker
        v-model="value" class="w-56"
        showIcon
        iconDisplay="input"
        data-field="date"
        data-field-block
      />
    </ValueComponent>
  </BaseField>
</template>
