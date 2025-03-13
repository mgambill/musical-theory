<script setup lang="ts">
import * as PrimeVue from 'primevue'
import { type FieldProps } from '~/types'
import { type NumberFieldProps } from '@v3technology/definitions'
import { useValue } from '~/composables/useFormState'
import BaseField from '../BaseField.vue'
import ValueComponent from '../ValueComponent.vue'

const props = defineProps<FieldProps<NumberFieldProps>>()
const { value } = useValue(props, null as number | null)
</script>

<template>
  <BaseField v-bind="props">
    <ValueComponent v-bind="props" :value="value">
      <PrimeVue.InputNumber
        v-model.number="value"
        v-bind="field.props"
        data-field="number"
        data-field-block
        class="min-w-0 [&_.p-inputnumber-input]:w-full"
      />
    </ValueComponent>
  </BaseField>
</template>
