<script setup lang="ts">
import * as PrimeVue from 'primevue'
import { type Option } from '@v3technology/core'
import { type DropdownFieldProps } from '@v3technology/definitions'
import { useValue } from '../../composables/useFormState'
import { type FieldProps } from '../../types'
import BaseField from '../BaseField.vue'
import ValueComponent from '../ValueComponent.vue'
const props = defineProps<FieldProps<DropdownFieldProps>>()
const { value } = useValue(props, null as Option | null)
</script>

<template>
  <BaseField v-bind="props">
    <ValueComponent v-bind="props" :value="value">
      <PrimeVue.Select
        v-model="value"
        :options="props.field.options"
        optionLabel="label"
        class="md:w-14rem w-full"
        data-field="dropdown"
        data-field-block
    /></ValueComponent>
  </BaseField>
</template>
