<script setup lang="ts">
import * as PrimeVue from 'primevue'
import { type Option } from '@v3technology/core'
import { type MultiSelectFieldProps } from '@v3technology/definitions'
import { type FieldProps } from '../../types'
import { useValue } from '../../composables/useFormState'
import BaseField from '../BaseField.vue'
import ValueComponent from '../ValueComponent.vue'

const props = defineProps<FieldProps<MultiSelectFieldProps>>()
const { value } = useValue(props, null as Option[] | null)
</script>

<template>
  <BaseField v-bind="props">
    <ValueComponent v-bind="props" :value>
      <PrimeVue.MultiSelect
        v-model="value"
        :options="field.options"
        filter
        optionLabel="label"
        v-bind="props.field.props"
        data-field="multiselect"
        data-field-block
      />
    </ValueComponent>
  </BaseField>
</template>
