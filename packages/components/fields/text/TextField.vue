<script setup lang="ts">
import * as PrimeVue from 'primevue'
import { type FieldProps } from '../../types'
import { useValue } from '../../composables/useFormState'
import BaseField from '../BaseField.vue'
import ValueComponent from '../ValueComponent.vue'
const props = defineProps<FieldProps<FieldProps>>()
const { value } = useValue(props, '')
</script>

<template>
  <BaseField v-bind="props">
    <ValueComponent v-bind="props" :value="value">
      <PrimeVue.InputText
        type="text"
        v-model="value"
        data-field="text"
        data-field-block
        fluid
        v-bind="props.field.attrs"
      />
    </ValueComponent>
  </BaseField>
</template>
